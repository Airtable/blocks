// @flow
import * as React from 'react';
import {invariant} from '../error_utils';
import getSdk from '../get_sdk';
import {baymax} from './baymax_utils';
import Modal from './modal';
import Loader from './loader';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

type BlockWrapperProps = {|
    children: React.Node,
|};

class BlockWrapper extends React.Component<BlockWrapperProps> {
    _minSizeBeforeRender: {width: number | null, height: number | null} | null = null;
    constructor(props: BlockWrapperProps) {
        super(props);

        getSdk().UI.globalAlert.watch('__alertInfo', () => this.forceUpdate());
    }
    UNSAFE_componentWillMount() {
        this._snapshotMinSizeBeforeRender();
    }
    componentDidMount() {
        this._checkMinSizeConstraintUnchangedAfterRender();
    }
    UNSAFE_componentWillUpdate() {
        this._snapshotMinSizeBeforeRender();
    }
    componentDidUpdate() {
        this._checkMinSizeConstraintUnchangedAfterRender();
    }
    _snapshotMinSizeBeforeRender() {
        this._minSizeBeforeRender = getSdk().viewport.minSize;
    }
    _checkMinSizeConstraintUnchangedAfterRender() {
        const prevMinSize = this._minSizeBeforeRender;
        invariant(prevMinSize, 'prevMinSize must be set');
        const currentMinSize = getSdk().viewport.minSize;
        if (
            currentMinSize.width !== prevMinSize.width ||
            currentMinSize.height !== prevMinSize.height
        ) {
            this.forceUpdate();
        }
    }
    render() {
        const {UI, viewport} = getSdk();

        const globalAlertInfo = UI.globalAlert.__alertInfo;
        if (globalAlertInfo) {
            return (
                <Modal
                    className={baymax('absolute all-0 flex items-center justify-center p2')}
                    style={{
                        animation: 'none',
                        maxWidth: null,
                        maxHeight: null,
                        borderRadius: 0,
                        boxShadow: 'none',
                    }}
                >
                    {globalAlertInfo.content}
                </Modal>
            );
        }

        return (
            <>
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
                            zIndex: 2147483647, 
                        }}
                    >
                        <span className={baymax('center line-height-4 quiet strong')}>
                            <span>Please make this block bigger or </span>
                            <span
                                className={baymax('pointer understroke link-unquiet')}
                                onClick={() => viewport.enterFullscreenIfPossible()}
                            >
                                fullscreen
                            </span>
                        </span>
                    </div>
                )}
            </>
        );
    }
}

export default withHooks<BlockWrapperProps, {}, BlockWrapper>(BlockWrapper, () => {
    useWatchable(getSdk().viewport, ['size', 'minSize']);
    return {};
});
