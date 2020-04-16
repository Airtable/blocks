import mockProjectTrackerAirtableInterface from '../airtable_interface_mocks/project_tracker';
import Base from '../../src/models/base';
import Table from '../../src/models/table';
import Field from '../../src/models/field';
import View from '../../src/models/view';
import {FieldType} from '../../src/types/field';
import {MutationTypes} from '../../src/types/mutations';

jest.mock('../../src/injected/airtable_interface', () => mockProjectTrackerAirtableInterface);

let mockMutations: any;
jest.mock('../../src/get_sdk', () => () => ({
    __mutations: mockMutations,
    runInfo: {
        isDevelopment: true,
    },
}));

describe('Table', () => {
    let base: Base;
    let table: Table;
    beforeEach(() => {
        base = new Base(
            mockProjectTrackerAirtableInterface.sdkInitData.baseData as any,
            mockProjectTrackerAirtableInterface as any,
        );
        table = base.getTableByName('Design projects');
    });

    describe('getFieldIfExists', () => {
        it('returns field by id', () => {
            const field1 = table.getFieldIfExists('fldXaTPfxIVhAUYde') as Field;
            const field2 = table.getFieldIfExists('fld3DvZllJtyaNYpm') as Field;
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldXaTPfxIVhAUYde');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fld3DvZllJtyaNYpm');
        });

        it('returns field by name', () => {
            const field1 = table.getFieldIfExists('Category') as Field;
            const field2 = table.getFieldIfExists('Complete') as Field;
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldRljtoVpOt1IDYH');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fldHOlUIpjmlYj549');
        });

        it('returns null when field not found', () => {
            expect(table.getFieldIfExists('fldHOlUIpjmlyFAKE')).toBe(null);
            expect(table.getFieldIfExists('A made up field')).toBe(null);
        });
    });

    describe('getField', () => {
        it('returns field by id', () => {
            const field1 = table.getField('fldXaTPfxIVhAUYde');
            const field2 = table.getField('fld3DvZllJtyaNYpm');
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldXaTPfxIVhAUYde');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fld3DvZllJtyaNYpm');
        });

        it('returns field by name', () => {
            const field1 = table.getField('Category');
            const field2 = table.getField('Complete');
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldRljtoVpOt1IDYH');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fldHOlUIpjmlYj549');
        });

        it('throws when field not found', () => {
            expect(() => table.getField('fldHOlUIpjmlyFAKE')).toThrowErrorMatchingInlineSnapshot(
                `"No field with ID or name 'fldHOlUIpjmlyFAKE' in table 'Design projects'"`,
            );
            expect(() => table.getField('A made up field')).toThrowErrorMatchingInlineSnapshot(
                `"No field with ID or name 'A made up field' in table 'Design projects'"`,
            );
        });
    });

    describe('getViewIfExists', () => {
        it('returns view by id', () => {
            const view1 = table.getViewIfExists('viwkNnS94RQAQQTMn') as View;
            const view2 = table.getViewIfExists('viwqo8mFAqy2HYSCL') as View;
            expect(view1).toBeInstanceOf(View);
            expect(view1.id).toBe('viwkNnS94RQAQQTMn');
            expect(view2).toBeInstanceOf(View);
            expect(view2.id).toBe('viwqo8mFAqy2HYSCL');
        });

        it('returns view by name', () => {
            const view1 = table.getViewIfExists('Completed projects') as View;
            const view2 = table.getViewIfExists('Project calendar') as View;
            expect(view1).toBeInstanceOf(View);
            expect(view1.id).toBe('viw8v5XkLudbiCJfD');
            expect(view2).toBeInstanceOf(View);
            expect(view2.id).toBe('viwhz3PjFATSxaV5X');
        });

        it('returns null when view not found', () => {
            expect(table.getViewIfExists('viwA4Tzw8IJchFAKE')).toBe(null);
            expect(table.getViewIfExists('A made up view')).toBe(null);
        });
    });

    describe('getView', () => {
        it('returns view by id', () => {
            const view1 = table.getView('viwA4Tzw8IJcHHgul');
            const view2 = table.getView('viwkNnS94RQAQQTMn');
            expect(view1).toBeInstanceOf(View);
            expect(view1.id).toBe('viwA4Tzw8IJcHHgul');
            expect(view2).toBeInstanceOf(View);
            expect(view2.id).toBe('viwkNnS94RQAQQTMn');
        });

        it('returns view by name', () => {
            const view1 = table.getView('Incomplete projects by leader');
            const view2 = table.getView('Completed projects');
            expect(view1).toBeInstanceOf(View);
            expect(view1.id).toBe('viwqo8mFAqy2HYSCL');
            expect(view2).toBeInstanceOf(View);
            expect(view2.id).toBe('viw8v5XkLudbiCJfD');
        });

        it('throws when view not found', () => {
            expect(() => table.getView('viwhz3PjFATSxFAKE')).toThrowErrorMatchingInlineSnapshot(
                `"No view with ID or name 'viwhz3PjFATSxFAKE' in table 'Design projects'"`,
            );
            expect(() => table.getView('A made up view')).toThrowErrorMatchingInlineSnapshot(
                `"No view with ID or name 'A made up view' in table 'Design projects'"`,
            );
        });
    });

    describe('createFieldAsync', () => {
        let mockGetFieldById: any;
        beforeEach(() => {
            mockMutations = {
                applyMutationAsync: jest.fn(),
            };

            mockGetFieldById = jest
                .spyOn(table, 'getFieldById')
                .mockImplementation(fieldId => new Field(base.__baseData, table, fieldId));
        });

        it('accepts null field options and omits them from config', async () => {
            await table.unstable_createFieldAsync('name', FieldType.SINGLE_LINE_TEXT, null);

            expect(mockMutations.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockMutations.applyMutationAsync).toHaveBeenLastCalledWith({
                type: MutationTypes.CREATE_SINGLE_FIELD,
                tableId: table.id,
                id: 'fldGeneratedMockId',
                name: 'name',
                config: {
                    type: FieldType.SINGLE_LINE_TEXT,
                },
            });

            expect(mockGetFieldById).toHaveBeenCalledTimes(1);
            expect(mockGetFieldById).toHaveBeenLastCalledWith('fldGeneratedMockId');
        });

        it('accepts undefined field options and omits them from config', async () => {
            await table.unstable_createFieldAsync('name', FieldType.SINGLE_LINE_TEXT);

            expect(mockMutations.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockMutations.applyMutationAsync).toHaveBeenLastCalledWith({
                type: MutationTypes.CREATE_SINGLE_FIELD,
                tableId: table.id,
                id: 'fldGeneratedMockId',
                name: 'name',
                config: {
                    type: FieldType.SINGLE_LINE_TEXT,
                },
            });

            expect(mockGetFieldById).toHaveBeenCalledTimes(1);
            expect(mockGetFieldById).toHaveBeenLastCalledWith('fldGeneratedMockId');
        });

        it('accepts non-null field options', async () => {
            await table.unstable_createFieldAsync('name', FieldType.SINGLE_SELECT, {
                choices: [{name: 'pick me'}],
            });

            expect(mockMutations.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockMutations.applyMutationAsync).toHaveBeenLastCalledWith({
                type: MutationTypes.CREATE_SINGLE_FIELD,
                tableId: table.id,
                id: 'fldGeneratedMockId',
                name: 'name',
                config: {
                    type: FieldType.SINGLE_SELECT,
                    options: {
                        choices: [{name: 'pick me'}],
                    },
                },
            });

            expect(mockGetFieldById).toHaveBeenCalledTimes(1);
            expect(mockGetFieldById).toHaveBeenLastCalledWith('fldGeneratedMockId');
        });
    });
});
