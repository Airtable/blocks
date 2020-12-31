import React from 'react';
import {initializeBlock} from '@airtable/blocks/ui';

import TodoApp from './todo-app';

initializeBlock(() => <TodoApp />);
