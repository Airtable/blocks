// @flow
import Point from './point';

/** @private */
export default class Rect {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    growBy(amount: number) {
        return new Rect(
            this.x - amount,
            this.y - amount,
            this.width + 2 * amount,
            this.height + 2 * amount,
        );
    }
    top(): number {
        return this.y;
    }
    left(): number {
        return this.x;
    }
    right(): number {
        return this.x + this.width;
    }
    bottom(): number {
        return this.y + this.height;
    }
    centerPoint(): Point {
        return new Point(this.x + this.width / 2, this.y + this.height / 2);
    }
}
