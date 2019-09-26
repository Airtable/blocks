// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {type Color} from '../colors';
import {baymax} from './baymax_utils';
import Box from './box';
import useStyledSystem from './use_styled_system';
import useTextColorForBackgroundColor from './use_text_color_for_background_color';
import {
    flexItemSet,
    flexItemSetPropTypes,
    type FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    type PositionSetProps,
    margin,
    marginPropTypes,
    type MarginProps,
} from './system';
import {tooltipAnchorPropTypes, type TooltipAnchorProps} from './types/tooltip_anchor_props';

type StyleProps = {|
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...MarginProps,
|};

const styleParser = compose(
    flexItemSet,
    positionSet,
    margin,
);

const stylePropTypes = {
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

const DEFAULT_CHOICE_COLOR = 'gray';

/**
 * @typedef {object} ChoiceTokenProps
 * @property {object} choice An object representing a select option. You should not create these objects from scratch, but should instead grab them from base data.
 * @property {string} choice.id The ID of the select option.
 * @property {string} choice.name The name of the select option.
 * @property {string} [choice.color] The color of the select option.
 * @property {string} [style] Additional styles to apply to the choice token.
 * @property {string} [className] Additional class names to apply to the choice token.
 */
type ChoiceTokenProps = {|
    choice: {|
        id: string,
        name: string,
        color?: Color,
    |},
    style?: {[string]: mixed},
    className?: string,
    ...TooltipAnchorProps,
    ...StyleProps,
|};

/**
 * A component that shows a single choice in a small token, to be displayed inline or in a list of choices.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {ChoiceTokenProps} props
 *
 * @example
 * import {UI} from '@airtable/blocks';
 *
 * function ChoicesForSelectField({selectField}) {
 *     const choiceNodes = selectField.options.choices.map(choice => (
 *         <UI.ChoiceToken
 *             key={choice.id}
 *             choice={choice}
 *         />
 *     ));
 *
 *     return (
 *         <React.Fragment>
 *             Here are all of your choices:
 *             {choiceNodes}
 *         </React.Fragment>
 *     );
 * }
 */
const ChoiceToken = (props: ChoiceTokenProps) => {
    const {
        choice,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line no-unused-vars
        hasOnClick,
        className,
        style,
        ...styleProps
    } = props;
    const classNameForStyleProps = useStyledSystem(styleProps, styleParser);
    const color = choice.color || DEFAULT_CHOICE_COLOR;
    const textColor = useTextColorForBackgroundColor(color);

    return (
        <Box className={cx(className, classNameForStyleProps)} style={style} display="inline-block">
            <Box
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                className={baymax('print-color-exact align-top')}
                backgroundColor={color}
                minWidth="18px"
                height="18px"
                borderRadius="circle"
                paddingX={2}
            >
                {/* TODO: Replace with <Text> component once it is available */}
                <Box
                    className={baymax('truncate')}
                    textColor={textColor}
                    fontSize="13px"
                    fontWeight="400"
                    lineHeight={1.5}
                >
                    {choice.name}
                </Box>
            </Box>
        </Box>
    );
};

ChoiceToken.propTypes = {
    choice: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string,
    }).isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    ...tooltipAnchorPropTypes,
    ...stylePropTypes,
};

export default ChoiceToken;
