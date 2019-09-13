// @flow
import {useRef} from 'react';

/**
 * As long as the array passed to this hook shallow-equals its previous value, this hook will
 * return the same array instance. This is useful when writing hooks that accept arrays - it might
 * be convenient for the consumer of the hook to write their array inline, but that won't have
 * have referential equality which might make using the array with `useEffect` or similar tricky.
 * `useArrayIdentity` can wrap that array, making it easier to use with hooks like `useEffect`.
 *
 * @private
 */
export default function useArrayIdentity<T>(array: $ReadOnlyArray<T>): $ReadOnlyArray<T> {
    const arrayRef = useRef(array);

    if (arrayRef.current !== array) {
        if (arrayRef.current.length !== array.length) {
            arrayRef.current = array;
        } else {
            for (let i = 0; i < array.length; i++) {
                if (arrayRef.current[i] !== array[i]) {
                    arrayRef.current = array;
                    break;
                }
            }
        }
    }

    return arrayRef.current;
}
