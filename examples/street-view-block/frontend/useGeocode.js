import {useState, useRef} from 'react';
import {getGoogle} from './getGoogle';

const geocoderDefaultState = {requestAddress: null, address: null, location: null};

export const useGeocode = address => {
    const geocode = useRef(geocoderDefaultState);
    const [location, setLocation] = useState(null);

    const google = getGoogle(window);
    if (google) {
        if (geocode.current.requestAddress !== address) {
            geocode.current = {...geocode.current, requestAddress: address};

            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({address}, (results, status) => {
                if (geocode.current.requestAddress !== address) return;

                if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    const locationResult = results[0].geometry.location;
                    geocode.current = {
                        ...geocode.current,
                        location: {lat: locationResult.lat(), lng: locationResult.lng()},
                        address,
                    };
                } else {
                    geocode.current = {
                        ...geocode.current,
                        location: {locationNotFound: true},
                        address,
                    };
                }
                setLocation(geocode.current.location);
            });
        }
        return geocode.current.requestAddress === geocode.current.address ? location : null;
    }
    return {};
};
