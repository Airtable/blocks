// @flow
import Rect from './rect';
import Size from './size';
import Point from './point';

/**
 * Everything in Geometry is lifted from Hyperbase.
 * Once we refactor/deprecate Popover we can deprecate this as well.
 * @private
 */
const Geometry = {
    Rect,
    Size,
    Point,
};

export default Geometry;
