// @flow
const React = require('client/blocks/sdk/ui/react');
const _ChoiceToken = require('client_server_shared/column_types/components/choice_token'); // TODO(kasra): don't depend on liveapp components.
const colors = require('client_server_shared/colors');

type ChoiceTokenProps = {
    choice: {
        id: string,
        name: string,
        color?: string,
    },
    className?: string,
};

const ChoiceToken = ({choice, className}: ChoiceTokenProps) => {
    const color = choice.color || colors.DEFAULT_CHOICE_COLOR;
    return (
        <_ChoiceToken color={color} className={className}>
            <div className="flex-auto truncate">{choice.name}</div>
        </_ChoiceToken>
    );
};

ChoiceToken.propTypes = {
    choice: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        color: React.PropTypes.string,
    }).isRequired,
    className: React.PropTypes.string,
};

module.exports = ChoiceToken;
