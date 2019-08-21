// @flow
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
    Button,
    CellRenderer,
    ChoiceToken,
    CollaboratorToken,
    ColorPalette,
    ConfirmationDialog,
    Icon,
    Input,
    Loader,
    ProgressBar,
    RecordCard,
    SelectButtons,
    Select,
    Toggle,
    Tooltip,
    colors,
    colorUtils,
    loadCSSFromURLAsync,
    useBase,
    useRecords,
    useSession,
} from '@airtable/blocks/ui';

// This is a throwaway example. Once https://airtable.phacility.com/D11040 lands,
// we should use per-component examples.

export default function BaymaxExample() {
    const base = useBase();
    const session = useSession();
    const table = base.tables[0];
    const view = table.views[0];
    const queryResult = table.selectRecords();
    const records = useRecords(queryResult);
    const allowedColors = Object.values(colors).slice(0, 8);
    const [color, setColor] = useState(allowedColors[0]);

    const stylesheetRef = useRef(document.querySelector('link'));
    const [shouldUseLocalBlockFrameCSS, setShouldUseLocalBlockFrameCSS] = useState(true);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState('foo');
    const [isToggleEnabled, setIsToggleEnabled] = useState(false);

    async function addLocalBlockFrameCSSAsync() {
        stylesheetRef.current.remove();
        await loadCSSFromURLAsync('https://hyperbasedev.com:3000/css/compiled/block_frame.css');
        document.body.classList.remove('baymax');
    }

    function removeLocalBlockFrameCSS() {
        if (shouldUseLocalBlockFrameCSS) {
            document.querySelector('link').remove();
            document.head.appendChild(stylesheetRef.current);
            document.body.classList.add('baymax');
        }
    }

    useEffect(() => {
        if (shouldUseLocalBlockFrameCSS) {
            addLocalBlockFrameCSSAsync();
        } else {
            removeLocalBlockFrameCSS();
        }

        return removeLocalBlockFrameCSS;
    }, [shouldUseLocalBlockFrameCSS]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'stretch',
                width: '100%',
                padding: 4,
            }}
        >
            <Toggle
                value={shouldUseLocalBlockFrameCSS}
                onChange={setShouldUseLocalBlockFrameCSS}
                label="Use local block frame CSS"
                style={{
                    alignSelf: 'start',
                    paddingTop: 4,
                    paddingBottom: 4,
                }}
            />
            <table
                style={{
                    flex: '1 1 auto',
                    width: '100%',
                    padding: 4,
                }}
            >
                <thead>
                    <tr>
                        <td>
                            <strong>Component</strong>
                        </td>
                        <td>
                            <strong>Example</strong>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Button</td>
                        <td>
                            <Button onClick={() => alert('clicked!')}>Click me</Button>
                        </td>
                    </tr>
                    <tr>
                        <td>CellRenderer</td>
                        <td>
                            <CellRenderer record={records[0]} field={table.fields[0]} />
                        </td>
                    </tr>
                    <tr>
                        <td>ChoiceToken</td>
                        <td>
                            <ChoiceToken choice={{id: 'foo', name: 'foo'}} />
                        </td>
                    </tr>
                    <tr>
                        <td>CollaboratorToken</td>
                        <td>
                            <CollaboratorToken collaborator={session.currentUser} />
                        </td>
                    </tr>
                    <tr>
                        <td>ColorPalette</td>
                        <td>
                            <ColorPalette
                                allowedColors={allowedColors}
                                color={color}
                                onChange={setColor}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>ConfirmationDialog, Dialog, Modal</td>
                        <td>
                            <Button
                                theme={Button.themes.GRAY}
                                onClick={() => setIsConfirmationDialogOpen(true)}
                            >
                                Open dialog
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td>Input</td>
                        <td>
                            <Input
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="foo"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Loader</td>
                        <td>
                            <Loader />
                        </td>
                    </tr>
                    <tr>
                        <td>ProgressBar</td>
                        <td>
                            <ProgressBar progress={0.6} barColor="#ff9900" />
                        </td>
                    </tr>
                    <tr>
                        <td>RecordCard</td>
                        <td>
                            <RecordCard record={records[0]} view={view} />
                        </td>
                    </tr>
                    <tr>
                        <td>SelectButtons</td>
                        <td>
                            <SelectButtons
                                value={selectValue}
                                onChange={setSelectValue}
                                options={[
                                    {value: 'foo', label: 'foo'},
                                    {value: 'bar', label: 'bar'},
                                    {value: 'baz', label: 'baz'},
                                ]}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Select, ModelPicker</td>
                        <td>
                            <Select
                                value={selectValue}
                                onChange={setSelectValue}
                                options={[
                                    {value: 'foo', label: 'foo'},
                                    {value: 'bar', label: 'bar'},
                                    {value: 'baz', label: 'baz'},
                                ]}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Toggle</td>
                        <td>
                            <Toggle
                                value={isToggleEnabled}
                                onChange={setIsToggleEnabled}
                                label="Toggle"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Tooltip, Popover</td>
                        <td>
                            <Tooltip
                                content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                                placementX={Tooltip.placements.CENTER}
                                placementY={Tooltip.placements.TOP}
                            >
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 4,
                                    }}
                                >
                                    <Icon
                                        name="info"
                                        fillColor={colorUtils.getHexForColor(colors.GRAY_LIGHT_1)}
                                    />
                                </div>
                            </Tooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
            {isConfirmationDialogOpen && (
                <ConfirmationDialog
                    title="Are you sure?"
                    body="Integer posuere erat a ante venenatis dapibus posuere velit aliquet."
                    onCancel={() => setIsConfirmationDialogOpen(false)}
                    onConfirm={() => setIsConfirmationDialogOpen(false)}
                />
            )}
        </div>
    );
}
