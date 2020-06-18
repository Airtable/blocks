/**
 * Visit all properties of an object recursively.
 *
 * If the callback behaves as a predicate and produces a return value,
 * that value is returned by "visitor" and visitation is terminated.
 *
 * If the callback does not return a value, every node in object structure
 * wil be visited.
 *
 * @param {Object} object - the object containing properties to visit
 * @param {Function} callback - the visitor function
 * @return {any}
 */
export default function visitor(object, callback) {
    let returnValue;
    if (object != null) {
        for (const [key, value] of Object.entries(object)) {
            returnValue = callback(object, key, value);
            if (returnValue !== undefined) {
                return returnValue;
            } else {
                if (typeof value === 'function' || typeof value === 'object') {
                    returnValue = visitor(value, callback);
                    if (returnValue !== undefined) {
                        return returnValue;
                    }
                }
            }
        }
    }
    return returnValue;
}
