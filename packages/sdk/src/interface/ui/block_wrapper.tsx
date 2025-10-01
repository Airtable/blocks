/** @hidden */ /** */
import * as React from 'react';
import {type InterfaceBlockSdk} from '../sdk';
import Loader from '../../shared/ui/loader';
import {SdkContext} from '../../shared/ui/sdk_context';
import {getCssContentToAddToHead, SPIN_SCALE_ANIMATION_NAME} from './global_css_helpers';

interface BlockWrapperProps {
    sdk: InterfaceBlockSdk;
    children: React.ReactNode;
}

const suspenseFallbackStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const animateSpinnerStyle: React.CSSProperties = {
    animationIterationCount: 'infinite',
    animationName: SPIN_SCALE_ANIMATION_NAME,
    animationDuration: '1800ms',
    animationTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
};

export const BlockWrapper: React.FC<BlockWrapperProps> = ({sdk, children}) => {
    React.useLayoutEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = getCssContentToAddToHead();
        document.head.appendChild(styleElement);

        return () => {
            if (document.head.contains(styleElement)) {
                document.head.removeChild(styleElement);
            }
        };
    }, []);

    return (
        <SdkContext.Provider value={sdk}>
            <React.Suspense
                fallback={
                    <div style={suspenseFallbackStyle}>
                        <Loader style={animateSpinnerStyle} />
                    </div>
                }
            >
                {children}
            </React.Suspense>
        </SdkContext.Provider>
    );
};
