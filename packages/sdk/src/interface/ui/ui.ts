/** @ignore */
import GlobalAlert from '../../shared/ui/global_alert';
// Import the top-level entry point so that an Sdk instance is created from the
// globally-available AirtableInterface instance.
import '..';

export {initializeBlock} from './initialize_block';
export {default as useBase} from './use_base';

export const globalAlert = new GlobalAlert();
