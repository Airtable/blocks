import React from 'react';
import {render} from '@testing-library/react';
import useArrayIdentity from '../../../src/shared/ui/use_array_identity';

describe('useArrayIdentity', () => {
    it("returns the same array instance as long as it's passed a shallow-equal array", async () => {
        let inputArray: any;
        let outputArray: any;
        const Component = ({array}: {array: Array<unknown>}) => {
            inputArray = array;
            outputArray = useArrayIdentity(array);
            return null;
        };

        const startingArray = [1, 2, 3];
        const {rerender} = render(<Component array={startingArray} />);

        expect(inputArray).toBe(startingArray);
        expect(outputArray).toBe(startingArray);
        const nextArray = [1, 2, 3];
        rerender(<Component array={nextArray} />);
        expect(inputArray).toBe(nextArray);
        expect(outputArray).toBe(startingArray);
    });

    it('returns the new array if is no-longer shallow-equal', async () => {
        let inputArray: any;
        let outputArray: any;
        const Component = ({array}: {array: Array<unknown>}) => {
            inputArray = array;
            outputArray = useArrayIdentity(array);
            return null;
        };

        const startingArray = [1, 2, 3];
        const {rerender} = render(<Component array={startingArray} />);

        expect(inputArray).toBe(startingArray);
        expect(outputArray).toBe(startingArray);
        const nextArray = [3, 2, 1];
        rerender(<Component array={nextArray} />);
        expect(inputArray).toBe(nextArray);
        expect(outputArray).toBe(nextArray);
    });
});
