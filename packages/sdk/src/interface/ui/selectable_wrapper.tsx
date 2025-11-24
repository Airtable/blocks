/** @module @airtable/blocks/interface/ui: SelectableWrapper */ /** */
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {useSdk} from '../../shared/ui/sdk_context';
import {type InterfaceSdkMode} from '../../sdk_mode';
import {useRunInfo} from './use_run_info';

/**
 * Context to track the nesting depth of SelectableWrapper components.
 * Used to ensure child overlays render above parent overlays via z-index.
 *
 * @internal
 */
const NestingDepthContext = React.createContext(0);

/** @hidden */
export interface SelectableWrapperProps {
    /** The child component to wrap with selection functionality */
    children: React.ReactNode;
    /**
     * The source code location of this selectable element. Injected by esbuild
     * plugin in hyperbase.
     *
     * @internal
     */
    sourceLocation?: {filePath: string; lineNumber: number; columnNumber?: number};
    /** The name of this selectable element, to be shown in the properties panel */
    name?: string;
}

/**
 * A wrapper component that makes its child selectable with a click overlay.
 * When clicked, the child component is marked as selected. If already selected,
 * the overlay becomes click-through. Selected elements display a blue border.
 *
 * @component
 * @hidden
 */
export function SelectableWrapper({children, sourceLocation, name}: SelectableWrapperProps) {
    const runInfo = useRunInfo();
    if (runInfo.isPageElementInEditMode) {
        return (
            <SelectableWrapperInEditMode sourceLocation={sourceLocation} name={name}>
                {children}
            </SelectableWrapperInEditMode>
        );
    } else {
        return <SelectableWrapperInViewMode name={name}>{children}</SelectableWrapperInViewMode>;
    }
}

/** @internal */
function SelectableWrapperInViewMode({children}: SelectableWrapperProps) {
    return children;
}

/** @internal */
function SelectableWrapperInEditMode({children, sourceLocation, name}: SelectableWrapperProps) {
    const id = useUniqueId();
    const [ref, setRef] = useState<HTMLDivElement | null>(null);
    const sdk = useSdk<InterfaceSdkMode>();

    const nestingDepth = useContext(NestingDepthContext);

    const selectionData = useSelectedSubElementId();
    const isSelected = selectionData.selectedSubElementId === id;

    const handleOverlayClick = async (event: React.MouseEvent | React.KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isSelected) {
            await sdk.setSelectedSubElementAsync({
                subElementId: id,
                sourceLocation,
                name,
            });
        }
    };

    useEffect(() => {
        if (!isSelected) {
            return () => {};
        }

        const globalClickListener = async (event: MouseEvent) => {
            const isClickOutside =
                event.target instanceof Node && ref && !ref.contains(event.target);

            const isClickOnOtherWrapper =
                event.target instanceof HTMLElement &&
                event.target.dataset.selectableWrapperOverlay === 'true';

            if (isClickOutside && !isClickOnOtherWrapper) {
                await sdk.setSelectedSubElementAsync(null);
            }
        };

        const globalClickListenerOptions = {
            capture: true,
        };
        document.addEventListener('click', globalClickListener, globalClickListenerOptions);
        return () => {
            document.removeEventListener('click', globalClickListener, globalClickListenerOptions);
        };
    }, [sdk, isSelected, ref]);

    const isSelectedRef = useRef(isSelected);
    useEffect(() => {
        isSelectedRef.current = isSelected;
    }, [isSelected]);
    useEffect(() => {
        return () => {
            if (isSelectedRef.current) {
                sdk.setSelectedSubElementAsync(null);
            }
        };
    }, [sdk]);

    return (
        <NestingDepthContext.Provider value={nestingDepth + 1}>
            <div ref={setRef} style={{display: 'contents'}}>
                {children}

                {/* Click overlay */}
                <Overlay
                    wrapperDiv={ref}
                    isSelected={isSelected}
                    ariaLabel={`Select ${name || 'element'}`}
                    onClick={handleOverlayClick}
                    nestingDepth={nestingDepth}
                />
            </div>
        </NestingDepthContext.Provider>
    );
}

/**
 * Traverses ancestors once to gather both z-index and scrollable containers.
 * Returns the effective z-index and an array of scrollable ancestor elements.
 *
 * @internal
 */
function getAncestorInfo(element: HTMLElement): {
    effectiveZIndex: number;
    scrollableAncestors: Array<HTMLElement>;
} {
    const scrollableAncestors: Array<HTMLElement> = [];
    let effectiveZIndex = 0;
    let current = element.parentElement;

    while (current && current !== document.body) {
        const style = window.getComputedStyle(current);

        if (effectiveZIndex === 0) {
            const zIndex = parseInt(style.zIndex, 10);
            if (!isNaN(zIndex) && style.position !== 'static') {
                effectiveZIndex = zIndex;
            }
        }

        const isScrollable = [style.overflow, style.overflowX, style.overflowY].some(
            (overflow) => overflow === 'auto' || overflow === 'scroll',
        );
        if (isScrollable) {
            scrollableAncestors.push(current);
        }

        current = current.parentElement;
    }

    return {effectiveZIndex, scrollableAncestors};
}

/** @internal */
function Overlay({
    wrapperDiv,
    isSelected,
    ariaLabel,
    onClick,
    nestingDepth,
}: {
    wrapperDiv: HTMLDivElement | null;
    isSelected: boolean;
    ariaLabel: string;
    onClick: (event: React.MouseEvent | React.KeyboardEvent) => void;
    nestingDepth: number;
}): React.ReactNode {
    const [boundingClientRect, setBoundingClientRect] = useState<{
        left: number;
        top: number;
        right: number;
        bottom: number;
    } | null>(null);

    const {baseZIndex, scrollableAncestors} = useMemo(() => {
        if (!wrapperDiv) {
            return {baseZIndex: 0, scrollableAncestors: []};
        }
        const {effectiveZIndex, scrollableAncestors} = getAncestorInfo(wrapperDiv);
        return {baseZIndex: effectiveZIndex, scrollableAncestors};
    }, [wrapperDiv]);

    useEffect(() => {
        if (!wrapperDiv) {
            return () => {};
        }

        const computeBoundingRect: () => {
            left: number;
            top: number;
            right: number;
            bottom: number;
        } | null = () => {
            if (!wrapperDiv) {
                return null;
            }
            let aggregateBoundingClientRect: {
                left: number;
                top: number;
                right: number;
                bottom: number;
            } | null = null;
            for (const child of wrapperDiv.children) {
                const boundingClientRect = child.getBoundingClientRect();
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (!aggregateBoundingClientRect) {
                    aggregateBoundingClientRect = {
                        left: boundingClientRect.left + scrollLeft,
                        top: boundingClientRect.top + scrollTop,
                        right: boundingClientRect.right + scrollLeft,
                        bottom: boundingClientRect.bottom + scrollTop,
                    };
                    continue;
                }
                if (boundingClientRect.left + scrollLeft < aggregateBoundingClientRect.left) {
                    aggregateBoundingClientRect.left = boundingClientRect.left + scrollLeft;
                }
                if (boundingClientRect.top + scrollTop < aggregateBoundingClientRect.top) {
                    aggregateBoundingClientRect.top = boundingClientRect.top + scrollTop;
                }
                if (boundingClientRect.right + scrollLeft > aggregateBoundingClientRect.right) {
                    aggregateBoundingClientRect.right = boundingClientRect.right + scrollLeft;
                }
                if (boundingClientRect.bottom + scrollTop > aggregateBoundingClientRect.bottom) {
                    aggregateBoundingClientRect.bottom = boundingClientRect.bottom + scrollTop;
                }
            }
            return aggregateBoundingClientRect;
        };

        const rect = computeBoundingRect();
        setBoundingClientRect(rect);

        let resizeTimeoutId: ReturnType<typeof setTimeout> | null = null;
        const debouncedUpdateRect = () => {
            setBoundingClientRect(null);
            if (resizeTimeoutId !== null) {
                clearTimeout(resizeTimeoutId);
            }
            resizeTimeoutId = setTimeout(() => {
                const updatedRect = computeBoundingRect();
                setBoundingClientRect(updatedRect);
                resizeTimeoutId = null;
            }, 16); 
        };

        const resizeObserver = new ResizeObserver(debouncedUpdateRect);

        resizeObserver.observe(wrapperDiv);
        for (const child of wrapperDiv.children) {
            resizeObserver.observe(child);
        }

        const mutationObserver = new MutationObserver(() => {
            const updatedRect = computeBoundingRect();
            setBoundingClientRect(updatedRect);

            resizeObserver.disconnect();
            resizeObserver.observe(wrapperDiv);
            for (const child of wrapperDiv.children) {
                resizeObserver.observe(child);
            }
        });

        mutationObserver.observe(wrapperDiv, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
        });

        window.addEventListener('resize', debouncedUpdateRect);

        scrollableAncestors.forEach((scrollable) => {
            scrollable.addEventListener('scroll', debouncedUpdateRect, {passive: true});
        });

        return () => {
            if (resizeTimeoutId !== null) {
                clearTimeout(resizeTimeoutId);
            }
            mutationObserver.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('resize', debouncedUpdateRect);
            scrollableAncestors.forEach((scrollable) => {
                scrollable.removeEventListener('scroll', debouncedUpdateRect);
            });
        };
    }, [wrapperDiv, scrollableAncestors]);

    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    if (!boundingClientRect) {
        return null;
    }

    return ReactDOM.createPortal(
        <div
            onClick={onClick}
            role="button"
            tabIndex={-1}
            data-selectable-wrapper-overlay="true"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label={ariaLabel}
            style={{
                position: 'absolute',
                left: boundingClientRect.left,
                top: boundingClientRect.top,
                height: boundingClientRect.bottom - boundingClientRect.top,
                width: boundingClientRect.right - boundingClientRect.left,
                backgroundColor: isSelected
                    ? 'transparent'
                    : isHovered
                      ? 'rgba(22, 110, 225, 0.05)'
                      : 'transparent',
                cursor: isSelected ? 'default' : 'pointer',
                pointerEvents: isSelected ? 'none' : 'auto',
                outline: isSelected ? '2px solid #3b82f6' : undefined,
                outlineOffset: isSelected ? '-2px' : undefined,
                zIndex: baseZIndex + 1 + nestingDepth,
            }}
        />,
        document.body,
    );
}

/** @internal */
function useUniqueId(): string {
    return useMemo(() => Math.random().toString(36).substring(2, 15), []);
}

/** @internal */
function useSelectedSubElementId(): {selectedSubElementId: string | null} {
    const sdk = useSdk<InterfaceSdkMode>();
    const [selectedSubElementId, setSelectedSubElementId] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;
        const handleSelectionUpdate = (data: {selectedSubElementId: string | null}) => {
            setSelectedSubElementId(data.selectedSubElementId);
        };


        sdk.fetchAndSubscribeToSelectionDataAsync(handleSelectionUpdate).then((initialData) => {
            if (!isCancelled) {
                setSelectedSubElementId(initialData.selectedSubElementId ?? null);
            }
        });

        return () => {
            isCancelled = true;
            sdk.unsubscribeFromSelectionData();
        };
    }, [sdk]);

    return {selectedSubElementId};
}
