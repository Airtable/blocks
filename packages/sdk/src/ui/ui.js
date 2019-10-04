// @flow
import colors from '../colors';
import colorUtils from '../color_utils';
import Synced from './synced';
import TablePicker from './table_picker';
import TablePickerSynced from './table_picker_synced';
import FieldPicker from './field_picker';
import FieldPickerSynced from './field_picker_synced';
import ViewPicker from './view_picker';
import ViewPickerSynced from './view_picker_synced';
import Input from './input';
import InputSynced from './input_synced';
import CellRenderer from './cell_renderer';
import expandRecord from './expand_record';
import expandRecordList from './expand_record_list';
import expandRecordPickerAsync from './expand_record_picker_async';
import GlobalAlert from './global_alert';
import FieldIcon from './field_icon';
import Icon from './icon';
import Loader from './loader';
import Tooltip from './tooltip';
import CollaboratorToken from './collaborator_token';
import ChoiceToken from './choice_token';
import ColorPalette from './color_palette';
import ColorPaletteSynced from './color_palette_synced';
import ProgressBar from './progress_bar';
import Button from './button';
import RecordCard from './record_card';
import RecordCardList from './record_card_list';
import Select from './select';
import SelectSynced from './select_synced';
import SelectButtons from './select_buttons';
import SelectButtonsSynced from './select_buttons_synced';
import Modal from './modal';
import Dialog from './dialog';
import ConfirmationDialog from './confirmation_dialog';
import Toggle from './toggle';
import ToggleSynced from './toggle_synced';
import Popover from './popover';
import ViewportConstraint from './viewport_constraint';
import Link from './link';
import Box from './box';
import Text from './text';
import Heading from './heading';
import Label from './label';
import {loadCSSFromString, loadCSSFromURLAsync, loadScriptFromURLAsync} from './remote_utils';
import initializeBlock from './initialize_block';
import withHooks from './with_hooks';
import useLoadable from './use_loadable';
import {useRecordIds, useRecords, useRecordById} from './use_records';
import useBase from './use_base';
import useSession from './use_session';
import useSettingsButton from './use_settings_button';
import useWatchable from './use_watchable';
import useViewport from './use_viewport';
import useGlobalConfig from './use_global_config';
import useViewMetadata from './use_view_metadata';

const UI = {
    Popover,
    loadCSSFromString,
    loadScriptFromURLAsync,
    loadCSSFromURLAsync,
    expandRecord,
    expandRecordList,
    expandRecordPickerAsync,
    Synced,
    TablePicker,
    TablePickerSynced,
    FieldPicker,
    FieldPickerSynced,
    ViewPicker,
    ViewPickerSynced,
    Input,
    InputSynced,
    CellRenderer,
    FieldIcon,
    Icon,
    Loader,
    Tooltip,
    CollaboratorToken,
    ChoiceToken,
    colors,
    colorUtils,
    ColorPalette,
    ColorPaletteSynced,
    Link,
    Box,
    Text,
    Heading,
    Label,
    ProgressBar,
    Button,
    RecordCard,
    RecordCardList,
    Select,
    SelectSynced,
    SelectButtons,
    SelectButtonsSynced,
    Modal,
    Dialog,
    ConfirmationDialog,
    Toggle,
    ToggleSynced,
    ViewportConstraint,
    globalAlert: new GlobalAlert(),
    initializeBlock,
    withHooks,
    useBase,
    useSession,
    useSettingsButton,
    useViewport,
    useWatchable,
    useLoadable,
    useRecordIds,
    useRecords,
    useRecordById,
    useGlobalConfig,
    useViewMetadata,
};

export default UI;
