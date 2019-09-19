// @flow
import getSdk from '../get_sdk';
import type Field from './field';

const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);
const {PublicApiVersions} = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/api_versions',
);

export type CellValueValidationResult = {|isValid: true|} | {|isValid: false, reason: string|};

const publicCellValueUtils = {
    parsePublicApiCellValue(publicCellValue: mixed, field: Field): mixed {
        return columnTypeProvider.parsePublicApiCellValue(
            publicCellValue,
            field.__getRawType(),
            field.__getRawTypeOptions(),
            getSdk().__appInterface,
            PublicApiVersions.API2,
        );
    },
    validatePublicCellValueForUpdate(
        newPublicCellValue: mixed,
        currentPublicCellValue: mixed,
        field: Field,
    ): CellValueValidationResult {
        if (columnTypeProvider.isComputed(field.__getRawType())) {
            return {isValid: false, reason: `${field.type} fields cannot be updated`};
        }

        const currentPrivateCellValue = this.parsePublicApiCellValue(currentPublicCellValue, field);
        const validationResult = columnTypeProvider.validatePublicApiCellValueForUpdate(
            newPublicCellValue,
            currentPrivateCellValue,
            field.__getRawType(),
            field.__getRawTypeOptions(),
            getSdk().__appInterface,
            PublicApiVersions.API2,
        );
        if (!validationResult.isValid) {
            return {isValid: false, reason: `Invalid cell value: ${validationResult.reason}`};
        }

        return {isValid: true};
    },
};

export default publicCellValueUtils;
