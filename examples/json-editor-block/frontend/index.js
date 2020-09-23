import React, {useState, useEffect} from 'react';
import {cursor} from '@airtable/blocks';
import {FieldType, ViewType} from '@airtable/blocks/models';
import {
    colors,
    colorUtils,
    initializeBlock,
    useBase,
    useRecordById,
    useLoadable,
    useViewport,
    useWatchable,
    Box,
    Icon,
    Loader,
    Text,
    Tooltip,
} from '@airtable/blocks/ui';
import Container from './container';
import Monaco from './monaco';
import useDebounced from './useDebounced';
import useRenderSignal from './useRenderSignal';

/**
 * Duration in milliseconds to wait before reacting to changes in the editor's
 * value.
 *
 * When the user modifies the content by issuing keystrokes directly into the
 * editor component, the new value should be persisted in the base. The request
 * to save the content should not be made immediately following every keystroke
 * because keystrokes are expected to be entered in rapid succession. Making
 * "save" requests immediately would promote an undesirable "replay" effect.
 * The following sequence of events demonstrates this behavior:
 *
 * 1. User types "a"
 * 2. Editor value updates to "a", component issues request to update record
 *    value to "a"
 * 3. User types "b"
 * 4. Editor value updates to "ab", component issues request to update record
 *    value to "ab"
 * 5. First request completes, record value updates to "a", the editor
 *    component detects a change (from "ab" to "a"), and the editor changes the
 *    content to "a" and resets the position of the cursor
 * 6. Second request completes, record value updates to "ab", the editor
 *    component detects a change (from "a" to "ab"), and the editor changes the
 *    content to "ab" and resets the position of the cursor
 *
 * By debouncing the "change" event from the editor, this race condition can be
 * largely avoided.
 *
 * In addition, debouncing is a beneficial optimization because as keys are
 * being pressed, the editor's value is expected to temporarily describe
 * invalid JSON which is not appropriate to save to the base.
 */
const changeDelay = 500;
const supportedFields = [FieldType.MULTILINE_TEXT, FieldType.SINGLE_LINE_TEXT];
const isFieldSupported = field => supportedFields.includes(field.type);

function JsonEditorApp() {
    // Caches the currently selected record and field in state. If the user
    // selects a record and an editor appears, and then the user de-selects the
    // record (but does not select another), the editor will remain. This is
    // useful when, for example, the user resizes the apps pane.
    const [selectedRecordId, setSelectedRecordId] = useState(null);
    const [selectedFieldId, setSelectedFieldId] = useState(null);

    // `cursor.selectedRecordIds` and `selectedFieldIds` aren't loaded by
    // default, so we need to load them explicitly with the `useLoadable` hook.
    // The rest of the code in the component will not run until they are
    // loaded.
    useLoadable(cursor);

    // Update the `selectedRecordId` and `selectedFieldId` state when the
    // selected record or field change.
    useWatchable(cursor, ['selectedRecordIds', 'selectedFieldIds'], () => {
        // If the update was triggered by a record being de-selected, the
        // current `selectedRecordId` will be retained. This is what enables
        // the caching described above.
        if (cursor.selectedRecordIds.length > 0) {
            // There might be multiple selected records. We'll use the first
            // one.
            setSelectedRecordId(cursor.selectedRecordIds[0]);
        }
        if (cursor.selectedFieldIds.length > 0) {
            // There might be multiple selected fields. We'll use the first
            // one.
            setSelectedFieldId(cursor.selectedFieldIds[0]);
        }
    });

    // This watch deletes the cached `selectedRecordId` and `selectedFieldId`
    // when the user moves to a new table or view. This prevents the following
    // scenario: User selects a record, and the editor appears. User switches
    // to a different table, and the editor disappears. The user switches back
    // to the original table. Weirdly, the previously viewed editor reappears,
    // even though no record is selected.
    useWatchable(cursor, ['activeTableId', 'activeViewId'], () => {
        setSelectedRecordId(null);
        setSelectedFieldId(null);
    });

    const base = useBase();
    const table = base.getTableByIdIfExists(cursor.activeTableId);

    // `table` is briefly null when switching to a newly created table.
    if (!table) {
        return null;
    }

    return (
        <EditorGuard
            table={table}
            selectedRecordId={selectedRecordId}
            selectedFieldId={selectedFieldId}
        />
    );
}

/**
 * Shows a JSON editor or a message about what the user should do to open an
 * editor.
 */
function EditorGuard({table, selectedRecordId, selectedFieldId}) {
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    // We use getFieldByIdIfExists because the field might be deleted.
    const selectedField = selectedFieldId ? table.getFieldByIdIfExists(selectedFieldId) : null;
    const [renderSignal, forceRender] = useRenderSignal();
    const viewport = useViewport();

    // Triggers a re-render if the record changes. The cell value might have
    // changed, or the record might have been deleted.
    const selectedRecord = useRecordById(table, selectedRecordId ? selectedRecordId : '', {
        fields: [selectedField],
    });
    const onChange = useDebounced(
        value => {
            // Ignore change events triggered by explicitly setting the
            // component's `value` (e.g. when navigating between cells or when
            // the selected record is updated from the table.
            if (value === selectedRecord.getCellValueAsString(selectedField)) {
                return;
            }

            table.updateRecordAsync(selectedRecord, {[selectedField.id]: value});
        },
        changeDelay,
        [table, selectedRecord, selectedField],
    );

    // The Monaco component responds to the `renderSignal` by resizing the
    // editor according to the available space. The viewport size and the list
    // of errors both influence the desired size of the editor, so changes to
    // either should trigger resizing (via the invocation of `forceRender`).
    useWatchable(viewport, ['size'], forceRender);
    useEffect(() => forceRender(), [errors, forceRender]);

    // Immediately clear errors when navigating between cells.
    useEffect(() => {
        // This branch an optimization to reduce rendering when there are no
        // errors to be cleared.
        if (errors.length === 0) {
            return;
        }

        setErrors([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedField, selectedRecord]);

    // Triggers a re-render if the user switches table or view. EditorGuard
    // may now need to render a preview, or render nothing at all.
    useWatchable(cursor, ['activeTableId', 'activeViewId']);

    const inGridView =
        // `activeViewId` is briefly null when switching views.
        cursor.activeViewId && table.getViewById(cursor.activeViewId).type === ViewType.GRID;
    const hasSelection =
        // `selectedRecord` will be null on app initialization, after the
        // user switches table or view, or if it was deleted.
        selectedRecord &&
        // The selected field may have been deleted.
        selectedField;

    if (!inGridView) {
        return (
            <Container>
                <Text padding={2}>Switch to a grid view to begin editing</Text>
            </Container>
        );
    } else if (!hasSelection || !isFieldSupported(selectedField)) {
        return (
            <Container>
                <Text padding={2}>
                    Select a cell in a single line text field or a long text field to begin editing
                </Text>
            </Container>
        );
    }

    const errorComponent = errors.length ? (
        <Text display="flex" alignItems="center">
            <Icon
                style={{verticalAlign: 'middle'}}
                size={14}
                marginRight={1}
                fillColor={colorUtils.getHexForColor(colors.ORANGE)}
                name="warning"
            />
            Line {errors[0].startLineNumber}, column {errors[0].startColumn}: {errors[0].message}
        </Text>
    ) : (
        ''
    );
    const result = table.checkPermissionsForUpdateRecord(selectedRecord, {[selectedField.id]: ''});
    const permissionComponent = result.hasPermission ? (
        ''
    ) : (
        <Tooltip placementX={Tooltip.placements.LEFT} content={result.reasonDisplayString}>
            <Icon name="lock" />
        </Tooltip>
    );

    return (
        <Container>
            {isLoading ? <LoadingScreen /> : ''}
            <Monaco
                style={{flexGrow: 1, width: '100%', overflow: 'hidden'}}
                language="json"
                readOnly={!result.hasPermission}
                onLoad={() => setIsLoading(false)}
                onSyntaxError={setErrors}
                onChange={onChange}
                value={selectedRecord.getCellValueAsString(selectedField)}
                renderSignal={renderSignal}
            />
            <Box
                display="flex"
                alignItems="center"
                width="100%"
                padding={2}
                backgroundColor="#f5f5f5"
                borderWidth="2px 0 0 0"
                borderStyle="solid"
                borderColor="#e5e5e5"
            >
                {errorComponent}
                <Box flexGrow={1} />
                {permissionComponent}
            </Box>
        </Container>
    );
}

function LoadingScreen() {
    return (
        <Container
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 1,
            }}
        >
            <Loader />
        </Container>
    );
}

initializeBlock(() => <JsonEditorApp />);
