import {useEffect, useState} from 'react';
import {getGoogle, getStreetViewService} from './getGoogle';

const positionAndPanoDefaultValue = {position: null, pano: null};

function requestPanoramaFromService(configuration) {
    const google = getGoogle(window);
    const streetViewService = getStreetViewService(google);

    return new Promise(resolve => {
        streetViewService.getPanorama(configuration, (data, status) => {
            if (status === google.maps.StreetViewStatus.OK) {
                resolve(data.location);
            }
            resolve(null);
        });
    });
}

export const useLocationRequest = (location = {lat: '', lng: ''}, address = '') => {
    const google = getGoogle(window);

    // 1. Calls to `service.getPanorama` are async
    // 2. `setPositionAndPano` is created when `useLocationRequest` is called
    //    in `_RecordStreetView`, which is ultimately the thing that
    //    renders the street view for the record selected.
    // 3. If for some reason the user is faster than the call to
    //    `service.getPanorama`, we need some way to signal that a
    //    "late" arriving response from `service.getPanorama` must
    //    be ignored (because we don't need that response anymore,
    //    as the user has moved on to a different record).
    // 4. The funciton returned by the `useEffect` handler
    //    (the kind-like-"unmount") gives us the opportunity to
    //    create that "signal". In this case, the signal is "assign
    //    the value `null` to `setPositionAndPano`".
    // 5. Once the async request to `service.getPanorama` is resolved
    //    and `setPositionAndPano` still has a non-falsy value assigned to it,
    //    then we call it with the result of `service.getPanorama`.

    // Create these as let bindings to allow re-assigning the
    // value of `setPositionAndPano` in the useEffect cleanup handler.
    let [positionAndPano, setPositionAndPano] = useState(positionAndPanoDefaultValue);

    useEffect(() => {
        if (google && location) {
            const {
                maps: {StreetViewPreference, StreetViewSource},
            } = google;

            (async function() {
                const configurations = [
                    {
                        // First check for the more specific street view pano
                        // for this location.
                        location,
                        preference: StreetViewPreference.NEAREST,
                        source: StreetViewSource.OUTDOOR,
                    },
                    {
                        // If the first configuration yielded no results, then
                        // fallback to request a less specific street view pano.
                        location,
                    },
                ];

                let position = null;
                let pano = null;
                for (const configuration of configurations) {
                    const result = await requestPanoramaFromService(configuration);
                    // Once there is a usable pano id and latLng, we can bail out.
                    // Ideally this is fulfilled with the first configuration.
                    if (result && result.pano && result.latLng) {
                        position = result.latLng;
                        pano = result.pano;
                        break;
                    }
                }
                // As long as setPositionAndPano was not reassigned to null in the
                // useEffect cleanup function, then this is still the result
                // we're expecting and shall display in the street view render.
                if (setPositionAndPano) {
                    setPositionAndPano({position, pano});
                }
            })();
        }

        return () => {
            // When cleanup is called, call setPositionAndPano with the default values,
            // which will clear the street view for the next address.
            setPositionAndPano(positionAndPanoDefaultValue);
            // Reassign the value of setPositionAndPano to null. This will be used as
            // a signal inside the async section above. If a response is late, this
            // will be used as a signal that the response must be ignored.
            //
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setPositionAndPano = null;
        };
    }, [google, address, location.lat, location.lng]);

    return positionAndPano;
};

export default useLocationRequest;
