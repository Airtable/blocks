// @flow
import React, {useState, useRef, useEffect} from 'react';
import {ProgressBar} from '@airtable/blocks/ui';

export default function ProgressBarExample(props: void) {
    const [progress, setProgress] = useState(0);
    const requestRef = useRef();

    const tick = () => {
        setProgress(prevProgress => (prevProgress += 0.001));
        requestRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(tick);
        return () => {
            const requestId = requestRef.current;
            if (requestId) {
                cancelAnimationFrame(requestId);
            }
        };
    }, []);

    return <ProgressBar barColor="#20C933" progress={progress} maxWidth="400px" height={8} />;
}
