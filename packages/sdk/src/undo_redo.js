// @flow
import {values} from './private_utils';
import {spawnError} from './error_utils';
import {UndoRedoModes, type UndoRedoMode} from './types/undo_redo';
import {type AirtableInterface} from './injected/airtable_interface';

class UndoRedo {
    modes = UndoRedoModes;

    _airtableInterface: AirtableInterface;
    _mode: UndoRedoMode = UndoRedoModes.NONE;

    constructor(airtableInterface: AirtableInterface) {
        this._airtableInterface = airtableInterface;
    }
    get mode(): UndoRedoMode {
        return this._mode;
    }
    set mode(mode: UndoRedoMode) {
        if (!values(UndoRedoModes).includes(mode)) {
            throw spawnError('Unexpected UndoRedo mode');
        }
        this._mode = mode;

        this._airtableInterface.setUndoRedoMode(mode);
    }
}

export default UndoRedo;
