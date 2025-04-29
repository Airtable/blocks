import Point from './point';

/** @internal */
export default class Rect {
    /** @internal */
    x: number;
    /** @internal */
    y: number;
    /** @internal */
    width: number;
    /** @internal */
    height: number;

    /** @internal */
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    /** @internal */
    growBy(amount: number) {
        return new Rect(
            this.x - amount,
            this.y - amount,
            this.width + 2 * amount,
            this.height + 2 * amount,
        );
    }
    /** @internal */
    top(): number {
        return this.y;
    }
    /** @internal */
    left(): number {
        return this.x;
    }
    /** @internal */
    right(): number {
        return this.x + this.width;
    }
    /** @internal */
    bottom(): number {
        return this.y + this.height;
    }
    /** @internal */
    centerPoint(): Point {
        return new Point(this.x + this.width / 2, this.y + this.height / 2);
    }
}
