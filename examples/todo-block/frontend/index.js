import React from 'react';
import {initializeBlock} from '@airtable/blocks/base/ui';

import TodoApp from './todo-app';

initializeBlock(() => <TodoApp />);
