// @flow
import {type BlockUndoRedoMode} from 'client/blocks/block_undo_redo_modes';
import {type AirtableInterface} from './injected/airtable_interface';

const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const BlockUndoRedoModes = window.__requirePrivateModuleFromAirtable(
    'client/blocks/block_undo_redo_modes',
);

class UndoRedo {
    modes = BlockUndoRedoModes;

    _airtableInterface: AirtableInterface;
    _mode: BlockUndoRedoMode = BlockUndoRedoModes.NONE;

    constructor(airtableInterface: AirtableInterface) {
        this._airtableInterface = airtableInterface;
    }
    get mode(): BlockUndoRedoMode {
        return this._mode;
    }
    set mode(mode: BlockUndoRedoMode) {
        if (!u.includes(u.values(BlockUndoRedoModes), mode)) {
            throw new Error('Unexpected UndoRedo mode');
        }
        this._mode = mode;

        this._airtableInterface.setUndoRedoMode(mode);
    }
}

export default UndoRedo;
