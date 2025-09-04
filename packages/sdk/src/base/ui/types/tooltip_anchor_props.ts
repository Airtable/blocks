import React from 'react';

/** @hidden */
export interface TooltipAnchorProps<T = HTMLElement> {
    /** @hidden */
    onMouseEnter?: (e: React.MouseEvent<T>) => unknown;
    /** @hidden */
    onMouseLeave?: (e: React.MouseEvent<T>) => unknown;
    /** @hidden */
    onClick?: (e: React.MouseEvent<T>) => unknown;
    /** @hidden */
    hasOnClick?: boolean;
}
