// @flow
import React from 'react';
import {mount} from 'enzyme';
import ProgressBar from '../../src/ui/progress_bar';

describe('ProgressBar', () => {
    it('renders a background div, and an inner div', () => {
        const wrapper = mount(<ProgressBar progress={0.12} />);

        const outerDiv = wrapper.find('ProgressBar > div');
        const innerDiv = wrapper.find('ProgressBar > div > div');

        expect(outerDiv).toHaveLength(1);
        expect(innerDiv).toHaveLength(1);

        expect(innerDiv.prop('style').width).toBe('12%');
    });

    it("clamps the inner div's width so as not to overflow", () => {
        for (const value of [-0, -0.1, -1, -Infinity]) {
            const {width} = mount(<ProgressBar progress={value} />)
                .find('ProgressBar > div > div')
                .prop('style');
            expect(width).toBe('0%');
        }

        for (const value of [1, 1.1, 2, Infinity]) {
            const {width} = mount(<ProgressBar progress={value} />)
                .find('ProgressBar > div > div')
                .prop('style');
            expect(width).toBe('100%');
        }
    });
});
