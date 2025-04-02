import React from 'react';
import {mount} from 'enzyme';
import {Popover} from '../../src/base/ui/unstable_standalone_ui';

describe('Popover', () => {
    it('renders outside of a blocks context', () => {
        mount(
            <Popover renderContent={() => <div></div>}>
                <div></div>
            </Popover>,
        );
    });
});
