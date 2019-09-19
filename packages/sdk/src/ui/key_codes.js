// @flow
/**
 * @private
 */
export const KeyCodes = Object.freeze({
    BACKSPACE: (8: 8),
    TAB: (9: 9),
    ENTER: (13: 13),
    ALT: (18: 18),
    ESCAPE: (27: 27),
    SPACE: (32: 32),
    PAGE_UP: (33: 33),
    PAGE_DOWN: (34: 34),
    END: (35: 35),
    HOME: (36: 36),
    LEFT: (37: 37),
    UP: (38: 38),
    RIGHT: (39: 39),
    DOWN: (40: 40),
    DELETE: (46: 46),
    A: (65: 65),
    B: (66: 66),
    C: (67: 67),
    D: (68: 68),
    E: (69: 69),
    F: (70: 70),
    G: (71: 71),
    H: (72: 72),
    I: (73: 73),
    J: (74: 74),
    K: (75: 75),
    L: (76: 76),
    M: (77: 77),
    N: (78: 78),
    O: (79: 79),
    P: (80: 80),
    Q: (81: 81),
    R: (82: 82),
    S: (83: 83),
    T: (84: 84),
    U: (85: 85),
    V: (86: 86),
    W: (87: 87),
    X: (88: 88),
    Y: (89: 89),
    Z: (90: 90),
    F2: (113: 113),
    F3: (114: 114),
    COMMA: (188: 188),
    PERIOD: (190: 190),
    FORWARD_SLASH: (191: 191),
    BACKTICK: (192: 192),
    BACK_SLASH: (220: 220),
});

/**
 * @private
 * OS-aware check for command/ctrl key.
 */
export function isCommandModifierKeyEvent(e: KeyboardEvent | SyntheticMouseEvent<>): boolean {
    const isMac = window.navigator.platform.toLowerCase().indexOf('mac') !== -1;
    if (isMac) {
        return e.metaKey;
    } else {
        return e.ctrlKey;
    }
}
