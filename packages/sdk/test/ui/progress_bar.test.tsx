import React from 'react';
import {mount} from 'enzyme';
import ProgressBar from '../../src/base/ui/progress_bar';
import {getComputedStylePropValue} from '../test_helpers';

describe('ProgressBar', () => {
    it('renders a background div, and an inner div', () => {
        const wrapper = mount(<ProgressBar progress={0.12} />);

        const outerDiv = wrapper.find('ProgressBar div').first();
        const innerDiv = wrapper.find('ProgressBar div div').first();

        expect(outerDiv).toHaveLength(1);
        expect(innerDiv).toHaveLength(1);

        const width = getComputedStylePropValue(innerDiv, 'width');
        expect(width).toBe('12%');
    });

    it("clamps the inner div's width so as not to overflow", () => {
        for (const value of [-0, -0.1, -1, -Infinity]) {
            const innerDiv = mount(<ProgressBar progress={value} />)
                .find('ProgressBar div div')
                .first();
            const width = getComputedStylePropValue(innerDiv, 'width');
            expect(width).toBe('0%');
        }

        for (const value of [1, 1.1, 2, Infinity]) {
            const innerDiv = mount(<ProgressBar progress={value} />)
                .find('ProgressBar div div')
                .first();
            const width = getComputedStylePropValue(innerDiv, 'width');
            expect(width).toBe('100%');
        }
    });
});
