interface DetectElementResize {
    addResizeListener(element: HTMLElement, callback: () => void): void;
    removeResizeListener(element: HTMLElement, callback: () => void): void;
}

export default function createDetectElementResize(): DetectElementResize;
