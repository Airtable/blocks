// @flow
export const UndoRedoModes = Object.freeze({
    NONE: ('none': 'none'),
    AUTO: ('auto': 'auto'),
});

export type UndoRedoMode = $Values<typeof UndoRedoModes>;
