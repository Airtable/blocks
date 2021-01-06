import React from 'react';
import ReactDOM from 'react-dom';
import TestDriver from '@airtable/blocks/unstable_testing';

import recordListFixture from './fixtures/simple_record_list';
import TodoApp from '../frontend/todo-app';

const testDriver = new TestDriver(recordListFixture);

ReactDOM.render(
    <testDriver.Container>
        <TodoApp />
    </testDriver.Container>,
    document.body.appendChild(document.createElement('main')),
);
