import {values} from '../shared/private_utils';
import {spawnError} from '../shared/error_utils';
import {UndoRedoModes, type UndoRedoMode} from './types/undo_redo';
import {type AirtableInterface} from './types/airtable_interface';

/** @hidden */
class UndoRedo {
    /** @hidden */
    modes = UndoRedoModes;

    /** @internal */
    _airtableInterface: AirtableInterface;
    /** @internal */
    _mode: UndoRedoMode = UndoRedoModes.NONE;

    /** @hidden */
    constructor(airtableInterface: AirtableInterface) {
        this._airtableInterface = airtableInterface;
    }
    /** @hidden */
    get mode(): UndoRedoMode {
        return this._mode;
    }
    /** @hidden */
    set mode(mode: UndoRedoMode) {
        if (!values(UndoRedoModes).includes(mode)) {
            throw spawnError('Unexpected UndoRedo mode');
        }
        this._mode = mode;

        this._airtableInterface.setUndoRedoMode(mode);
    }
}

export default UndoRedo;
