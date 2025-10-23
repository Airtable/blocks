import {
    RunTaskConsumer,
    RunDevServerOptions,
    BuildStatus,
    RunDevServerMethods,
    ReleaseTaskConsumer,
    ReleaseBundleOptions,
    SubmitFindDependenciesOptions,
    SubmitTaskConsumer,
} from '@airtable/blocks-cli';

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import {execSync} from 'child_process';
import * as http from 'http';

const TAILWIND_CLI_PATH = 'node_modules/.bin/tailwindcss';

class BlockBundler implements RunTaskConsumer, ReleaseTaskConsumer, SubmitTaskConsumer {
    private _projectRoot: string;
    private _context?: esbuild.BuildContext<esbuild.BuildOptions>;
    private _devServer?: DevServer;

    constructor() {
        this._projectRoot = process.cwd();
    }

    private _getEsbuildOptions(options: {
        entry: string;
        mode: 'development' | 'production';
    }): esbuild.BuildOptions {
        const projectRoot = process.cwd();
        const tailwindCLIPathIfExists = path.join(projectRoot, TAILWIND_CLI_PATH);
        const tailwindCLI = fs.existsSync(tailwindCLIPathIfExists) ? tailwindCLIPathIfExists : null;

        return {
            bundle: true,
            target: ['chrome91', 'firefox94', 'safari14.1', 'edge107'],
            define: {},
            format: 'iife',
            jsx: 'automatic',
            jsxDev: options.mode === 'development',
            loader: {
                '.js': 'jsx',
                '.md': 'text',
            },
            sourcemap: false,
            supported: {
                'object-rest-spread': false,
            },
            external: [],
            alias: {},
            plugins: [
                {
                    name: 'inline-styles',
                    setup: ({onLoad}: esbuild.PluginBuild): void => {
                        onLoad({filter: /\.css$/}, async (args) => {
                            let cssText = fs.readFileSync(args.path, 'utf8');

                            if (tailwindCLI) {
                                cssText = await processTailwindCSSAsync(
                                    tailwindCLI,
                                    cssText,
                                    args.path,
                                    this._projectRoot,
                                );
                            }

                            return {
                                loader: 'js',
                                contents:
                                    `const style = document.createElement('style');\n` +
                                    `style.textContent = ${JSON.stringify(cssText)};\n` +
                                    'document.head.appendChild(style);\n',
                            };
                        });
                    },
                },
            ],
            splitting: false,
            ...(options.mode === 'production'
                ? {
                      minify: true,
                      treeShaking: true,
                      legalComments: 'none',
                  }
                : {}),
            entryPoints: [options.entry],
        };
    }

    public async bundleAsync(options: ReleaseBundleOptions): Promise<void> {
        const result = await esbuild.build({
            ...this._getEsbuildOptions(options),
            outfile: path.join(options.outputPath, 'bundle.js'),
            outdir: undefined,
            write: true,
        });
        if (result.errors.length > 0) {
            throw new Error(
                [
                    `esbuild failed with ${result.errors.length} errors:\n`,
                    ...esbuild
                        .formatMessagesSync(result.errors, {
                            kind: 'error',
                            color: false,
                            terminalWidth: 0,
                        })
                        .map((line) => `\t${line}`),
                ].join('\n'),
            );
        }
    }

    public async startDevServerAsync(
        options: RunDevServerOptions & RunDevServerMethods,
    ): Promise<void> {
        let resolveInitialBuild: () => void;
        const initialBuildPromise = new Promise<void>((resolve) => {
            resolveInitialBuild = resolve;
        });

        options.emitBuildState({status: BuildStatus.START});
        const outfilePath = path.join(options.tmpPath, 'bundle.js');
        const esbuildOptions: esbuild.BuildOptions = {
            ...this._getEsbuildOptions(options),
            outfile: outfilePath,
            outdir: undefined,
            write: true,
        };
        esbuildOptions.logLevel = 'silent';
        esbuildOptions.plugins = esbuildOptions.plugins ?? [];

        let isFirstBuild = true;
        esbuildOptions.plugins.push({
            name: 'build-state-notify',
            setup: (build) => {
                build.onStart(() => {
                    options.emitBuildState({status: BuildStatus.BUILDING});
                });
                build.onEnd((result) => {
                    if (isFirstBuild) {
                        resolveInitialBuild();
                        isFirstBuild = false;
                    }
                    if (result.errors.length > 0) {
                        const errorMessage = [
                            ...esbuild.formatMessagesSync(result.errors, {
                                kind: 'error',
                                color: false,
                                terminalWidth: 0,
                            }),
                            ...esbuild.formatMessagesSync(result.warnings, {
                                kind: 'warning',
                                color: false,
                                terminalWidth: 0,
                            }),
                        ].join('\n');
                        if (this._devServer) {
                            this._devServer.sendMessageToClients({
                                status: BuildStatus.ERROR,
                                error: {
                                    message: errorMessage,
                                },
                            });
                        }
                        options.emitBuildState({
                            status: BuildStatus.ERROR,
                            error: {
                                message: errorMessage,
                            },
                        });
                    } else {
                        if (this._devServer) {
                            this._devServer.sendMessageToClients({
                                status: BuildStatus.READY,
                                reload: true,
                            });
                        }
                        options.emitBuildState({status: BuildStatus.READY});

                        if (result.warnings.length > 0) {
                            // eslint-disable-next-line no-console
                            console.log(
                                esbuild
                                    .formatMessagesSync(result.warnings, {
                                        kind: 'warning',
                                        color: false,
                                    })
                                    .join('\n'),
                            );
                        }
                    }
                });
            },
        });
        this._context = await esbuild.context(esbuildOptions);
        await this._context.watch();

        await initialBuildPromise;
        this._devServer = await DevServer.startAsync({
            outfilePath,
            port: options.port,
            tmpPath: options.tmpPath,
            liveReload: options.liveReload,
        });
    }

    public async findDependenciesAsync(
        options: SubmitFindDependenciesOptions,
    ): Promise<{files: string[]}> {
        const fileDependencies: string[] = [];

        const esbuildOptions = {
            ...this._getEsbuildOptions(options),
            write: false,
            outdir: undefined,
            outfile: undefined,
            metafile: true,
        };
        esbuildOptions.plugins = esbuildOptions.plugins ?? [];
        esbuildOptions.plugins.push({
            name: 'collect-dependencies',
            setup(build: esbuild.PluginBuild) {
                build.onEnd((result: esbuild.BuildResult) => {
                    if (result.metafile) {
                        for (const inputPath of Object.keys(result.metafile.inputs)) {
                            const absolutePath = path.isAbsolute(inputPath)
                                ? inputPath
                                : path.resolve(inputPath);
                            fileDependencies.push(absolutePath);
                        }
                    }
                });
            },
        });

        const result = await esbuild.build(esbuildOptions);

        if (result.errors.length > 0) {
            throw new Error(
                [
                    `esbuild failed with ${result.errors.length} errors:\n`,
                    ...esbuild
                        .formatMessagesSync(result.errors, {
                            kind: 'error',
                            color: false,
                            terminalWidth: 0,
                        })
                        .map((line) => `\t${line}`),
                ].join('\n'),
            );
        }

        for (const file of [
            'package.json',
            'package-lock.json',
            'yarn.lock',
            'pnpm-lock.yaml',
            'tailwind.config.js',
        ]) {
            if (fs.existsSync(path.join(this._projectRoot, file))) {
                fileDependencies.push(path.resolve(path.join(this._projectRoot, file)));
            }
        }

        return {
            files: fileDependencies,
        };
    }

    public async teardownAsync(): Promise<void> {
        if (this._devServer) {
            await this._devServer.teardownAsync();
        }

        if (this._context) {
            await this._context.dispose();
        }
    }
}

interface DevServerOptions {
    outfilePath: string;
    port: number;
    tmpPath: string;
    liveReload: {
        https: boolean;
        port: number;
    };
}

class DevServer {
    private _server?: http.Server;
    private _clients: Set<http.ServerResponse> = new Set();
    private _signalHandlersSetup = false;

    private constructor() {}

    public static async startAsync(options: DevServerOptions): Promise<DevServer> {
        const devServer = new DevServer();
        await devServer._startAsync(options);
        return devServer;
    }

    private async _startAsync(options: DevServerOptions): Promise<void> {
        this._setupSignalHandlers();

        const sseSetup = (res: http.ServerResponse) => {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            this._clients.add(res);

            res.on('close', () => {
                this._clients.delete(res);
            });
        };

        const getLiveReloadAndReportDisconnectionFile = (): string => {
            const originalFile = fs.readFileSync(
                path.join(__dirname, 'live-reload-and-report-disconnection.js'),
                'utf8',
            );
            return originalFile
                .replace('[REPLACE_PORT]', `${options.liveReload.port}`)
                .replace('[REPLACE_PROTOCOL]', options.liveReload.https ? 'https' : 'http');
        };

        const getBundleFile = (): string => {
            return fs.readFileSync(options.outfilePath, 'utf8');
        };

        this._server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
            switch (req.url) {
                case '/blocks-esbuild': {
                    sseSetup(res);
                    break;
                }
                case '/live-reload-and-report-disconnection.js': {
                    res.writeHead(200, {
                        'Content-Type': 'application/javascript',
                    });
                    res.end(getLiveReloadAndReportDisconnectionFile());
                    break;
                }
                case '/bundle.js': {
                    res.writeHead(200, {
                        'Content-Type': 'application/javascript',
                    });
                    res.end(getBundleFile());
                    break;
                }
                default: {
                    res.writeHead(404, {
                        'Content-Type': 'text/plain',
                    });
                    res.end('Not found');
                    break;
                }
            }
        });
        this._server.listen(options.port);
    }

    private _setupSignalHandlers(): void {
        if (this._signalHandlersSetup) {
            return;
        }

        const handleSignal = async () => {
            await this.teardownAsync();
            process.exit(0);
        };

        process.on('SIGINT', handleSignal);
        process.on('SIGTERM', handleSignal);
        process.on('SIGHUP', handleSignal);

        this._signalHandlersSetup = true;
    }

    public sendMessageToClients(messageData: {[key: string]: unknown}): void {
        this._clients.forEach((client) => {
            client.write(`data: ${JSON.stringify(messageData)}\n\n`);
        });
    }

    public async teardownAsync(): Promise<void> {
        try {
            this.sendMessageToClients({
                status: 'server-terminating',
                message: 'Development server is shutting down',
            });
            this._clients.forEach((client) => {
                client.end();
            });
        } catch (error) {
        }

        this._clients.clear();

        if (this._server) {
            await new Promise<void>((resolve) => {
                this._server!.close(() => resolve());
            });
        }
    }
}

async function processTailwindCSSAsync(
    tailwindCLI: string,
    cssContent: string,
    cssPath: string,
    projectRoot: string,
): Promise<string> {
    try {
        const tempCssPath = path.join(projectRoot, `temp-${Date.now()}.css`);
        fs.writeFileSync(tempCssPath, cssContent);

        const outputPath = path.join(projectRoot, `temp-output-${Date.now()}.css`);
        const command = `"${tailwindCLI}" -i "${tempCssPath}" -o "${outputPath}" --minify`;

        execSync(command, {
            cwd: projectRoot,
            stdio: 'pipe', 
        });

        const processedCSS = fs.readFileSync(outputPath, 'utf8');

        fs.unlinkSync(tempCssPath);
        fs.unlinkSync(outputPath);

        return processedCSS;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Warning: Tailwind CSS processing failed for ${cssPath}:`, error);
        return cssContent;
    }
}

export default function (): BlockBundler {
    return new BlockBundler();
}
