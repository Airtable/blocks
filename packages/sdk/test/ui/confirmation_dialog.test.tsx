import React from 'react';
import {mount} from 'enzyme';
import {ConfirmationDialog} from '../../src/base/ui/unstable_standalone_ui';

describe('ConfirmationDialog', () => {
    it('renders outside of a blocks context', () => {
        const noop = () => {};

        mount(<ConfirmationDialog title="" onCancel={noop} onConfirm={noop} />);
    });
});
