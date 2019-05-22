// @flow
import {UndoRedoModes, type UndoRedoMode} from './types/undo_redo';
import {type AirtableInterface} from './injected/airtable_interface';

const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

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
        if (!u.includes(u.values(UndoRedoModes), mode)) {
            throw new Error('Unexpected UndoRedo mode');
        }
        this._mode = mode;

        this._airtableInterface.setUndoRedoMode(mode);
    }
}

export default UndoRedo;
