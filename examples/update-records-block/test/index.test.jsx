import React from 'react';
import {act} from 'react-dom/test-utils';
import TestDriver from '@airtable/blocks-testing';
import {render, screen, waitFor, getByRole} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import recordListFixture from './fixtures/simple_record_list';
import UpdateRecordsApp from '../frontend/UpdateRecordsApp';

describe('UpdateRecordsApp', () => {
    const mutations = [];
    let addMutation = mutation => mutations.push(mutation);
    let testDriver;

    beforeEach(() => {
        testDriver = new TestDriver(recordListFixture);
        mutations.length = 0;
        testDriver.watch('mutation', addMutation);

        render(
            <testDriver.Container>
                <UpdateRecordsApp />
            </testDriver.Container>,
        );
    });

    afterEach(() => {
        testDriver.unwatch('mutations', addMutation);
    });

    async function clickUpdate(button) {
        await act(async () => {
            userEvent.click(button);
            await waitFor(() => expect(button.disabled).toBe(false), {timeout: 3000});
        });
    }

    it('renders a message with no button when another table is active', async () => {
        testDriver.setActiveCursorModels({table: 'Griddle cakes', view: 'Grid view 2'});

        await waitFor(() => expect(document.body.textContent).not.toBe(''));

        const {textContent} = document.body;
        expect(textContent).toMatch(/\bswitch\b/i);
        expect(textContent).toMatch(/\bInventory\b/);
        expect(screen.queryByRole('button')).toBe(null);
    });

    describe('disabled button', () => {
        it('correct active table with zero selected records', async () => {
            const button = await waitFor(() => screen.getByRole('button'));
            expect(button.disabled).toBe(true);
            expect(button.textContent).toMatch(/\b0\s+records\b/i);
        });

        it('correct active table with some selected records and underprivileged user', async () => {
            testDriver.simulatePermissionCheck(mutation => {
                return mutation.type !== 'setMultipleRecordsCellValues';
            });
            testDriver.userSelectRecords(['recb', 'recc']);

            const button = await waitFor(() => screen.getByRole('button'));
            expect(button.disabled).toBe(true);
            expect(button.textContent).toMatch(/\b2\s+records\b/i);
        });
    });

    it('renders a single enabled button for correct active table with some selected records', async () => {
        testDriver.userSelectRecords(['reca', 'recc']);
        const button = await waitFor(() => screen.getByRole('button'));
        expect(button.disabled).toBe(false);
        expect(button.textContent).toMatch(/\b2\s+records\b/i);
    });

    it('updates selected records only', async () => {
        testDriver.userSelectRecords(['recb']);
        const button = await waitFor(() => screen.getByRole('button'));

        await clickUpdate(button);

        expect(mutations).toEqual(
            expect.arrayContaining([
                {
                    type: 'setMultipleRecordsCellValues',
                    tableId: 'tblTable',
                    records: [
                        {
                            id: 'recb',
                            cellValuesByFieldId: {fldInStock: 15},
                        },
                    ],
                },
            ]),
        );
    });

    it('batches updates', async () => {
        const biggerFixture = JSON.parse(JSON.stringify(recordListFixture));
        const extraRecords = Array.from(Array(321)).map((_, index) => ({
            id: `rec${index}`,
            commentCount: 0,
            createdTime: '2020-11-04T23:20:14.000Z',
            cellValuesByFieldId: {
                fldName: `crepe #${index}`,
                fldInStock: 0,
            },
        }));
        biggerFixture.base.tables[0].records.push(...extraRecords);
        testDriver = new TestDriver(biggerFixture);
        testDriver.watch('mutation', addMutation);
        testDriver.userSelectRecords(extraRecords.map(({id}) => id));

        document.body.innerHTML = '';
        render(
            <testDriver.Container>
                <UpdateRecordsApp />
            </testDriver.Container>,
        );

        const button = await waitFor(() => screen.getByRole('button'));
        await waitFor(() => expect(button.disabled).toBe(false));

        await clickUpdate(button);

        const batchSizes = mutations
            .filter(({type}) => type === 'setMultipleRecordsCellValues')
            .map(({records}) => records.length);

        for (const batchSize of batchSizes) {
            expect(batchSize).toBeLessThan(51);
        }

        expect(batchSizes.reduce((a, b) => a + b)).toBe(321);
    });

    it('maintains selection through multiple updates', async () => {
        testDriver.userSelectRecords(['recc']);
        const button = await waitFor(() => screen.getByRole('button'));

        await clickUpdate(button);

        expect(mutations).toEqual(
            expect.arrayContaining([
                {
                    type: 'setMultipleRecordsCellValues',
                    tableId: 'tblTable',
                    records: [
                        {
                            id: 'recc',
                            cellValuesByFieldId: {fldInStock: 9},
                        },
                    ],
                },
            ]),
        );

        mutations.length = 0;
        await clickUpdate(button);

        expect(mutations).toEqual(
            expect.arrayContaining([
                {
                    type: 'setMultipleRecordsCellValues',
                    tableId: 'tblTable',
                    records: [
                        {
                            id: 'recc',
                            cellValuesByFieldId: {fldInStock: 10},
                        },
                    ],
                },
            ]),
        );
    });
});
