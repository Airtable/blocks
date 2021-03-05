import express from 'express';
import stripAnsi from 'strip-ansi';

import {BLOCK_REQUEST_BODY_LIMIT} from '../settings';
import {BuildState, BuildStateBuilt, BuildStateError, BuildStatus} from '../tasks/run';
import {spawnUnexpectedError} from './error_utils';

export interface RunFrameRouteOptions {
    getBuildState(): BuildState;
    getBuildStateResultAsync(): Promise<BuildStateBuilt | BuildStateError>;
}

export function createRunFrameRoutes({
    getBuildState,
    getBuildStateResultAsync,
}: RunFrameRouteOptions) {
    const runFrameRoutes = express.Router();

    // Use body parser for JSON payloads.
    runFrameRoutes.use(express.json({limit: BLOCK_REQUEST_BODY_LIMIT}));

    /**
     * This endpoint is used by the block frame to check if the
     * local block server is responding or not.
     */
    runFrameRoutes.head('/ping', (req, res) => {
        res.sendStatus(200);
    });

    runFrameRoutes.get('/ping.gif', (req, res) => {
        // This is used by the web client to detect if blocks-cli is running,
        // and if HTTPS is being blocked. An image can get around CORS, since
        // we can't make an XHR request to HTTP.
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

    // Serve the bundle file if ready.
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

    runFrameRoutes.get('/poll_script.js', async (req, res) => {
        res.redirect('/poll_script.js');
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

    return runFrameRoutes;
}
