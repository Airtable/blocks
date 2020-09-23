import React, {useCallback, useEffect, useRef, useState} from 'react';
import debounce from 'lodash.debounce';
import {ControlledEditor, monaco as Monaco} from '@monaco-editor/react';
import {useViewport, useWatchable} from '@airtable/blocks/ui';

/**
 * isNewErrorList
 * @param  {Array} errors   An array of error objects that have already been received
 * @param  {Array} others   An array of error objects that may or may not be new
 * @return {true | false}
 */
function isNewErrorList(errors, others) {
    if (errors.length !== others.length) {
        return true;
    }
    for (let i = 0; i < errors.length; i++) {
        const error = errors[i];
        const other = others[i];
        if (
            error.endColumn !== other.endColumn ||
            error.endLineNumber !== other.endLineNumber ||
            error.message !== other.message ||
            error.startColumn !== other.startColumn ||
            error.startLineNumber !== other.startLineNumber
        ) {
            return true;
        }
    }

    return false;
}

/**
 * MonacoEditor
 *
 * @param {Function} options.onChange       Callback called when the content of the editor
 *                                          has been changed by the user
 * @param {Function} options.onCompletion   Callback called when an a suggested
 *                                          completion has accepted
 * @param {Function} options.onSyntaxError  Callback called when the content in the editor
 *                                          produces a syntax error
 * @param {Array<Object{schema, uri}>} options.schemas
 *                                          An array of pre-processed schema objects
 * @param {Array} options.completions       An array containing completion item objects
 * @param {Array} options.schemas           An array containing schema objects
 * @param {boolean} options.readOnly        Editor is readOnly, true | false
 * @param {Number} options.width            Initial width of the editor
 * @param {Number} options.height           Initial height of the editor
 * @param {String} options.value            Stringified VegaLite specification
 */
export default function MonacoEditor({
    onCompletion,
    onChange,
    onSyntaxError,
    completions,
    schemas,
    readOnly,
    width,
    height,
    value,
}) {
    const [errors, setErrors] = useState([]);
    const editor = useRef();
    const monaco = useRef();
    const viewport = useViewport();
    const promise = Monaco.init();

    // "memoizedResize callback"
    //
    // Monaco editor can be configured to fill its parent container, but
    // if that parent container changes size, Monaco will not be responsive
    // by default. According to Monaco's own source documentation, the "automaticLayout"
    // machinery it provides can have "severe performance impact".
    //
    const memoizedResize = useCallback(() => {
        // The double call to layout ensures that Monaco responds when
        // the width and height are both 0. This trick was borrowed from
        // the Script and JSON editor apps.
        editor.current.layout({height: 0, width: 0});
        editor.current.layout({height, width});
    }, [height, width]);

    // Monaco ControlledEditor will tell us once its has been mounted,
    // allowing us to setup refs used by internal hooks, as well as the
    // resizer
    function editorDidMount(_, editorInstance) {
        // The mounted editor instance is used in:
        //
        // - "viewport.isFullscreen effect"
        // - "viewport size watchable"
        // - "onChange effect"
        // - "completions effect"
        //
        editor.current = editorInstance;
        promise.then(monacoInstance => {
            // The initialized and resolved Monaco instance is used in:
            //
            // - "onChange effect"
            // - "completions effect"
            //
            monaco.current = monacoInstance;

            // Send an initial resize call, since the editor may have
            // changed size between the time the initial width and height
            // were sent to the ControlledEditor and the point at which
            // the editor has been mounted AND the monaco instance has
            // been initialized and resolved.
            memoizedResize();

            // Set up monaco behavior to:
            //
            // - ensure that $schema is enforced
            // - prevent users from adding comments to the JSON, which will
            //   be lost when the data is stored in GlobalConfig.
            //
            monacoInstance.languages.json.jsonDefaults.setDiagnosticsOptions({
                allowComments: false,
                enableSchemaRequest: true,
                validate: true,
                schemas,
            });
        });
    }

    // "viewport size watchable"
    useWatchable(viewport, ['size'], () => {
        if (!editor.current) {
            return;
        }
        // This is one of the cases that it borrowed from the Script and JSON
        // editors: when the size of the viewport changes, the editor may also
        // need to be resized. This enforces that behavior.
        memoizedResize();
    });

    // "onSyntaxError effect"
    useEffect(() => {
        // When syntax errors have been detected by monaco, call
        // the callback with the array of errors.
        onSyntaxError(errors);
    }, [onSyntaxError, errors]);

    // "onChange effect"
    useEffect(() => {
        if (!editor.current && !monaco.current) {
            return () => {};
        }

        // Determine if the last change text input matches one of the completions.
        // This validates input that will provide a completion that will be used by:
        //
        // - "onCompletion effect"
        //
        function getValidCompletion(input) {
            if (completions) {
                return completions.find(item => item.fieldName === input.trim());
            }
            return null;
        }

        // Setup detection of specific character inputs to trigger
        // "editor.action.triggerSuggest".
        //
        // Set up detection of user accepted completions.
        // This provides the completion that will be used by:
        //
        // - "onCompletion effect"
        //

        const didChangeModelContent = editor.current.onDidChangeModelContent(event => {
            const model = editor.current.getModel();

            for (const change of event.changes) {
                if (change.text) {
                    // When the user accepts a suggested autocompletion,
                    // we need to notify the editor component.
                    const validCompletion = getValidCompletion(
                        change.text.replace(/(^")|("$)/g, ''),
                    );

                    if (validCompletion) {
                        onCompletion(validCompletion, model.getValue());
                    }
                }
            }
        });

        // Set up detection for syntax errors by observing changes to model decorations
        // and capturing the current set of model markers.
        // This provides the array of errors that are used by:
        //
        // - "onSyntaxError effect"
        //
        // (Borrowed from the JSON editor.)
        const didChangeModelDecorations = editor.current.onDidChangeModelDecorations(() => {
            const model = editor.current.getModel();
            const owner = model && model.getModeId();
            if (owner !== 'json') {
                return;
            }

            const markers = monaco.current.editor.getModelMarkers({owner});

            if (isNewErrorList(errors, markers)) {
                setErrors(markers);
            }
        });

        return () => {
            didChangeModelContent.dispose();
            didChangeModelDecorations.dispose();
        };
    });

    // "completions effect"
    useEffect(() => {
        if (!monaco.current) {
            return () => {};
        }

        const {
            CompletionItemKind: {
                // unpack CompletionItemKind.Text as "kind" for
                // use in the prepared completion objects.
                Text: kind,
            },
            registerCompletionItemProvider,
        } = monaco.current.languages;

        // Completion objects need additional information added to them
        // at the time of their use. A completion may also need to have
        // additional formatting.
        const prepareCompletions = (completions, userQuoted, range) => {
            return completions.map(completion => {
                // If the user did not type a quote themselves, then
                // our completion insertText must be wrapped in quotes.
                const insertText = userQuoted
                    ? completion.insertText
                    : `"${completion.insertText}"`;

                // Make copies to preserve the original completion refs.
                return Object.assign({}, completion, {kind, range, insertText});
            });
        };

        // Setup a completion item provider that contains completions representing
        // all allowed fields of the selected table.
        const completionItemProvider = registerCompletionItemProvider('json', {
            // Trigger completion if the last character typed was either of:
            triggerCharacters: [':', '"'],
            provideCompletionItems(model, position) {
                return new Promise(resolve => {
                    const valueInRange = model
                        .getValueInRange({
                            startLineNumber: position.lineNumber,
                            startColumn: 1,
                            endLineNumber: position.lineNumber,
                            endColumn: position.column + 1,
                        })
                        .trim();

                    // Try to match the most recently typed characters up to `"field": "`
                    const goodMatch = valueInRange.match(/"field"\s*:\s*(["]*)?$/);
                    const badMatch = valueInRange.match(/"field"\s*:\s*"\w+"$/);

                    if (!goodMatch || (goodMatch && badMatch)) {
                        resolve({suggestions: []});
                    }

                    const userQuoted = /:\s*"/.test(valueInRange);
                    const {lineNumber: startLineNumber, lineNumber: endLineNumber} = position;
                    const {startColumn, endColumn} = model.getWordUntilPosition(position);
                    const suggestions = prepareCompletions(completions, userQuoted, {
                        startLineNumber,
                        endLineNumber,
                        startColumn,
                        endColumn,
                    });

                    resolve({
                        suggestions,
                    });
                });
            },
        });

        return () => {
            completionItemProvider.dispose();
        };
    }, [monaco, completions]);

    const options = {
        cursorBlinking: 'smooth',
        folding: true,
        lineNumbersMinChars: 4,
        minimap: {
            enabled: false,
        },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        readOnly,
    };
    const language = 'json';

    return (
        <ControlledEditor
            editorDidMount={editorDidMount}
            language={language}
            onChange={debounce(onChange, 700)}
            options={options}
            width={width}
            height={height}
            value={value}
        />
    );
}
