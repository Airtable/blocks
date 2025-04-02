/** @hidden */ /** */
import * as React from 'react';
import {invariant} from '../../shared/error_utils';
import Sdk from '../sdk';
import {baymax} from '../../shared/ui/baymax_utils';
import Modal from '../../shared/ui/modal';
import Loader from '../../shared/ui/loader';
import withHooks from '../../shared/ui/with_hooks';
import useWatchable from '../../shared/ui/use_watchable';
import {SdkContext} from '../../shared/ui/sdk_context';
import {globalAlert} from './ui';

interface BlockWrapperProps {
    sdk: Sdk;
    children: React.ReactNode;
}

class BlockWrapper extends React.Component<BlockWrapperProps> {
    /** @internal */
    _minSizeBeforeRender: {width: number | null; height: number | null} | null = null;
    /** @hidden */
    constructor(props: BlockWrapperProps) {
        super(props);

        // We watch globalAlert in constructor, instead of using createDataContainer,
        // because createDataContainer starts watching after the component is mounted.
        // If we used createDataContainer and some child component in its constructor or
        // componentDidMount called globalAlert.showReloadPrompt, this component
        // would not update.
        // TODO(kasra): maybe change createDataContainer to handle this case
        // without having to special case it.
        globalAlert.watch('__alertInfo', () => this.forceUpdate());
    }
    /** @hidden */
    UNSAFE_componentWillMount() {
        this._snapshotMinSizeBeforeRender();
    }
    /** @hidden */
    componentDidMount() {
        this._checkMinSizeConstraintUnchangedAfterRender();
    }
    /** @hidden */
    UNSAFE_componentWillUpdate() {
        this._snapshotMinSizeBeforeRender();
    }
    /** @hidden */
    componentDidUpdate() {
        this._checkMinSizeConstraintUnchangedAfterRender();
    }
    // usually createDataContainer handles re-rendering when watchable values
    // change. As minSize can be changed by child components though, it can
    // change before createDataContainer has a chance to set up watches. To get
    // around this, we take a snapshot of the minSize before render and call
    // .forceUpdate() if its changed after render
    /** @internal */
    _snapshotMinSizeBeforeRender() {
        this._minSizeBeforeRender = this.props.sdk.viewport.minSize;
    }
    /** @internal */
    _checkMinSizeConstraintUnchangedAfterRender() {
        const prevMinSize = this._minSizeBeforeRender;
        invariant(prevMinSize, 'prevMinSize must be set');
        const currentMinSize = this.props.sdk.viewport.minSize;
        if (
            currentMinSize.width !== prevMinSize.width ||
            currentMinSize.height !== prevMinSize.height
        ) {
            this.forceUpdate();
        }
    }
    /** @hidden */
    render() {
        const {viewport} = this.props.sdk;

        const globalAlertInfo = globalAlert.__alertInfo;
        if (globalAlertInfo) {
            return (
                <SdkContext.Provider value={this.props.sdk}>
                    <Modal
                        className={baymax('absolute all-0 flex items-center justify-center p2')}
                        style={{
                            animation: 'none',
                            maxWidth: undefined,
                            maxHeight: undefined,
                            borderRadius: 0,
                            boxShadow: 'none',
                        }}
                    >
                        {globalAlertInfo.content}
                    </Modal>
                </SdkContext.Provider>
            );
        }

        return (
            <SdkContext.Provider value={this.props.sdk}>
                <React.Suspense
                    fallback={
                        <div className={baymax('absolute all-0 flex items-center justify-center')}>
                            <Loader />
                        </div>
                    }
                >
                    <div
                        className={
                            viewport.isSmallerThanMinSize
                                ? baymax('absolute all-0 overflow-hidden')
                                : ''
                        }
                    >
                        {this.props.children}
                    </div>
                </React.Suspense>

                {/*
                    TODO: if a modal is presented after we show this viewport
                    message, it will cover the message. We should fix this by
                    having this component manage the modal stack, so it can
                    guarantee that this viewport message is in front of all modals.
                */}
                {viewport.isSmallerThanMinSize && (
                    <div
                        className={baymax(
                            'absolute all-0 flex items-center justify-center p2 white',
                        )}
                        style={{
                            zIndex: 2147483647, // largest 32-bit signed integer (maximum z-index)
                        }}
                    >
                        <span className={baymax('center line-height-4 quiet strong')}>
                            <span>Please make this extension bigger or </span>
                            <span
                                className={baymax('pointer understroke link-unquiet')}
                                onClick={() => viewport.enterFullscreenIfPossible()}
                            >
                                fullscreen
                            </span>
                        </span>
                    </div>
                )}
            </SdkContext.Provider>
        );
    }
}

export default withHooks<{}, BlockWrapperProps, BlockWrapper>(BlockWrapper, ({sdk}) => {
    useWatchable(sdk.viewport, ['size', 'minSize']);
    return {};
});
