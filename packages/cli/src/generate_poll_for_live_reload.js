// @flow
function generatePollForLiveReload(blockServerUrl: string) {
    return `
function pollForLiveReload() {
    var blockUrl = '${blockServerUrl}';

    // There seems to be a bug where Chrome tries to batch requests to the
    // same URL, but only one iframe will get the response. We get around it
    // by adding a random query param to each request. Otherwise, if multiple
    // dev iframes are running, only one of them will live reload.
    fetch(blockUrl + '/__runFrame/poll?random=' + Math.random()).then(function(response) {
        if (response.status === 200) {
            window.location.reload();
        } else if (response.status === 304) {
            pollForLiveReload();
        } else {
            throw new Error('Unknown error from development server');
        }
    }).catch(err => {
        setTimeout(() => {
            throw new Error('Disconnected from development server');
        });
    });
}
pollForLiveReload();
`;
}

module.exports = generatePollForLiveReload;
