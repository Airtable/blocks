// @flow

import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {baymax} from './baymax_utils';

const _ChoiceToken = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/components/choice_token',
); 
const colors = window.__requirePrivateModuleFromAirtable('client_server_shared/colors');

/**
 * @typedef {object} ChoiceTokenProps
 * @property {object} choice An object representing a select option. You should not create these objects from scratch, but should instead grab them from base data.
 * @property {string} choice.id The ID of the select option.
 * @property {string} choice.name The name of the select option.
 * @property {string} [choice.color] The color of the select option.
 * @property {string} [className] Additional class names to apply to the collaborator token.
 */
type ChoiceTokenProps = {
    choice: {
        id: string,
        name: string,
        color?: string,
    },
    className?: string,
};

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
    const {choice, className} = props;
    const color = choice.color
        ? colors.getColorForColorClass(choice.color)
        : colors.DEFAULT_CHOICE_COLOR;
    return (
        <div className={cx('baymax', baymax('flex-inline'))}>
            <_ChoiceToken
                color={color}
                className={cx(
                    'block border-box truncate pill px1 choiceToken line-height-4',
                    className,
                )}
            >
                <div className="flex-auto truncate">{choice.name}</div>
            </_ChoiceToken>
        </div>
    );
};

ChoiceToken.propTypes = {
    choice: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string,
    }).isRequired,
    className: PropTypes.string,
};

export default ChoiceToken;
