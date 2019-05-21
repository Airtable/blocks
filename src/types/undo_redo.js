// @flow
export const UndoRedoModes = {
    NONE: ('none': 'none'),
    AUTO: ('auto': 'auto'),
};

export type UndoRedoMode = $Values<typeof UndoRedoModes>;
