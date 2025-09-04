import React from 'react';
import {render} from '@testing-library/react';
import {Input} from '../../../src/base/ui/unstable_standalone_ui';

describe('Input', () => {
    it('renders outside of a blocks context', () => {
        render(<Input value="value" onChange={() => {}} />);
    });

    it('does not render aria-describedby when unspecified', () => {
        const {container} = render(<Input value="0" onChange={() => {}} />);
        const input = container.querySelector('input');

        expect(input?.hasAttribute('aria-describedby')).toEqual(false);
    });

    it('recognizes aria-describedby', () => {
        const {container} = render(<Input value="0" onChange={() => {}} aria-describedby="foo" />);
        const input = container.querySelector('input');

        expect(input?.getAttribute('aria-describedby')).toEqual('foo');
    });
});
