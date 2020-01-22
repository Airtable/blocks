import React from 'react';
import {storiesOf} from '@storybook/react';
import {values as objectValues} from '../src/private_utils';
import {iconNames} from '../src/ui/icon_config';
import Icon from '../src/ui/icon';
import Text from '../src/ui/text';
import Box from '../src/ui/box';
import IconExample from './icon_example';

const stories = storiesOf('Icon', module);

stories.add('example', () => <IconExample />);

stories.add('standalone', () => <Icon name="blocks" />);
stories.add('small size will render micro icon', () => <Icon name="blocks" size={12} />);

stories.add('all icons', () => (
    <React.Fragment>
        {objectValues(iconNames).map(iconName => {
            return (
                <Box key={iconName} display="flex">
                    <Box width="240px" display="flex" alignItems="center">
                        <Icon name={iconName} margin={2} />
                        <Text>{iconName}</Text>
                    </Box>
                    <Box width="240px" display="flex" alignItems="center">
                        <Icon size={12} name={iconName} margin={2} />
                        <Text>{iconName}Micro</Text>
                    </Box>
                </Box>
            );
        })}
    </React.Fragment>
));
