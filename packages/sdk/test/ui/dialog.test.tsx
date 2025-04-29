import React from 'react';
import {mount} from 'enzyme';
import {Dialog} from '../../src/base/ui/unstable_standalone_ui';

describe('Dialog', () => {
    it('renders outside of a blocks context', () => {
        mount(
            <Dialog onClose={() => {}}>
                <div></div>
            </Dialog>,
        );
    });
});
