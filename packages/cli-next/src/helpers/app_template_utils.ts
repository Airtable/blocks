
import {Octokit} from '@octokit/rest';
import tar from 'tar';
import fetch from 'node-fetch';
import {System} from './system';
import {invariant} from './error_utils';
import {mkdirpAsync} from './system_extra';

export async function getGithubTemplateTarballUrlAsync(templateUrl: string) {
    const octokit = new Octokit({});
    const pathComponents = new URL(templateUrl).pathname.split('/');
    const [, owner, repo] = pathComponents;

    try {
        const {url} = await octokit.repos.downloadTarballArchive({
            owner,
            repo,
            ref: 'master',
        });
        return url;
    } catch (e) {
        if (e.status === 404) {
            e.message = `Template ${templateUrl} is not a public repo that could be found on Github`;
        }
        throw e;
    }
}

export async function downloadTarballAsync(
    sys: System,
    tarballUrl: string,
    destinationPath: string,
): Promise<void> {
    await mkdirpAsync(sys, sys.path.dirname(destinationPath));

    const response = await fetch(tarballUrl);
    const buffer = await response.buffer();

    await sys.fs.writeFileAsync(destinationPath, buffer);
}

export async function extractTarballAsync(
    sys: System,
    tarballPath: string,
    destinationDir: string,
): Promise<string> {
    await sys.fs.mkdirAsync(destinationDir, {recursive: true});
    await tar.extract({file: tarballPath, cwd: destinationDir});

    const entries = await sys.fs.readdirAsync(destinationDir, {
        withFileTypes: true,
        encoding: 'utf8',
    });
    const templateDir = entries.find(dirent => dirent.isDirectory());
    invariant(templateDir !== undefined, 'template does not contain a directory');

    return sys.path.join(destinationDir, templateDir.name);
}
