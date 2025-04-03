/** @hidden */ /** */
import * as React from 'react';
import {InterfaceBlockSdk} from '../sdk';
import {baymax} from '../../shared/ui/baymax_utils';
import Modal from '../../shared/ui/modal';
import Loader from '../../shared/ui/loader';
import {SdkContext} from '../../shared/ui/sdk_context';
import {globalAlert} from './ui';

interface BlockWrapperProps {
    sdk: InterfaceBlockSdk;
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
    render() {
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
                    {this.props.children}
                </React.Suspense>
            </SdkContext.Provider>
        );
    }
}

export default BlockWrapper;
