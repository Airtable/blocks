import React from 'react';
import {render} from '@testing-library/react';
import {Select} from '../../../src/base/ui/unstable_standalone_ui';

describe('Select', () => {
    it('renders outside of a blocks context', () => {
        render(<Select value={null} options={[{value: null, label: 'None'}]} />);
    });

    it('does not include aria-describedby when unspecified', () => {
        const {container} = render(
            <Select value={null} options={[{value: null, label: 'None'}]} />,
        );
        const select = container.querySelector('select');

        expect(select?.hasAttribute('aria-describedby')).toEqual(false);
    });

    it('recognizes aria-describedby', () => {
        const {container} = render(
            <Select value={null} options={[{value: null, label: 'None'}]} aria-describedby="foo" />,
        );
        const select = container.querySelector('select');

        expect(select?.getAttribute('aria-describedby')).toEqual('foo');
    });
});
