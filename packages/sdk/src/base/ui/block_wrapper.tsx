/** @hidden */ /** */
import * as React from 'react';
import type Sdk from '../sdk';
import {SdkContext} from '../../shared/ui/sdk_context';
import Loader from '../../shared/ui/loader';
import {type GlobalAlert, globalAlert, useWatchable} from './ui';
import {
    getCssContentToAddToHead,
    BUTTON_LINK_CLASS_NAME,
    SPIN_SCALE_ANIMATION_NAME,
} from './global_css_helpers';

interface BlockWrapperProps {
    sdk: Sdk;
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

const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
};

const fullscreenMessageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: '#ffffff',
    zIndex: 2147483647, 
};

const animateSpinnerStyle: React.CSSProperties = {
    animationIterationCount: 'infinite',
    animationName: SPIN_SCALE_ANIMATION_NAME,
    animationDuration: '1800ms',
    animationTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
};

export default function BlockWrapper(props: BlockWrapperProps) {
    const {sdk, children} = props;

    const [globalAlertInfoIfExists, setGlobalAlertInfoIfExists] = React.useState<
        GlobalAlert['__alertInfo'] | null
    >(null);
    React.useEffect(() => {
        if (globalAlertInfoIfExists) {
            return () => {};
        }

        if (globalAlert.__alertInfo) {
            setGlobalAlertInfoIfExists(globalAlert.__alertInfo);
        }

        const onAlertInfoChange = (a: GlobalAlert) => setGlobalAlertInfoIfExists(a.__alertInfo);
        globalAlert.watch('__alertInfo', onAlertInfoChange);
        return () => {
            globalAlert.unwatch('__alertInfo', onAlertInfoChange);
        };
    }, [globalAlertInfoIfExists]);

    const viewport = sdk.viewport;
    useWatchable(viewport, ['size', 'minSize']);
    const minSizeBeforeFirstRender = React.useRef<{
        width: number | null;
        height: number | null;
    } | null>(viewport.minSize);
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    React.useEffect(() => {
        if (minSizeBeforeFirstRender.current) {
            const prevMinSize = minSizeBeforeFirstRender.current;
            minSizeBeforeFirstRender.current = null;
            const currentMinSize = viewport.minSize;
            if (
                currentMinSize.width !== prevMinSize.width ||
                currentMinSize.height !== prevMinSize.height
            ) {
                forceUpdate();
            }
        }
    }, [viewport]);

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

    if (globalAlertInfoIfExists) {
        return (
            <SdkContext.Provider value={sdk}>
                <div style={fullscreenMessageStyle}>{globalAlertInfoIfExists.content}</div>
            </SdkContext.Provider>
        );
    }

    return (
        <SdkContext.Provider value={sdk}>
            <React.Suspense
                fallback={
                    <div style={suspenseFallbackStyle}>
                        <Loader style={animateSpinnerStyle} />
                    </div>
                }
            >
                <div style={viewport.isSmallerThanMinSize ? wrapperStyle : undefined}>
                    {children}
                </div>
            </React.Suspense>

            {/*
                TODO: if a modal is presented after we show this viewport
                message, it will cover the message. We should fix this by
                having this component manage the modal stack, so it can
                guarantee that this viewport message is in front of all modals.
            */}
            {viewport.isSmallerThanMinSize && <MakeBiggerOrFullscreenMessage viewport={viewport} />}
        </SdkContext.Provider>
    );
}

function MakeBiggerOrFullscreenMessage({viewport}: {viewport: Sdk['viewport']}) {
    return (
        <div style={fullscreenMessageStyle}>
            <span
                style={{
                    textAlign: 'center',
                    lineHeight: 1.5,
                    opacity: 0.75,
                    fontWeight: 500,
                }}
            >
                <span>Please make this extension bigger or </span>
                <span
                    className={BUTTON_LINK_CLASS_NAME}
                    onClick={() => viewport.enterFullscreenIfPossible()}
                >
                    fullscreen
                </span>
            </span>
        </div>
    );
}
