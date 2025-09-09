import React from 'react';
import {render} from '@testing-library/react';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {RecordCard} from '../../../src/base/ui/ui';
import {SdkContext} from '../../../src/shared/ui/sdk_context';
import {__sdk as sdk} from '../../../src/base';
import getAirtableInterface from '../../../src/injected/airtable_interface';

jest.mock('../../../src/injected/airtable_interface', () => {
    let mockAirtableInterface: jest.Mocked<MockAirtableInterface>;
    return {
        __esModule: true,
        default() {
            if (!mockAirtableInterface) {
                mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
            }
            return mockAirtableInterface;
        },
    };
});

const mockAirtableInterface = getAirtableInterface() as jest.Mocked<MockAirtableInterface>;

const TestProvider = ({children}: {children: React.ReactNode}) => {
    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
};

describe('RecordCard', () => {
    beforeEach(() => {
        const recordsById = {
            recA: {
                id: 'recA',
                cellValuesByFieldId: {},
                commentCount: 0,
                createdTime: '2020-11-19T20:51:04.281Z',
            },
        };
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({recordsById});
        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById,
        });
    });

    it('renders within a Blocks Sdk context', async () => {
        const table = sdk.base.getTable('Design projects');
        const result = await table.selectRecordsAsync();
        render(
            <TestProvider>
                <RecordCard record={result.records[0]} />
            </TestProvider>,
        );
    });

    it('correctly requests UI config', async () => {
        const table = sdk.base.getTable('Design projects');
        const result = await table.selectRecordsAsync();
        const {fieldsById} =
            mockAirtableInterface.sdkInitData.baseData.tablesById.tblDesignProjects;
        const {getUiConfig} = mockAirtableInterface.fieldTypeProvider;

        render(
            <TestProvider>
                <RecordCard record={result.records[0]} />
            </TestProvider>,
        );

        expect(getUiConfig).toHaveBeenCalledWith(sdk.__appInterface, fieldsById.fldPrjctClient);
        expect(getUiConfig).toHaveBeenCalledWith(sdk.__appInterface, fieldsById.fldPrjctCtgry);
        expect(getUiConfig).toHaveBeenCalledWith(sdk.__appInterface, fieldsById.fldPrjctCmplt);
        expect(getUiConfig).toHaveBeenCalledWith(sdk.__appInterface, fieldsById.fldPrjctTasks);
        expect(getUiConfig).toHaveBeenCalledWith(sdk.__appInterface, fieldsById.fldPrjctLead);
        expect(getUiConfig).toHaveBeenCalledWith(sdk.__appInterface, fieldsById.fldPrjctTeam);
        expect(getUiConfig).toHaveBeenCalledWith(sdk.__appInterface, fieldsById.fldPrjctDue);
        expect(getUiConfig).toHaveBeenCalledWith(sdk.__appInterface, fieldsById.fldPrjctKickoff);
        expect(getUiConfig).toHaveBeenCalledWith(sdk.__appInterface, fieldsById.fldPrjctNotes);
        expect(getUiConfig).toHaveBeenCalledWith(sdk.__appInterface, fieldsById.fldPrjctImages);
    });
});
