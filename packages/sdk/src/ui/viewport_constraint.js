// @flow

import PropTypes from 'prop-types';
import * as React from 'react';
import getSdk from '../get_sdk';

/** @typedef */
type ViewportSizeConstraintProp = {
    width?: number | null,
    height?: number | null,
};

/** @typedef */
type ViewportConstraintProps = {
    minSize?: ViewportSizeConstraintProp,
    maxFullscreenSize?: ViewportSizeConstraintProp,
    children?: React.Node,
};

const didSizeChange = (
    prev: ?ViewportSizeConstraintProp,
    next: ?ViewportSizeConstraintProp,
): boolean =>
    (prev && prev.width) !== (next && next.width) ||
    (prev && prev.height) !== (next && next.height);

/**
 * ViewportConstraint - when mounted, applies constraints to the viewport.
 *
 * @see sdk.viewport
 * @example
 * import {ViewportConstraint} from '@airtable/blocks/ui';
 * <ViewportConstraint minSize={{width: 400}} />
 *
 * @example
 * import {ViewportConstraint} from '@airtable/blocks/ui';
 * <ViewportConstraint maxFullScreenSize={{width: 600, height: 400}}>
 *      <div>I need a max fullscreen size!</div>
 * </ViewportConstraint>
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
        const {minSize} = this.props;
        if (minSize) {
            this._removeMinSizeConstraintFn = getSdk().viewport.addMinSize(minSize);
        }
    }

    _setMaxFullscreenSizeConstraint() {
        this._removeMaxFullscreenSizeConstraint();
        const {maxFullscreenSize} = this.props;
        if (maxFullscreenSize) {
            this._removeMaxFullscreenSizeConstrainFn = getSdk().viewport.addMaxFullscreenSize(
                maxFullscreenSize,
            );
        }
    }

    render() {
        return <React.Fragment>{this.props.children}</React.Fragment>;
    }
}

export default ViewportConstraint;
