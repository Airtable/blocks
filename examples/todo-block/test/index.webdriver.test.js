'use strict';

const {readFile: readFileAsync} = require('fs').promises;
const {Builder} = require('selenium-webdriver');

/**
 * Execute source text in a remote context as though it were the body of an
 * async function.
 *
 * This helper is necessary because the relevant behavior in the WebDriver
 * command named "Execute async script" is poorly defined:
 *
 * [1] https://github.com/w3c/webdriver/pull/1431
 */
async function executeScriptAsync(driver, source) {
    const result = await driver.executeAsyncScript(`
        var done = arguments[arguments.length - 1];
        (async () => {
            ${source};
        })().then(
            (value) => done({status: 'success', value}),
            (error) => done({status: 'error', value: error.message || error})
        );
    `);

    if (result.status === 'error') {
        throw result.value;
    }

    return result.value;
}

async function openAsync(driver, table, view, field) {
    {
        const option = await executeScriptAsync(
            driver,
            `
            const input = await TestingLibraryDom.getByLabelText(
                document.body, 'Table',
            );
            return TestingLibraryDom.getByText(input, ${JSON.stringify(table)});
        `,
        );

        await option.click();
    }

    {
        const option = await executeScriptAsync(
            driver,
            `
            const input = await TestingLibraryDom.getByLabelText(
                document.body, 'View',
            );
            return TestingLibraryDom.getByText(input, ${JSON.stringify(view)});
        `,
        );

        await option.click();
    }

    {
        const option = await executeScriptAsync(
            driver,
            `
            const input = await TestingLibraryDom.getByLabelText(
                document.body, 'Field',
            );
            return TestingLibraryDom.getByText(input, ${JSON.stringify(field)});
        `,
        );

        await option.click();
    }
}

async function getItemsAsync(driver) {
    return executeScriptAsync(
        driver,
        `
        const checkboxes = await TestingLibraryDom.queryAllByRole(
            document.body, 'checkbox'
        );

        return checkboxes.map((checkbox) => {
            const container = checkbox.parentNode;
            const deleteButton = TestingLibraryDom.getByRole(container, 'button');
            const link = TestingLibraryDom.getByText(container, container.textContent.trim());

            return {container, checkbox, deleteButton, link};
        });
    `,
    );
}

async function readItemsAsync(driver) {
    const items = await getItemsAsync(driver);
    return Promise.all(
        items.map(async item => ({
            checked: (await item.checkbox.getAttribute('checked')) === 'true',
            text: (await item.container.getText()).trim(),
        })),
    );
}

/**
 * Create an item and pause until the UI has updated in response to the
 * creation, reducing the risk of race conditions in subsequent operations.
 */
async function createItemAsync(driver, text) {
    const input = await executeScriptAsync(
        driver,
        `return TestingLibraryDom.getByRole(document.body, 'textbox');`,
    );
    await input.sendKeys(text);

    const addButton = await executeScriptAsync(
        driver,
        `
        return TestingLibraryDom.getByRole(
            document.body, 'button', {name: 'Add'}
        );
    `,
    );

    const initialItems = await getItemsAsync(driver);

    await addButton.click();

    return (async function pollAsync() {
        if ((await getItemsAsync(driver)).length === initialItems.length) {
            return pollAsync();
        }

        return readItemsAsync(driver);
    })();
}

/**
 * Delete an item and pause until the UI has updated in response to the
 * deletion, reducing the risk of race conditions in subsequent operations.
 */
async function deleteItemAsync(driver, index) {
    const initialItems = await getItemsAsync(driver);

    initialItems[index].deleteButton.click();

    return (async function pollAsync() {
        if ((await getItemsAsync(driver)).length === initialItems.length) {
            return pollAsync();
        }

        return readItemsAsync(driver);
    })();
}

async function flushMutationsAsync(driver) {
    return driver.executeScript(`
        return window.mutations.splice(0, window.mutations.length);
    `);
}

describe('TodoApp', () => {
    let testingLibrarySource;
    let driver;

    beforeAll(async () => {
        driver = new Builder()
            .withCapabilities({acceptInsecureCerts: true})
            .forBrowser('firefox')
            .build();

        const testingLibraryFilename = require.resolve(
            '@testing-library/dom/dist/@testing-library/dom.umd.js',
        );

        // Work around bug in Geckodriver
        //
        // "Each executed script has a different global scope"
        // https://github.com/mozilla/geckodriver/issues/1798
        testingLibrarySource = `(function(globalThis) {
            ${await readFileAsync(testingLibraryFilename)};
        }(window));`;
    });

    afterAll(() => driver.quit());

    beforeEach(async () => {
        await driver.get('https://localhost:9000');
        await driver.executeScript(testingLibrarySource);
        await driver.executeScript(`
            window.mutations = [];
            window.testDriver.watch(
                'mutation', (mutation) => window.mutations.push(mutation)
            );
        `);
    });

    it('renders a list of records (user with "write" permissions)', async () => {
        await openAsync(driver, 'Groceries', 'Grid view', 'Purchased');

        const items = await readItemsAsync(driver);

        expect(items.length).toBe(3);

        expect(items).toEqual([
            {checked: false, text: 'carrots'},
            {checked: true, text: 'baby carrots'},
            {checked: false, text: 'elderly carrots'},
        ]);
    });

    it('renders a list of records (user without "write" permissions)', async () => {
        driver.executeScript(`
            testDriver.simulatePermissionCheck(mutation => {
                return mutation.type === 'setMultipleGlobalConfigPaths';
            });
        `);

        await openAsync(driver, 'Groceries', 'Grid view', 'Purchased');

        const addButton = await executeScriptAsync(
            driver,
            `
            return TestingLibraryDom.getByRole(
                document.body, 'button', {name: 'Add'}
            );
        `,
        );
        expect(await addButton.getAttribute('disabled')).toBe('true');

        const items = await Promise.all(
            (await getItemsAsync(driver)).map(async item => ({
                checked: (await item.checkbox.getAttribute('checked')) === 'true',
                text: (await item.container.getText()).trim(),
                checkboxDisabled: (await item.checkbox.getAttribute('disabled')) === 'true',
                deleteButtonDisabled: (await item.deleteButton.getAttribute('disabled')) === 'true',
            })),
        );

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
        await openAsync(driver, 'Groceries', 'Grid view', 'Purchased');

        const initialCount = (await readItemsAsync(driver)).length;

        const items = await createItemAsync(driver, '');

        expect(items.length).toBe(initialCount + 1);
        expect(items.pop()).toEqual({
            checked: false,
            text: 'Unnamed record',
        });

        expect(await flushMutationsAsync(driver)).toEqual(
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
        await openAsync(driver, 'Groceries', 'Grid view', 'Purchased');

        const initialCount = (await readItemsAsync(driver)).length;

        let items = await createItemAsync(driver, 'brash teenaged carrots');

        expect(items.length).toBe(initialCount + 1);
        expect(items.pop()).toEqual({
            checked: false,
            text: 'brash teenaged carrots',
        });

        expect(await flushMutationsAsync(driver)).toEqual(
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

        items = await createItemAsync(driver, 'parsnips');

        expect(items.length).toBe(initialCount + 2);

        expect(items.pop()).toEqual({
            checked: false,
            text: 'parsnips',
        });

        expect(await flushMutationsAsync(driver)).toEqual(
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
        await openAsync(driver, 'Groceries', 'Grid view', 'Purchased');

        const items = await deleteItemAsync(driver, 1);

        expect(items).toEqual([
            {checked: false, text: 'carrots'},
            {checked: false, text: 'elderly carrots'},
        ]);

        expect(await flushMutationsAsync(driver)).toEqual(
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
        await openAsync(driver, 'Groceries', 'Grid view', 'Purchased');

        await (await getItemsAsync(driver))[0].checkbox.click();

        const items = await readItemsAsync(driver);

        expect(items[0]).toEqual({checked: true, text: 'carrots'});

        expect(await flushMutationsAsync(driver)).toEqual(
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
        await openAsync(driver, 'Groceries', 'Grid view', 'Purchased');

        await (await getItemsAsync(driver))[1].checkbox.click();

        const items = await readItemsAsync(driver);

        expect(items[1]).toEqual({checked: false, text: 'baby carrots'});

        expect(await flushMutationsAsync(driver)).toEqual(
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
        await openAsync(driver, 'Groceries', 'Grid view', 'Purchased');

        await (await getItemsAsync(driver))[0].link.click();
    });
});
