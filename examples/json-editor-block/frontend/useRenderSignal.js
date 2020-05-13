import {useState, useCallback} from 'react';

export default () => {
    const [value, setValue] = useState(0);
    const forceRerender = useCallback(() => {
        setValue(v => v + 1);
    }, [setValue]);

    return [value, forceRerender];
};
