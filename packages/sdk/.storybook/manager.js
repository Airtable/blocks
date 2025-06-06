import {addons} from '@storybook/manager-api';
import {camelCase, upperFirst} from 'lodash';

addons.setConfig({
    sidebar: {
        showRoots: false,
        renderLabel: ({name, type}) => (type === 'story' ? name : upperFirst(camelCase(name))),
    },
});
