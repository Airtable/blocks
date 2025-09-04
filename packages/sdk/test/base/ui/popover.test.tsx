import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {Popover} from '../../../src/base/ui/unstable_standalone_ui';

describe('Popover', () => {
    it('renders outside of a blocks context', async () => {
        render(
            <Popover renderContent={() => <div>Popover content</div>}>
                <div>Anchor content</div>
            </Popover>,
        );

        expect(screen.getByText('Anchor content')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Popover content')).toBeInTheDocument();
        });
    });
});
