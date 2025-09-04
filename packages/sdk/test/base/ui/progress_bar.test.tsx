import React from 'react';
import {render} from '@testing-library/react';
import ProgressBar from '../../../src/base/ui/progress_bar';
import {getComputedStylePropValue} from '../../test_helpers';

describe('ProgressBar', () => {
    it('renders a background div, and an inner div', () => {
        const {container} = render(<ProgressBar progress={0.12} />);

        const outerDiv = container.querySelector('div[role="progressbar"]');
        const innerDiv = outerDiv!.querySelector('div');

        expect(outerDiv).toBeInTheDocument();
        expect(innerDiv).toBeInTheDocument();

        const width = getComputedStylePropValue(innerDiv!, 'width');
        expect(width).toBe('12%');
    });

    it("clamps the inner div's width so as not to overflow", () => {
        for (const value of [-0, -0.1, -1, -Infinity]) {
            const {container} = render(<ProgressBar progress={value} />);
            const innerDiv = container.querySelector('div[role="progressbar"] div');
            const width = getComputedStylePropValue(innerDiv!, 'width');
            expect(width).toBe('0%');
        }

        for (const value of [1, 1.1, 2, Infinity]) {
            const {container} = render(<ProgressBar progress={value} />);
            const innerDiv = container.querySelector('div[role="progressbar"] div');
            const width = getComputedStylePropValue(innerDiv!, 'width');
            expect(width).toBe('100%');
        }
    });
});
