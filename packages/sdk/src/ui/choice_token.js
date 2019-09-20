// @flow

import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import Box from './box';
import useStyledSystem from './use_styled_system';
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

const _ChoiceToken = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/components/choice_token',
); 
const colors = window.__requirePrivateModuleFromAirtable('client_server_shared/colors');

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
        color?: string,
    |},
    style?: {[string]: mixed},
    className?: string,
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
    const {choice, className, style, ...styleProps} = props;
    const classNameForStyleProps = useStyledSystem(styleProps, styleParser);
    const color = choice.color
        ? colors.getColorForColorClass(choice.color)
        : colors.DEFAULT_CHOICE_COLOR;
    return (
        <Box className={cx('baymax', classNameForStyleProps)} style={style} display="inline-block">
            <_ChoiceToken
                color={color}
                className={cx(
                    'block border-box truncate pill px1 choiceToken line-height-4',
                    className,
                )}
            >
                <div className="flex-auto truncate">{choice.name}</div>
            </_ChoiceToken>
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
    ...stylePropTypes,
};

export default ChoiceToken;
