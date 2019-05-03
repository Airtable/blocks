// @flow

import PropTypes from 'prop-types';
import * as React from 'react';
import getSdk from '../get_sdk';

type SizeConstraintProp = {
    width?: number | null,
    height?: number | null,
};

type ViewportConstraintProps = {
    minSize?: SizeConstraintProp,
    maxFullscreenSize?: SizeConstraintProp,
    children?: React.Node,
};

const didSizeChange = (prev: ?SizeConstraintProp, next: ?SizeConstraintProp): boolean =>
    (prev && prev.width) !== (next && next.width) ||
    (prev && prev.height) !== (next && next.height);

/**
 * ViewportConstraint - when mounted, applies constraints to the viewport.
 *
 * @see sdk.viewport
 * @example
 * <UI.ViewportConstraint minSize={{width: 400}} />
 *
 * @example
 * <UI.ViewportConstraint maxFullScreenSize={{width: 600, height: 400}}>
 *      <div>I need a max fullscreen size!</div>
 * </UI.ViewportConstraint>
 */
class ViewportConstraint extends React.Component<ViewportConstraintProps> {
    static propTypes = {
        minSize: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number,
        }),
        maxFullscreenSize: PropTypes.shape({
            width: PropTypes.number,
            height: PropTypes.number,
        }),
        children: PropTypes.node,
    };

    props: ViewportConstraintProps;
    _removeMinSizeConstraintFn: (() => void) | null = null;
    _removeMaxFullscreenSizeConstrainFn: (() => void) | null = null;

    componentDidMount() {
        this._setMinSizeConstraint();
        this._setMaxFullscreenSizeConstraint();
    }

    shouldComponentUpdate(nextProps: ViewportConstraintProps) {
        return (
            this.props.children !== nextProps.children ||
            didSizeChange(this.props.minSize, nextProps.minSize) ||
            didSizeChange(this.props.maxFullscreenSize, nextProps.maxFullscreenSize)
        );
    }

    componentDidUpdate(prevProps: ViewportConstraintProps) {
        if (didSizeChange(prevProps.minSize, this.props.minSize)) {
            this._setMinSizeConstraint();
        }
        if (didSizeChange(prevProps.maxFullscreenSize, this.props.maxFullscreenSize)) {
            this._setMaxFullscreenSizeConstraint();
        }
    }

    componentWillUnmount() {
        this._removeMinSizeConstraint();
        this._removeMaxFullscreenSizeConstraint();
    }

    _removeMinSizeConstraint() {
        if (this._removeMinSizeConstraintFn) {
            this._removeMinSizeConstraintFn();
            this._removeMinSizeConstraintFn = null;
        }
    }

    _removeMaxFullscreenSizeConstraint() {
        if (this._removeMaxFullscreenSizeConstrainFn) {
            this._removeMaxFullscreenSizeConstrainFn();
            this._removeMaxFullscreenSizeConstrainFn = null;
        }
    }

    _setMinSizeConstraint() {
        this._removeMinSizeConstraint();
        if (this.props.minSize) {
            this._removeMinSizeConstraintFn = getSdk().viewport.addMinSize(this.props.minSize);
        }
    }

    _setMaxFullscreenSizeConstraint() {
        this._removeMaxFullscreenSizeConstraint();
        if (this.props.maxFullscreenSize) {
            this._removeMaxFullscreenSizeConstrainFn = getSdk().viewport.addMaxFullscreenSize(
                this.props.maxFullscreenSize,
            );
        }
    }

    render() {
        const children = this.props.children;

        if (children === null || children === undefined) {
            return null;
        }

        // In React 16+, Fragment is available, so we can allow this component
        // to accept one or more child. As we have to support React 15 as well,
        // we fall back to asserting there is only one child if Fragment is\
        // unavailable
        if (React.Fragment) {
            return <React.Fragment>{children}</React.Fragment>;
        }

        return React.Children.only(children);
    }
}

export default ViewportConstraint;
