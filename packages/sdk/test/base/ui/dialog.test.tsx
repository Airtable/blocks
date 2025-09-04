import React from 'react';
import {render} from '@testing-library/react';
import {Dialog} from '../../../src/base/ui/unstable_standalone_ui';

describe('Dialog', () => {
    it('renders outside of a blocks context', () => {
        render(
            <Dialog onClose={() => {}}>
                <div></div>
            </Dialog>,
        );
    });
});
