import {type ObjectValues} from '../../shared/private_utils';

export const UndoRedoModes = Object.freeze({
    NONE: 'none' as const,
    AUTO: 'auto' as const,
});

/** @hidden */
export type UndoRedoMode = ObjectValues<typeof UndoRedoModes>;
