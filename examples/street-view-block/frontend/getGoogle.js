/**
 * @param {any} window
 */
export const getGoogle = window => {
    return window.google;
};

let streetViewService = null;
export const getStreetViewService = google => {
    if (streetViewService) {
        return streetViewService;
    }
    return (streetViewService = new google.maps.StreetViewService());
};
