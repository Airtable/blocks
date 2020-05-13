import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Box, loadScriptFromURLAsync, loadCSSFromURLAsync} from '@airtable/blocks/ui';

const markersMatch = (aMarkers, bMarkers) => {
    if (aMarkers.length !== bMarkers.length) {
        return false;
    }

    return aMarkers.every((aMarker, index) => {
        const bMarker = bMarkers[index];
        return (
            aMarker.startLineNumber === bMarker.startLineNumber &&
            aMarker.startColumn === bMarker.startColumn &&
            aMarker.endLineNumber === bMarker.endLineNumber &&
            aMarker.endColumn === bMarker.endColumn &&
            aMarker.message === bMarker.message
        );
    });
};

async function loadMonacoAsync() {
    window.require = {
        paths: {
            vs: 'https://unpkg.com/monaco-editor@0.19.3/min/vs',
        },
    };

    await loadCSSFromURLAsync(
        'https://unpkg.com/monaco-editor@0.19.3/min/vs/editor/editor.main.css',
    );
    await loadScriptFromURLAsync('https://unpkg.com/monaco-editor@0.19.3/min/vs/loader.js');
    await loadScriptFromURLAsync(
        'https://unpkg.com/monaco-editor@0.19.3/min/vs/editor/editor.main.nls.js',
    );
    await loadScriptFromURLAsync(
        'https://unpkg.com/monaco-editor@0.19.3/min/vs/editor/editor.main.js',
    );

    return window.monaco;
}

/**
 * @param {object} options
 * @param {string} options.value
 * @param {string} options.language
 * @param {function} options.onChange
 * @param {function} options.onLoad
 * @param {function} options.onSyntaxError
 * @param {boolean} options.readOnly
 * @param {object} options.style
 * @param {number} options.renderSignal
 */
export default function Monaco({
    value,
    language,
    onChange,
    onLoad,
    onSyntaxError,
    readOnly,
    style,
    renderSignal,
}) {
    const [monaco, setMonaco] = useState(window.monaco);
    const [editor, setEditor] = useState(null);
    const [errors, setErrors] = useState([]);
    const rootRef = useRef(null);
    const valueRef = useRef(value);

    useEffect(() => {
        if (monaco) {
            onLoad();
            return;
        }
        loadMonacoAsync().then(loaded => {
            setMonaco(loaded);
        });
    }, [monaco, onLoad]);

    useEffect(() => {
        if (!monaco || !rootRef.current) {
            return () => {};
        }

        const newEditor = monaco.editor.create(rootRef.current, {
            // https://github.com/microsoft/monaco-editor/issues/29
            scrollBeyondLastLine: false,
            value: valueRef.current,
        });
        setEditor(newEditor);

        return () => newEditor.dispose();
    }, [monaco]);

    useEffect(() => {
        if (!editor || !monaco) {
            return () => {};
        }
        const changeSub = editor.onDidChangeModelContent(() => {
            const newValue = editor.getValue();
            valueRef.current = newValue;
            onChange(newValue);
        });
        return () => {
            changeSub.dispose();
        };
    }, [editor, monaco, onChange]);

    useEffect(() => {
        if (!editor || !monaco) {
            return () => {};
        }

        /**
         * Monaco emits "model decoration" change events more frequently than
         * changes to "model markers" occur. Use a React hook to track emitted
         * errors so to limit `onSyntaxError` handler invocations to cases
         * where the errors have changed. Augment React's change detection
         * algorithm (which is designed to work with primitive values) with a
         * domain-specific helper function that compares lists of errors.
         */
        const decorationsSub = editor.onDidChangeModelDecorations(() => {
            const model = editor.getModel();
            const modeId = model && model.getModeId();
            if (modeId !== 'json') {
                return;
            }

            const newErrors = monaco.editor.getModelMarkers({owner: modeId});
            if (markersMatch(errors, newErrors)) {
                return;
            }

            setErrors(newErrors);
        });
        return () => {
            decorationsSub.dispose();
        };
    }, [editor, monaco, errors]);

    useEffect(() => {
        onSyntaxError(errors);
    }, [errors, onSyntaxError]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        // Temporarily shrink the editor so that the surrounding flex layout
        // can be recalculated by the browser. The subsequent call to `layout`
        // will then expand the editor to the appropriate dimensions.
        editor.layout({height: 0, width: 0});
        editor.layout();
    }, [editor, renderSignal]);

    useLayoutEffect(() => {
        if (!editor) {
            return;
        }

        if (valueRef.current === value) {
            return;
        }

        editor.setValue(value);
    }, [editor, value]);
    useEffect(() => {
        if (!editor || !monaco) {
            return;
        }
        monaco.editor.setModelLanguage(editor.getModel(), language);
    }, [editor, monaco, language]);
    useEffect(() => {
        if (!editor) {
            return;
        }
        editor.updateOptions({readOnly});
    }, [editor, readOnly]);

    return <Box style={style} ref={rootRef} />;
}
