/**
 * @internal
 */
export const KeyCodes = Object.freeze({
    BACKSPACE: 8 as const,
    TAB: 9 as const,
    ENTER: 13 as const,
    ALT: 18 as const,
    ESCAPE: 27 as const,
    SPACE: 32 as const,
    PAGE_UP: 33 as const,
    PAGE_DOWN: 34 as const,
    END: 35 as const,
    HOME: 36 as const,
    LEFT: 37 as const,
    UP: 38 as const,
    RIGHT: 39 as const,
    DOWN: 40 as const,
    DELETE: 46 as const,
    A: 65 as const,
    B: 66 as const,
    C: 67 as const,
    D: 68 as const,
    E: 69 as const,
    F: 70 as const,
    G: 71 as const,
    H: 72 as const,
    I: 73 as const,
    J: 74 as const,
    K: 75 as const,
    L: 76 as const,
    M: 77 as const,
    N: 78 as const,
    O: 79 as const,
    P: 80 as const,
    Q: 81 as const,
    R: 82 as const,
    S: 83 as const,
    T: 84 as const,
    U: 85 as const,
    V: 86 as const,
    W: 87 as const,
    X: 88 as const,
    Y: 89 as const,
    Z: 90 as const,
    F2: 113 as const,
    F3: 114 as const,
    COMMA: 188 as const,
    PERIOD: 190 as const,
    FORWARD_SLASH: 191 as const,
    BACKTICK: 192 as const,
    BACK_SLASH: 220 as const,
});

/**
 * @internal
 * OS-aware check for command/ctrl key.
 */
export function isCommandModifierKeyEvent(
    e: KeyboardEvent | React.KeyboardEvent | React.MouseEvent,
): boolean {
    const isMac = window.navigator.platform.toLowerCase().indexOf('mac') !== -1;
    if (isMac) {
        return e.metaKey;
    } else {
        return e.ctrlKey;
    }
}
