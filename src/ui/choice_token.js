// @flow

import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as React from 'react';

const _ChoiceToken = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/components/choice_token',
); // TODO(kasra): don't depend on liveapp components.
const colors = window.__requirePrivateModuleFromAirtable('client_server_shared/colors');

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
 * @param {object} props The props for the component.
 * @param {object} props.choice An object representing a select choice. You should not create these objects from scratch, but should instead grab them from base data.
 * @param {string} [props.className=''] Additional class names for the component, separated by spaces.
 * @returns A React node.
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
const ChoiceToken = ({choice, className}: ChoiceTokenProps): React.Node => {
    // Convert the choice color back to a private api choice color.
    const color = choice.color
        ? colors.getColorForColorClass(choice.color)
        : colors.DEFAULT_CHOICE_COLOR;
    return (
        <_ChoiceToken
            color={color}
            className={classNames(
                'border-box truncate pill px1 cellToken choiceToken line-height-4 inline-block',
                className,
            )}
        >
            <div className="flex-auto truncate">{choice.name}</div>
        </_ChoiceToken>
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
