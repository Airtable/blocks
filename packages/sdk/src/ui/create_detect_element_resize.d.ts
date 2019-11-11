/** @hidden */
interface DetectElementResize {
    addResizeListener(element: HTMLElement, callback: () => void): void;
    removeResizeListener(element: HTMLElement, callback: () => void): void;
}

/** @hidden */
export default function createDetectElementResize(): DetectElementResize;
