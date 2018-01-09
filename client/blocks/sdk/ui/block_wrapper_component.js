// @flow
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const Modal = require('client/blocks/sdk/ui/modal');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');

class BlockWrapperComponent extends React.Component {
    static propTypes = {
        // Note: this is whatever the block exports from the frontend entry point,
        // so there's no guarantee that it's actually a React component.
        EntryComponent: PropTypes.any,
    };
    constructor(props) {
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
    render() {
        const {UI, viewport} = getSdk();

        const globalAlertInfo = UI.globalAlert.__alertInfo;
        if (globalAlertInfo) {
            return (
                <Modal className="absolute all-0 flex items-center justify-center p2" style={{
                    animation: 'none',
                    maxWidth: null,
                    maxHeight: null,
                    borderRadius: 0,
                    boxShadow: 'none',
                }}>
                    {globalAlertInfo.content}
                </Modal>
            );
        }

        const {EntryComponent} = this.props;
        // TODO: the ReactComponent check doesn't work for legacy React.createClass components.
        // Could fix by using this check: https://github.com/facebook/relay/blob/e918103/src/container/RelayContainerUtils.js#L21
        if (EntryComponent && (EntryComponent.prototype instanceof React.Component || EntryComponent instanceof Function)) {
            return (
                <div>
                    <EntryComponent />

                    {/*
                        TODO: if a modal is presented after we show this viewport
                        message, it will cover the message. We should fix this by
                        having this component manage the modal stack, so it can
                        guarantee that this viewport message is in front of all modals.
                    */}
                    {viewport.isSmallerThanMinSize &&
                        <Modal className="absolute all-0 flex items-center justify-center p2" style={{
                            animation: 'none',
                            maxWidth: null,
                            maxHeight: null,
                            borderRadius: 0,
                            boxShadow: 'none',
                        }}>
                            <span className="center line-height-4 quiet strong">
                                <span>Please make this block bigger or </span>
                                <span
                                    className="pointer understroke link-unquiet"
                                    onClick={() => viewport.enterFullscreen()}>
                                    fullscreen
                                </span>
                            </span>
                        </Modal>
                    }
                </div>
            );
        } else {
            // TODO: only show this in development mode? Or never?
            return (
                <div style={{padding: 24, color: '#999', textAlign: 'center', fontFamily: 'sans-serif'}}>Must export a React component.</div>
            );
        }
    }
}

module.exports = createDataContainer(BlockWrapperComponent, () => [
    {watch: getSdk().viewport, key: ['size', 'minSize']},
]);
