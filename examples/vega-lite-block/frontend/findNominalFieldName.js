import {InitialNominalFieldTypes} from './types';
/**
 * findNominalFieldName
 * @param  {Table} table
 * @return {string}       The name of the first matching field.
 */
export default function findNominalFieldName(table) {
    let nominalFieldName = null;
    outer: for (let fieldType of InitialNominalFieldTypes) {
        for (let field of table.fields) {
            if (field.type === fieldType) {
                nominalFieldName = field.name;
                break outer;
            }
        }
    }
    return nominalFieldName;
}
