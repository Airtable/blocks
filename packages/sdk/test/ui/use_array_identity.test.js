// @flow
import React from 'react';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import useArrayIdentity from '../../src/ui/use_array_identity';

describe('useArrayIdentity', () => {
    it("returns the same array instance as long as it's passed a shallow-equal array", async () => {
        let inputArray;
        let outputArray;
        const Component = ({array}) => {
            inputArray = array;
            outputArray = useArrayIdentity(array);
            return null;
        };

        const startingArray = [1, 2, 3];
        const wrapper = mount(<Component array={startingArray} />);

        expect(inputArray).toBe(startingArray);
        expect(outputArray).toBe(startingArray);
        const nextArray = [1, 2, 3];
        act(() => {
            wrapper.setProps({array: nextArray});
        });
        expect(inputArray).toBe(nextArray);
        expect(outputArray).toBe(startingArray);
    });

    it('returns the new array if is no-longer shallow-equal', async () => {
        let inputArray;
        let outputArray;
        const Component = ({array}) => {
            inputArray = array;
            outputArray = useArrayIdentity(array);
            return null;
        };

        const startingArray = [1, 2, 3];
        const wrapper = mount(<Component array={startingArray} />);

        expect(inputArray).toBe(startingArray);
        expect(outputArray).toBe(startingArray);
        const nextArray = [3, 2, 1];
        act(() => {
            wrapper.setProps({array: nextArray});
        });
        expect(inputArray).toBe(nextArray);
        expect(outputArray).toBe(nextArray);
    });
});
