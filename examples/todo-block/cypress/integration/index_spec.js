'use strict';

const SCRUBBED_ID = 'scrubbed record ID for testing';

const open = (table, view, field) => {
    cy.findByLabelText('Table').select(table);
    cy.findByLabelText('View').select(view);
    cy.findByLabelText('Field').select(field);
    cy.findByRole('textbox');
};

/**
 * For a Cypress object whose "subject" is an array of elements, filter out
 * only those elements which are contained by the provided list items.
 *
 * A far more direct approach would involve querying each list item for the
 * desired descendant. This is not implemented because selection produces a
 * value which Cypress considers "asynchronous," and the framework does not
 * appear to support the composition of such values.
 */
const extendItems = (items, name, cypressObject) => {
    return cypressObject.then($elements => {
        return $elements
            .toArray()
            .map(element => {
                const item = items.find(({container}) => container.contains(element));
                return {[name]: element, ...item};
            })
            .filter(item => item.container);
    });
};

/**
 * Retrieve an array of "items"--objects representing the various parts of the
 * To-Do list elements' user interface.
 */
const getItems = () => {
    return cy
        .findAllByRole('checkbox')
        .then($checkboxes => {
            return $checkboxes.toArray().map(checkbox => {
                const container = checkbox.parentNode;
                return {checkbox, container};
            });
        })
        .then(items => {
            return extendItems(items, 'deleteButton', cy.findAllByRole('button'));
        })
        .then(items => {
            return extendItems(items, 'link', cy.get('a'));
        });
};

const readItem = item => {
    const checked = item.checkbox.checked;
    const text = item.container.textContent.trim();
    return {checked, text};
};

/**
 * Replace all record IDs in an array of mutation objects with a constant
 * value. This allows tests to declaratively assert the complete mutation
 * objects when randomly-generated IDs would otherwise require special
 * handling.
 */
const scrubRecordIds = mutations => {
    return mutations.map(mutation => {
        if (!mutation.records) {
            return mutation;
        }
        const scrubbedRecords = mutation.records.map(record => ({
            ...record,
            id: SCRUBBED_ID,
        }));
        return {
            ...mutation,
            records: scrubbedRecords,
        };
    });
};

describe('The Home Page', () => {
    const mutations = [];
    const addMutation = mutation => mutations.push(mutation);

    beforeEach(() => {
        mutations.length = 0;

        cy.visit('/');

        cy.window().then(win => {
            win.testDriver.watch('mutation', addMutation);
        });
    });

    it('renders a list of records (user with "write" permissions)', () => {
        open('Groceries', 'Grid view', 'Purchased');

        getItems().should(items => {
            const data = items.map(readItem);

            expect(data).to.deep.eql([
                {checked: false, text: 'carrots'},
                {checked: true, text: 'baby carrots'},
                {checked: false, text: 'elderly carrots'},
            ]);
        });
    });

    it('renders a list of records (user without "write" permissions)', () => {
        cy.window().then(win => {
            win.testDriver.simulatePermissionCheck(mutation => {
                return mutation.type === 'setMultipleGlobalConfigPaths';
            });
        });

        open('Groceries', 'Grid view', 'Purchased');

        getItems().should(items => {
            const data = items.map(item => ({
                checked: item.checkbox.checked,
                text: item.container.textContent.trim(),
                checkboxDisabled: item.checkbox.disabled,
                deleteButtonDisabled: item.deleteButton.disabled,
            }));

            expect(data).to.deep.eql([
                {
                    checked: false,
                    text: 'carrots',
                    checkboxDisabled: true,
                    deleteButtonDisabled: true,
                },
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
    });

    it('allows records to be created without a name', () => {
        open('Groceries', 'Grid view', 'Purchased');

        let initialCount;
        getItems().then(items => (initialCount = items.length));

        cy.findByRole('button', {name: 'Add'}).click();

        getItems().should(items => {
            expect(items.length).to.eql(initialCount + 1);
            expect(readItem(items.pop())).to.eql({
                checked: false,
                text: 'Unnamed record',
            });

            expect(scrubRecordIds(mutations)).to.deep.include({
                type: 'createMultipleRecords',
                tableId: 'tblTable1',
                records: [
                    {
                        id: SCRUBBED_ID,
                        cellValuesByFieldId: {
                            fldName: '',
                        },
                    },
                ],
            });
        });
    });

    it('allows multiple records to be created with a name', () => {
        open('Groceries', 'Grid view', 'Purchased');

        let initialCount;
        getItems().then(items => (initialCount = items.length));

        cy.findByRole('textbox').type('brash teenaged carrots');
        cy.findByRole('button', {name: 'Add'}).click();

        getItems().should(items => {
            expect(items.length).to.eql(initialCount + 1);
            expect(readItem(items.pop())).to.eql({
                checked: false,
                text: 'brash teenaged carrots',
            });

            expect(scrubRecordIds(mutations)).to.deep.include({
                type: 'createMultipleRecords',
                tableId: 'tblTable1',
                records: [
                    {
                        id: SCRUBBED_ID,
                        cellValuesByFieldId: {
                            fldName: 'brash teenaged carrots',
                        },
                    },
                ],
            });
        });

        mutations.length = 0;

        cy.findByRole('textbox').type('parsnips');
        cy.findByRole('button', {name: 'Add'}).click();

        getItems().should(items => {
            expect(items.length).to.eql(initialCount + 2);
            expect(readItem(items.pop())).to.eql({
                checked: false,
                text: 'parsnips',
            });

            expect(scrubRecordIds(mutations)).to.deep.include({
                type: 'createMultipleRecords',
                tableId: 'tblTable1',
                records: [
                    {
                        id: SCRUBBED_ID,
                        cellValuesByFieldId: {
                            fldName: 'parsnips',
                        },
                    },
                ],
            });
        });
    });

    it('allows records to be destroyed', () => {
        open('Groceries', 'Grid view', 'Purchased');

        getItems().then(items => cy.wrap(items[1].deleteButton).click());

        getItems().should(items => {
            expect(items.map(readItem)).to.eql([
                {checked: false, text: 'carrots'},
                {checked: false, text: 'elderly carrots'},
            ]);

            expect(mutations).to.deep.include({
                type: 'deleteMultipleRecords',
                tableId: 'tblTable1',
                recordIds: ['recb'],
            });
        });
    });

    it('allows records to be marked as "complete"', () => {
        open('Groceries', 'Grid view', 'Purchased');

        getItems().then(items => cy.wrap(items[0].checkbox).check());

        getItems().should(items => {
            expect(readItem(items[0])).to.eql({checked: true, text: 'carrots'});

            expect(mutations).to.deep.include({
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
            });
        });
    });

    it('allows records to be marked as "incomplete"', () => {
        open('Groceries', 'Grid view', 'Purchased');

        getItems().then(items => cy.wrap(items[1].checkbox).uncheck());

        getItems().should(items => {
            expect(readItem(items[1])).to.eql({checked: false, text: 'baby carrots'});

            expect(mutations).to.deep.include({
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
            });
        });
    });

    // This test cannot pass because the SDK's `expandRecords` function relies
    // on a global reference to AirtableInterface which cannot be controlled in
    // the test environment.
    it.skip('expands records upon click', () => {
        open('Groceries', 'Grid view', 'Purchased');

        getItems().then(items => cy.wrap(items[0].link).click());
    });
});
