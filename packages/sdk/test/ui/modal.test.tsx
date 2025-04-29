import React from 'react';
import {mount} from 'enzyme';
import {Modal} from '../../src/base/ui/unstable_standalone_ui';

describe('Modal', () => {
    it('renders outside of a blocks context', () => {
        mount(
            <Modal>
                <div></div>
            </Modal>,
        );
    });
});
