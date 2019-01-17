// @flow

// Careful! This object is part of the blocks SDK so if you change
// the keys, you can break blocks.
const BlockUndoRedoModes = {
    NONE: ('none': 'none'),
    AUTO: ('auto': 'auto'),
};

export type BlockUndoRedoMode = $Values<typeof BlockUndoRedoModes>;

module.exports = BlockUndoRedoModes;
