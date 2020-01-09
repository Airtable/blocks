import ReactDOM from 'react-dom';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import clamp from 'lodash/clamp';
import rafThrottle from './raf_throttle';

type UseResizablePanelReturnType = {
    height: number;
    containerProps: {
        ref: React.Ref<HTMLDivElement>;
        style: React.CSSProperties;
    };
    handleProps: {
        ref: React.Ref<HTMLDivElement>;
        onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => unknown;
        style: React.CSSProperties;
    };
    isExpanded: boolean;
    overlayNode: React.ReactNode;
    toggle: (shouldOpen: boolean) => unknown;
};

/**
 * Clickable elements within the draggable handle should prevent dragging,
 * they can use `data-ignore-drag={true}`.
 */
function _shouldIgnoreDrag(target: EventTarget, parentNode: HTMLElement): boolean {
    let currentTarget: EventTarget | Element | null = target;
    while (currentTarget instanceof Element) {
        if (currentTarget instanceof HTMLElement && currentTarget.dataset.ignoreDrag) {
            return true;
        }
        if (parentNode === currentTarget) {
            return false;
        }
        currentTarget = currentTarget.parentNode;
    }
    return false;
}

/**
 * A hook to create a vertically resizable panel at the bottom of the screen that will not exceed
 * the top of the parent node.
 */
export default function useResizablePanel({
    initialHeight,
    minHeight,
    topOffset,
}: {
    initialHeight: number;
    minHeight: number;
    topOffset?: number;
}): UseResizablePanelReturnType {
    const containerRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isResizing, setIsResizing] = useState(false);
    const [height, setHeight] = useState(initialHeight);
    const [maxHeight, setMaxHeight] = useState(Infinity);
    const [yOffsetWhileDragging, setYOffsetWhileDragging] = useState(0);

    useEffect(() => {
        const _updateMaxHeight = rafThrottle(() => {
            if (containerRef.current && containerRef.current.parentNode instanceof HTMLElement) {
                const parentNodeTop =
                    containerRef.current.parentNode.getBoundingClientRect().top + (topOffset || 0);
                const newMaxHeight = window.innerHeight - parentNodeTop;
                setMaxHeight(newMaxHeight);
                setHeight(_height => clamp(_height, minHeight, newMaxHeight));
            }
        });

        _updateMaxHeight();
        window.addEventListener('resize', _updateMaxHeight, true);

        return () => {
            window.removeEventListener('resize', _updateMaxHeight, true);
        };
    }, [minHeight]);

    const toggle = useCallback(
        (shouldOpen: boolean) => {
            if (shouldOpen === isExpanded) {
                return;
            }
            setIsExpanded(shouldOpen);
        },
        [isExpanded],
    );

    useEffect(() => {
        if (isExpanded && height === minHeight) {
            setHeight(initialHeight);
        }
    }, [isExpanded, height, minHeight, initialHeight]);

    const _onMouseUp = useCallback(() => {
        setIsResizing(false);
        setYOffsetWhileDragging(0);
    }, []);

    const _onMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const newHeight = clamp(
                window.innerHeight - e.clientY + yOffsetWhileDragging,
                minHeight,
                maxHeight,
            );
            const newIsExpanded = newHeight > minHeight + 20;
            setHeight(newIsExpanded ? newHeight : minHeight);
            setIsExpanded(newIsExpanded);
        },
        [yOffsetWhileDragging, minHeight, maxHeight],
    );

    const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!handleRef.current) {
            throw new Error('handleRef.current invariant');
        }
        if (_shouldIgnoreDrag(e.target, handleRef.current)) {
            return;
        }
        setIsResizing(true);
        const _yOffsetWhileDragging = e.clientY - handleRef.current.getBoundingClientRect().top;
        setYOffsetWhileDragging(Math.ceil(_yOffsetWhileDragging));
    }, []);

    const _onMouseLeave = useCallback(() => {
        setIsResizing(false);
    }, []);

    let overlayNode: React.ReactNode;
    if (isResizing) {
        overlayNode = ReactDOM.createPortal(
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    cursor: 'ns-resize',
                }}
                onMouseMove={_onMouseMove}
                onMouseUp={_onMouseUp}
                onMouseLeave={_onMouseLeave}
            />,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            document.body as any,
        );
    } else {
        overlayNode = null;
    }

    const returnedHeight = isExpanded ? height : minHeight;

    return {
        isExpanded,
        toggle,
        height: returnedHeight,
        containerProps: {
            ref: containerRef,
            style: {height: returnedHeight},
        },
        handleProps: {
            ref: handleRef,
            onMouseDown,
            style: {cursor: 'ns-resize'},
        },
        overlayNode,
    };
}
