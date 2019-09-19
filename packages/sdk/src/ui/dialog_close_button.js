// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {baymax} from './baymax_utils';
import withStyledSystem from './with_styled_system';
import {
    borderRadius,
    borderRadiusPropTypes,
    type BorderRadiusProps,
    dimensionsSet,
    dimensionsSetPropTypes,
    type DimensionsSetProps,
    display,
    displayPropTypes,
    type DisplayProps,
    flexContainerSet,
    flexContainerSetPropTypes,
    type FlexContainerSetProps,
    flexItemSet,
    flexItemSetPropTypes,
    type FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    type PositionSetProps,
    spacingSet,
    spacingSetPropTypes,
    type SpacingSetProps,
} from './system';
import Icon from './icon';

/**
 * @typedef {object} DialogCloseButtonProps
 * @property {string} [className] `className`s to apply to the close button, separated by spaces.
 * @property {object} [style] Styles to apply to the dialog element.
 * @property {number | string} [tabIndex] Indicates if the button can be focused and if/where it participates in sequential keyboard navigation.
 */
export type DialogCloseButtonProps = {|
    className?: string,
    style?: {[string]: mixed},
    tabIndex?: number | string,
    children?: React.Node,
|};

type StyleProps = {|
    ...BorderRadiusProps,
    ...DimensionsSetProps,
    ...DisplayProps,
    ...FlexContainerSetProps,
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...SpacingSetProps,
|};

const styleParser = compose(
    borderRadius,
    dimensionsSet,
    display,
    flexContainerSet,
    flexItemSet,
    positionSet,
    spacingSet,
);

const stylePropTypes = {
    ...borderRadiusPropTypes,
    ...dimensionsSetPropTypes,
    ...displayPropTypes,
    ...flexContainerSetPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...spacingSetPropTypes,
};

/**
 * A button that closes {@link Dialog}.
 *
 * @alias Dialog.CloseButton
 */

class DialogCloseButton extends React.Component<DialogCloseButtonProps> {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        children: PropTypes.node,
    };
    static contextTypes = {
        onDialogClose: PropTypes.func,
    };
    _onKeyDown: (e: SyntheticKeyboardEvent<HTMLDivElement>) => void;
    constructor(props: DialogCloseButtonProps) {
        super(props);
        this._onKeyDown = this._onKeyDown.bind(this);
    }
    _onKeyDown(e: SyntheticKeyboardEvent<HTMLDivElement>) {
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return;
        }
        if (['Enter', ' '].includes(e.key)) {
            e.preventDefault();
            this.context.onDialogClose();
        }
    }
    render() {
        const {className, style, tabIndex, children} = this.props;
        return (
            <div
                onClick={this.context.onDialogClose}
                onKeyDown={this._onKeyDown}
                className={cx(baymax('darken1-hover darken1-focus no-outline pointer'), className)}
                style={style}
                tabIndex={tabIndex || 0}
                role="button"
                aria-label="Close dialog"
            >
                {children ? children : <Icon name="x" size={12} className={baymax('quieter')} />}
            </div>
        );
    }
}

export default withStyledSystem<DialogCloseButtonProps, StyleProps, DialogCloseButton, {}>(
    DialogCloseButton,
    styleParser,
    stylePropTypes,
    {
        position: 'absolute',
        top: 0,
        right: 0,
        marginTop: 2,
        marginRight: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: 'circle',
    },
);
