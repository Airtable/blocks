import React from 'react';
import {act} from 'react-dom/test-utils';
import TestDriver from '@airtable/blocks/unstable_testing';
import {render, screen, waitFor, getByRole, getByText} from '@testing-library/react';
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
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {
                                fldName: '',
                            },
                        },
                    ],
                },
            ]),
        );
    });

    it('allows records to be created with a name', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        const initialCount = readItems().length;

        userEvent.type(screen.getByRole('textbox'), 'brash teenaged carrots');
        userEvent.click(screen.getByRole('button', {name: 'Add'}));

        const items = readItems();

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
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {
                                fldName: 'brash teenaged carrots',
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

    // This test cannot pass because the SDK's `expandRecords` function relies
    // on a global reference to AirtableInterface which cannot be controlled in
    // the test environment.
    it.skip('expands records upon click', async () => {
        await openAsync('Groceries', 'Grid view', 'Purchased');

        userEvent.click(getItems()[0].link);
    });
});
