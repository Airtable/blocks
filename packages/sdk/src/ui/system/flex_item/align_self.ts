/** @module @airtable/blocks/ui/system: Flex item */ /** */
import {system, Config} from '@styled-system/core';
import createStylePropTypes from '../utils/create_style_prop_types';
import {AlignSelfProperty} from '../utils/csstype';
import {Prop} from '../utils/types';

/** */
export interface AlignSelfProps {
    /** Aligns flex items of the current flex line, overriding the `alignItems` value. */
    alignSelf?: Prop<AlignSelfProperty>;
}

export const config: Config = {alignSelf: true};

export const alignSelf = system(config);
export const alignSelfPropTypes = createStylePropTypes(alignSelf.propNames);
