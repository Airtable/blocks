// @flow
import invariant from 'invariant';
import * as React from 'react';
import getSdk from '../get_sdk';
import Modal from './modal';
import createDataContainer from './create_data_container';

type BlockWrapperProps = {|
    children: React.Node,
|};

class BlockWrapper extends React.Component<BlockWrapperProps> {
    _minSizeBeforeRender: {width: number | null, height: number | null} | null = null;
    constructor(props: BlockWrapperProps) {
        super(props);

        // We watch globalAlert in constructor, instead of using createDataContainer,
        // because createDataContainer starts watching after the component is mounted.
        // If we used createDataContainer and some child component in its constructor or
        // componentDidMount called globalAlert.showReloadPrompt, this component
        // would not update.
        // TODO(kasra): maybe change createDataContainer to handle this case
        // without having to special case it.
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
    // usually createDataContainer handles re-rendering when watchable values
    // change. As minSize can be changed by child components though, it can
    // change before createDataContainer has a chance to set up watches. To get
    // around this, we take a snapshot of the minSize before render and call
    // .forceUpdate() if its changed after render
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
                    className="absolute all-0 flex items-center justify-center p2"
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
                {this.props.children}

                {/*
                    TODO: if a modal is presented after we show this viewport
                    message, it will cover the message. We should fix this by
                    having this component manage the modal stack, so it can
                    guarantee that this viewport message is in front of all modals.
                */}
                {viewport.isSmallerThanMinSize && (
                    <div
                        className="absolute all-0 flex items-center justify-center p2 white"
                        style={{
                            zIndex: 2147483647, // largest 32-bit signed integer (maximum z-index)
                        }}
                    >
                        <span className="center line-height-4 quiet strong">
                            <span>Please make this block bigger or </span>
                            <span
                                className="pointer understroke link-unquiet"
                                onClick={() => viewport.enterFullscreen()}
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

export default createDataContainer(BlockWrapper, () => [
    {watch: getSdk().viewport, key: ['size', 'minSize']},
]);
