/** @hidden */ /** */
import * as React from 'react';
import {css, keyframes} from 'emotion';
import {InterfaceBlockSdk} from '../sdk';
import Loader from '../../shared/ui/loader';
import {SdkContext} from '../../shared/ui/sdk_context';

interface BlockWrapperProps {
    sdk: InterfaceBlockSdk;
    children: React.ReactNode;
}

const suspenseFallbackClassName = css`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    -ms-grid-row-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
`;

const spinScale = keyframes`
    0% {
        transform: rotate(0) scale(1);
    }
    50% {
        transform: rotate(360deg) scale(0.9);
    }
    100% {
        transform: rotate(720deg) scale(1);
    }
`;

const animateSpinnerClassName = css`
    animation-iteration-count: infinite;
    animation-name: ${spinScale};
    animation-duration: 1800ms;
    animation-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);
`;

export class BlockWrapper extends React.Component<BlockWrapperProps> {
    /** @internal */
    _minSizeBeforeRender: {width: number | null; height: number | null} | null = null;
    /** @hidden */
    render() {
        return (
            <SdkContext.Provider value={this.props.sdk}>
                <React.Suspense
                    fallback={
                        <div className={suspenseFallbackClassName}>
                            <Loader className={animateSpinnerClassName} />
                        </div>
                    }
                >
                    {this.props.children}
                </React.Suspense>
            </SdkContext.Provider>
        );
    }
}
