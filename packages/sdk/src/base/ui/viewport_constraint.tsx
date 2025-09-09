/**
 * @module @airtable/blocks/ui: ViewportConstraint
 * @docsPath UI/components/ViewportConstraint
 */ /** */
import * as React from 'react';
import {type ViewportSizeConstraint} from '../types/viewport';
import type Sdk from '../sdk';
import withHooks from '../../shared/ui/with_hooks';
import {useSdk} from '../../shared/ui/sdk_context';
import {type BaseSdkMode} from '../../sdk_mode';

/** An object specifying a width and/or height for the block's viewport. */
type ViewportSizeConstraintProp = Partial<ViewportSizeConstraint>;

/**
 * Props for the {@link ViewportConstraint} component.
 *
 * @docsPath UI/components/ViewportConstraint
 */
interface ViewportConstraintProps {
    /** The minimum viewport size of the extension. */
    minSize?: ViewportSizeConstraintProp;
    /** The maximum viewport size of the extension when it is in fullscreen mode. */
    maxFullscreenSize?: ViewportSizeConstraintProp;
    /** The contents of the viewport constraint. */
    children?: React.ReactNode;
    /** @internal injected by withHooks */
    sdk: Sdk;
}

const didSizeChange = (
    prev?: ViewportSizeConstraintProp | null,
    next?: ViewportSizeConstraintProp | null,
): boolean =>
    (prev && prev.width) !== (next && next.width) ||
    (prev && prev.height) !== (next && next.height);

/**
 * When mounted, this wrapper component applies size constraints to the {@link Viewport}.
 * Like {@link addMinSize}, this will fullscreen the extension if necessary and possible when
 * `minSize` is updated.
 *
 * @example
 * ```js
 * import {ViewportConstraint} from '@airtable/blocks/base/ui';
 * <ViewportConstraint minSize={{width: 400}} />
 * ```
 *
 * @example
 * ```js
 * import {ViewportConstraint} from '@airtable/blocks/base/ui';
 * <ViewportConstraint maxFullScreenSize={{width: 600, height: 400}}>
 *      <div>I need a max fullscreen size!</div>
 * </ViewportConstraint>
 * ```
 * @docsPath UI/components/ViewportConstraint
 * @component
 */
class ViewportConstraint extends React.Component<ViewportConstraintProps> {
    /** @internal */
    _removeMinSizeConstraintFn: (() => void) | null = null;
    /** @internal */
    _removeMaxFullscreenSizeConstrainFn: (() => void) | null = null;

    /** @hidden */
    componentDidMount() {
        this._setMinSizeConstraint();
        this._setMaxFullscreenSizeConstraint();
    }

    /** @hidden */
    shouldComponentUpdate(nextProps: ViewportConstraintProps) {
        return (
            this.props.children !== nextProps.children ||
            didSizeChange(this.props.minSize, nextProps.minSize) ||
            didSizeChange(this.props.maxFullscreenSize, nextProps.maxFullscreenSize)
        );
    }

    /** @hidden */
    componentDidUpdate(prevProps: ViewportConstraintProps) {
        if (didSizeChange(prevProps.minSize, this.props.minSize)) {
            this._setMinSizeConstraint();
        }
        if (didSizeChange(prevProps.maxFullscreenSize, this.props.maxFullscreenSize)) {
            this._setMaxFullscreenSizeConstraint();
        }
    }

    /** @hidden */
    componentWillUnmount() {
        this._removeMinSizeConstraint();
        this._removeMaxFullscreenSizeConstraint();
    }

    /** @internal */
    _removeMinSizeConstraint() {
        if (this._removeMinSizeConstraintFn) {
            this._removeMinSizeConstraintFn();
            this._removeMinSizeConstraintFn = null;
        }
    }

    /** @internal */
    _removeMaxFullscreenSizeConstraint() {
        if (this._removeMaxFullscreenSizeConstrainFn) {
            this._removeMaxFullscreenSizeConstrainFn();
            this._removeMaxFullscreenSizeConstrainFn = null;
        }
    }

    /** @internal */
    _setMinSizeConstraint() {
        this._removeMinSizeConstraint();
        const {minSize} = this.props;
        if (minSize) {
            this._removeMinSizeConstraintFn = this.props.sdk.viewport.addMinSize(minSize);
        }
    }

    /** @internal */
    _setMaxFullscreenSizeConstraint() {
        this._removeMaxFullscreenSizeConstraint();
        const {maxFullscreenSize} = this.props;
        if (maxFullscreenSize) {
            this._removeMaxFullscreenSizeConstrainFn =
                this.props.sdk.viewport.addMaxFullscreenSize(maxFullscreenSize);
        }
    }

    /** @hidden */
    render() {
        return <React.Fragment>{this.props.children}</React.Fragment>;
    }
}

export default withHooks<{sdk: Sdk}, ViewportConstraintProps, ViewportConstraint>(
    ViewportConstraint,
    (props) => {
        return {
            sdk: useSdk<BaseSdkMode>(),
        };
    },
);
