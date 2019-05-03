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

/** */
const ChoiceToken = ({choice, className}: ChoiceTokenProps) => {
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
