import React from 'react';
import {render} from '@testing-library/react';
import {Tooltip, Text} from '../../../src/base/ui/unstable_standalone_ui';

describe('Tooltip', () => {
    it('renders outside of a blocks context', () => {
        render(
            <Tooltip content="tooltip content">
                <Text>wrapped content</Text>
            </Tooltip>,
        );
    });
});
