import React from 'react';
import {act} from 'react-dom/test-utils';
import TestDriver from '@airtable/blocks-testing';
import {
    render,
    screen,
    waitFor,
    getByRole,
    getAllByRole,
    getByText,
    getNodeText,
} from '@testing-library/react';
import recordListFixture from './fixtures/simple_record_list';
import TodoApp from '../frontend/todo-app';
import userEvent from '@testing-library/user-event';

async function openAsync(table, view, field) {
    act(() => {
        const input = screen.getByLabelText('Table');
        const option = screen.getByText(table);

        userEvent.selectOptions(input, [option]);
    });

    act(() => {
        const input = screen.getByLabelText('View');
        const option = screen.getByText(view);

        userEvent.selectOptions(input, [option]);
    });

    act(() => {
        const input = screen.getByLabelText('Field');
        const option = screen.getByText(field);

        userEvent.selectOptions(input, [option]);
    });

    return waitFor(() => screen.getByRole('button', {name: 'Add'}));
}

function getItems() {
    return screen.queryAllByRole('checkbox').map(checkbox => {
        const container = checkbox.parentNode;
        const deleteButton = getByRole(container, 'button');
        const link = getByText(container, container.textContent.trim());

        return {container, checkbox, deleteButton, link};
    });
}

function readItems() {
    return getItems().map(item => ({
        checked: item.checkbox.checked,
        text: item.container.textContent.trim(),
    }));
}

describe('TodoApp', () => {
    let mutations;
    let addMutation = mutation => mutations.push(mutation);
    let testDriver;

    beforeEach(() => {
        testDriver = new TestDriver(recordListFixture);
        mutations = [];
        testDriver.watch('mutation', addMutation);

        render(
            <testDriver.Container>
                <TodoApp />
            </testDriver.Container>,
        );
    });

    afterEach(() => {
        testDriver.unwatch('mutations', addMutation);
    });

    it('renders a list of records (user with "write" permissions)', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        const items = readItems();

        expect(items.length).toBe(3);

        expect(items).toEqual([
            {checked: false, text: 'carrots'},
            {checked: true, text: 'baby carrots'},
            {checked: false, text: 'elderly carrots'},
        ]);
    });

    // This test cannot be fully expressed using the capabilities currently
    // available in the SDK.
    it('renders a list of records (user without "write" permissions)', async () => {
        testDriver.simulatePermissionCheck(mutation => {
            return mutation.type === 'setMultipleGlobalConfigPaths';
        });

        await openAsync('Groceries', 'Grid view', 'Purchased');

        expect(screen.getByRole('button', {name: 'Add'}).disabled).toBe(true);

        const items = getItems().map(item => ({
            checked: item.checkbox.checked,
            text: item.container.textContent.trim(),
            checkboxDisabled: item.checkbox.disabled,
            deleteButtonDisabled: item.deleteButton.disabled,
        }));

        expect(items.length).toBe(3);

        expect(items).toEqual([
            {checked: false, text: 'carrots', checkboxDisabled: true, deleteButtonDisabled: true},
            {
                checked: true,
                text: 'baby carrots',
                checkboxDisabled: true,
                deleteButtonDisabled: true,
            },
            {
                checked: false,
                text: 'elderly carrots',
                checkboxDisabled: true,
                deleteButtonDisabled: true,
            },
        ]);
    });

    it('gracefully handles the deletion of fields', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        await act(() => testDriver.deleteFieldAsync('tblTable1', 'fldPurchased'));

        const items = readItems();

        expect(items).toEqual([]);
    });

    it('gracefully handles the deletion of tables', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        act(() => {
            testDriver.deleteTable('tblTable1');
        });

        const items = readItems();

        expect(items).toEqual([]);

        const options = getAllByRole(screen.getByLabelText('Table'), 'option');

        expect(options.map(getNodeText)).toEqual(['Pick a table...', 'Porcelain dolls']);

        expect(options[0].selected).toBe(true);
        expect(screen.queryByLabelText('View')).toBe(null);
        expect(screen.queryByLabelText('Field')).toBe(null);
    });

    it('gracefully handles the deletion of views', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        await act(() => testDriver.deleteViewAsync('tblTable1', 'viwGridView'));

        const items = readItems();

        expect(items).toEqual([]);

        const tableOptions = getAllByRole(screen.getByLabelText('Table'), 'option');

        expect(tableOptions.map(getNodeText)).toEqual([
            'Pick a table...',
            'Groceries',
            'Porcelain dolls',
        ]);

        expect(tableOptions[1].selected).toBe(true);

        const viewOptions = getAllByRole(screen.getByLabelText('View'), 'option');
        expect(viewOptions.map(getNodeText)).toEqual(['Pick a view...', 'Another grid view']);
        expect(viewOptions[0].selected).toBe(true);

        const fieldOptions = getAllByRole(screen.getByLabelText('Field'), 'option');
        expect(fieldOptions.map(getNodeText)).toEqual([
            "Pick a 'done' field...",
            'Name',
            'Purchased',
        ]);
        expect(fieldOptions[2].selected).toBe(true);
    });

    it('allows records to be created without a name', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        const initialCount = readItems().length;

        userEvent.click(screen.getByRole('button', {name: 'Add'}));

        const items = readItems();

        expect(items.length).toBe(initialCount + 1);
        expect(items.pop()).toEqual({
            checked: false,
            text: 'Unnamed record',
        });

        await waitFor(() => expect(mutations.length).not.toBe(0));
        expect(mutations).toEqual(
            expect.arrayContaining([
                {
                    type: 'createMultipleRecords',
                    tableId: 'tblTable1',
                    records: [
                        {
                            id: expect.anything(),
                            cellValuesByFieldId: {
                                fldName: '',
                            },
                        },
                    ],
                },
            ]),
        );
    });

    it('allows multiple records to be created with a name', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        const initialCount = readItems().length;

        userEvent.type(screen.getByRole('textbox'), 'brash teenaged carrots');
        userEvent.click(screen.getByRole('button', {name: 'Add'}));

        let items = readItems();

        expect(items.length).toBe(initialCount + 1);
        expect(items.pop()).toEqual({
            checked: false,
            text: 'brash teenaged carrots',
        });

        await waitFor(() => expect(mutations.length).not.toBe(0));
        expect(mutations).toEqual(
            expect.arrayContaining([
                {
                    type: 'createMultipleRecords',
                    tableId: 'tblTable1',
                    records: [
                        {
                            id: expect.anything(),
                            cellValuesByFieldId: {
                                fldName: 'brash teenaged carrots',
                            },
                        },
                    ],
                },
            ]),
        );

        mutations.length = 0;

        userEvent.type(screen.getByRole('textbox'), 'parsnips');
        userEvent.click(screen.getByRole('button', {name: 'Add'}));

        items = readItems();

        expect(items.length).toBe(initialCount + 2);

        expect(items.pop()).toEqual({
            checked: false,
            text: 'parsnips',
        });

        await waitFor(() => expect(mutations.length).not.toBe(0));
        expect(mutations).toEqual(
            expect.arrayContaining([
                {
                    type: 'createMultipleRecords',
                    tableId: 'tblTable1',
                    records: [
                        {
                            id: expect.anything(),
                            cellValuesByFieldId: {
                                fldName: 'parsnips',
                            },
                        },
                    ],
                },
            ]),
        );
    });

    it('allows records to be destroyed', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        userEvent.click(getItems()[1].deleteButton);

        const items = readItems();

        expect(items).toEqual([
            {checked: false, text: 'carrots'},
            {checked: false, text: 'elderly carrots'},
        ]);

        await waitFor(() => expect(mutations.length).not.toBe(0));
        expect(mutations).toEqual(
            expect.arrayContaining([
                {
                    type: 'deleteMultipleRecords',
                    tableId: 'tblTable1',
                    recordIds: ['recb'],
                },
            ]),
        );
    });

    it('allows records to be marked as "complete"', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        userEvent.click(getItems()[0].checkbox);

        const items = readItems();

        expect(items[0]).toEqual({checked: true, text: 'carrots'});

        await waitFor(() => expect(mutations.length).not.toBe(0));
        expect(mutations).toEqual(
            expect.arrayContaining([
                {
                    type: 'setMultipleRecordsCellValues',
                    tableId: 'tblTable1',
                    records: [
                        {
                            id: 'reca',
                            cellValuesByFieldId: {
                                fldPurchased: true,
                            },
                        },
                    ],
                },
            ]),
        );
    });

    it('allows records to be marked as "incomplete"', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        userEvent.click(getItems()[1].checkbox);

        const items = readItems();

        expect(items[1]).toEqual({checked: false, text: 'baby carrots'});

        await waitFor(() => expect(mutations.length).not.toBe(0));
        expect(mutations).toEqual(
            expect.arrayContaining([
                {
                    type: 'setMultipleRecordsCellValues',
                    tableId: 'tblTable1',
                    records: [
                        {
                            id: 'recb',
                            cellValuesByFieldId: {
                                fldPurchased: false,
                            },
                        },
                    ],
                },
            ]),
        );
    });

    it('expands records upon click', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');
        const recordIds = [];
        testDriver.watch('expandRecord', ({recordId}) => recordIds.push(recordId));

        userEvent.click(getItems()[0].link);
        await waitFor(() => expect(recordIds.length).not.toBe(0));

        expect(recordIds).toEqual(['reca']);
    });
});
