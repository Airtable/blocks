import React from 'react';
import {render} from '@testing-library/react';
import {Modal} from '../../../src/base/ui/unstable_standalone_ui';

describe('Modal', () => {
    it('renders outside of a blocks context', () => {
        render(
            <Modal>
                <div></div>
            </Modal>,
        );
    });
});
