import {useState, useEffect} from 'react';
import {getGoogle} from './getGoogle';

const locationDefaultState = {position: null, pano: null};

export const useLocationRequest = (location, address) => {
    const panoPair = useState(locationDefaultState);
    let [pano, setPano] = panoPair;

    const google = getGoogle(window);
    useEffect(() => {
        if (google && location) {
            const service = new google.maps.StreetViewService();
            service.getPanorama(
                {
                    location,
                    preference: google.maps.StreetViewPreference.NEAREST,
                    source: google.maps.StreetViewSource.OUTDOOR,
                },
                (data, status) => {
                    if (status === google.maps.StreetViewStatus.OK && setPano) {
                        setPano({
                            position: data.location.latLng,
                            pano: data.location.pano,
                        });
                    }
                },
            );
        }

        return () => {
            setPano(locationDefaultState);
            setPano = null;
        };
    }, [google, address]);

    return pano;
};

export default useLocationRequest;
