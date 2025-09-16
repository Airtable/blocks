const protocol = '[REPLACE_PROTOCOL]';
const host = 'localhost';
const port = [REPLACE_PORT];

const url = `${protocol}://${host}:${port}/blocks-esbuild`;

new EventSource(url).addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.status === 'error') {
        throw new Error(data.error.message);
    }
    if (data.status === 'ready' && data.reload) {
        location.reload();
    }
    if (data.status === 'server-terminating') {
        throw new Error('Disconnected from development server');
    }
});
