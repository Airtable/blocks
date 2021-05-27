import express from 'express';
import stripAnsi from 'strip-ansi';

import {BLOCK_REQUEST_BODY_LIMIT} from '../settings';
import {BuildState, BuildStateBuilt, BuildStateError, BuildStatus} from '../tasks/run';
import {RemoteConfig} from './config_remote';
import {invariant, spawnUnexpectedError} from './error_utils';
import {RenderMessage} from './render_message';

export enum DevelopmentRunFrameMessageName {
    DEVELOPMENT_RUN_FRAME_ORIGINAL_BLOCK_ONLY = 'developmentRunFrameOriginalBlockOnly',
    DEVELOPMENT_RUN_FRAME_NEW_BLOCK_INSTALLATION = 'developmentRunFrameNewBlockInstallation',
}

export interface DevelopmentRunFrameOriginalBlockOnlyMessage {
    type: DevelopmentRunFrameMessageName.DEVELOPMENT_RUN_FRAME_ORIGINAL_BLOCK_ONLY;
}

export interface DevelopmentRunFrameNewBlockInstallationMessage {
    type: DevelopmentRunFrameMessageName.DEVELOPMENT_RUN_FRAME_NEW_BLOCK_INSTALLATION;
}

export type DevelopmentRunFrameMessageInfo =
    | DevelopmentRunFrameOriginalBlockOnlyMessage
    | DevelopmentRunFrameNewBlockInstallationMessage;

export interface RunFrameRouteOptions {
    remoteConfig: RemoteConfig;
    userAgent: string;
    messages: RenderMessage<DevelopmentRunFrameMessageInfo, any>;

    getBuildState(): BuildState;
    getBuildStateResultAsync(): Promise<BuildStateBuilt | BuildStateError>;

    setBlockInstallationId(id: string): void;
}

export function createRunFrameRoutes({
    remoteConfig,
    userAgent,
    messages,

    getBuildState,
    getBuildStateResultAsync,

    setBlockInstallationId,
}: RunFrameRouteOptions) {
    const runFrameRoutes = express.Router();

    runFrameRoutes.use(express.json({limit: BLOCK_REQUEST_BODY_LIMIT}));

    /**
     * This endpoint is used by the block frame to check if the
     * local block server is responding or not.
     */
    runFrameRoutes.head('/ping', (req, res) => {
        res.sendStatus(200);
    });

    runFrameRoutes.get('/ping.gif', (req, res) => {
        const img = Buffer.from(
            'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            'base64',
        );
        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': `${img.length}`,
        });
        res.end(img);
    });

    runFrameRoutes.get('/bundle.js', async (req, res) => {
        const buildResult = await getBuildStateResultAsync();
        switch (buildResult.status) {
            case BuildStatus.READY:
                res.redirect('/bundle.js');
                break;
            case BuildStatus.ERROR:
                res.sendStatus(422);
                break;
            default:
                throw spawnUnexpectedError(
                    'Unexpected build status: %s',
                    (buildResult as any).status,
                );
        }
    });

    /**
     * Code in Hyperbase causes the frame to request a file named
     * `poll_script.js` to initiate "live reloading." That functionality is
     * provided by a script which is generated alongside the bundle of the App
     * being run in development. Redirect the request to the location where the
     * development server exposes that script.
     */
    runFrameRoutes.get('/poll_script.js', async (req, res) => {
        res.redirect('/live-reload-and-report-disconnection.js');
    });

    /**
     * This endpoint is used by the block frame for two reasons:
     * 1. For connection error checks to make sure the local block server is running
     * 2. To fetch and display any relevant bundle errors. This information is served
     *    by a separate endpoint instead of putting it in the `GET /bundle.js` response
     *    because the block frame loads the `GET /bundle.js` info via a <script> tag,
     *    which doesn't allow us to peek into the HTTP response of the script load request.
     */
    runFrameRoutes.get('/bundleStatus', (req, res) => {
        const buildState = getBuildState();
        let stack = {};
        if (buildState.status === BuildStatus.ERROR) {
            stack = {error: {stack: stripAnsi(buildState.error.message)}};
        }

        res.status(200).send({
            status: buildState.status,
            ...stack,
        });
    });

    runFrameRoutes.options('/registerBlockInstallationMetadata', (req, res) => {
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Max-Age': '86400',
            'Access-Control-Allow-Headers': 'Content-Type',
        })
            .status(200)
            .end();
    });

    runFrameRoutes.post('/registerBlockInstallationMetadata', (req, res) => {
        if (
            !req.body ||
            !req.body.applicationId ||
            !req.body.blockId ||
            !req.body.blockInstallationId
        ) {
            res.status(400).send({
                error: 'BAD_REQUEST',
                message: 'Invalid request body',
            });
        } else if (req.body.applicationId !== remoteConfig.baseId) {
            res.status(403).send({
                error: 'FORBIDDEN',
                message: messages.renderMessage({
                    type: DevelopmentRunFrameMessageName.DEVELOPMENT_RUN_FRAME_ORIGINAL_BLOCK_ONLY,
                }),
            });
        } else if (req.body.blockId !== remoteConfig.blockId) {
            res.status(403).send({
                error: 'FORBIDDEN',
                message: messages.renderMessage({
                    type: DevelopmentRunFrameMessageName.DEVELOPMENT_RUN_FRAME_ORIGINAL_BLOCK_ONLY,
                }),
            });
        } else {
            invariant(
                typeof req.body.applicationId === 'string',
                'expects req.body.applicationId to be a string',
            );
            invariant(
                typeof req.body.blockInstallationId === 'string',
                'req.body.blockInstallationId to be a string',
            );
            setBlockInstallationId(req.body.blockInstallationId);
            res.status(200).send({userAgent});
        }
    });

    return runFrameRoutes;
}
