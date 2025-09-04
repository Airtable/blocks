import React from 'react';
import {render} from '@testing-library/react';
import {ConfirmationDialog} from '../../../src/base/ui/unstable_standalone_ui';

describe('ConfirmationDialog', () => {
    it('renders outside of a blocks context', () => {
        const noop = () => {};

        render(<ConfirmationDialog title="" onCancel={noop} onConfirm={noop} />);
    });
});
