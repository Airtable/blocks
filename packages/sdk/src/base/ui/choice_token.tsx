/** @module @airtable/blocks/ui: ChoiceToken */ /** */
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {type Color} from '../../shared/colors';
import {baymax} from './baymax_utils';
import Box from './box';
import Text from './text';
import useStyledSystem from './use_styled_system';
import useTextColorForBackgroundColor from './use_text_color_for_background_color';
import {
    flexItemSet,
    type FlexItemSetProps,
    positionSet,
    type PositionSetProps,
    margin,
    type MarginProps,
} from './system';
import {type TooltipAnchorProps} from './types/tooltip_anchor_props';

/**
 * Style props for the {@link ChoiceToken} component. Accepts:
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link PositionSetProps}
 *
 * @noInheritDoc
 */
interface ChoiceTokenStyleProps extends FlexItemSetProps, PositionSetProps, MarginProps {}

const styleParser = compose(flexItemSet, positionSet, margin);

const DEFAULT_CHOICE_COLOR = 'gray';

/** An option from a select field. You should not create these objects from scratch, but should instead grab them from base data. */
interface ChoiceOption {
    /** The ID of the select option. */
    id?: string;
    /** The name of the select option. */
    name: string;
    /** The color of the select option. */
    color?: Color;
}

/**
 * Props for the {@link ChoiceToken} component. Also accepts:
 * * {@link ChoiceTokenStyleProps}
 *
 * @docsPath UI/components/ChoiceToken
 * @noInheritDoc
 */
export interface ChoiceTokenProps extends ChoiceTokenStyleProps, TooltipAnchorProps {
    /** An object representing a select option. You should not create these objects from scratch, but should instead grab them from base data. */
    choice: ChoiceOption;
    /** Additional styles to apply to the choice token. */
    style?: React.CSSProperties;
    /** Additional class names to apply to the choice token. */
    className?: string;
}

/**
 * A component that shows a single choice in a small token, to be displayed inline or in a list of choices.
 *
 * [[ Story id="choicetoken--example" title="Choice token example" ]]
 *
 * @component
 * @docsPath UI/components/ChoiceToken
 */
const ChoiceToken = (props: ChoiceTokenProps) => {
    const {
        choice,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
        className,
        style,
        ...styleProps
    } = props;
    const classNameForStyleProps = useStyledSystem<ChoiceTokenStyleProps>(styleProps, styleParser);
    const color = choice.color || DEFAULT_CHOICE_COLOR;
    const textColor = useTextColorForBackgroundColor(color);

    return (
        <Box className={cx(className, classNameForStyleProps)} style={style} display="inline-block">
            <Box
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                className={baymax('print-color-exact align-top border-box')}
                backgroundColor={color}
                minWidth="18px"
                height="18px"
                borderRadius="circle"
                paddingX={2}
            >
                <Text
                    className={baymax('truncate')}
                    textColor={textColor}
                    fontSize="13px"
                    fontWeight="400"
                    lineHeight={1.5}
                >
                    {choice.name}
                </Text>
            </Box>
        </Box>
    );
};

export default ChoiceToken;
