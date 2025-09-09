import React from 'react';
import {values as objectValues} from '../src/shared/private_utils';
import {iconNames} from '../src/base/ui/icon_config';
import Icon from '../src/base/ui/icon';
import Text from '../src/base/ui/text';
import Box from '../src/base/ui/box';
import IconExample from './icon_example';

export default {
    component: Icon,
};

export const Example = {
    render: () => <IconExample />,
};

export const Standalone = {
    render: () => <Icon name="apps" />,
};

export const SmallSizeWillRenderMicroIcon = {
    render: () => <Icon name="apps" size={12} />,
};

export const AllIcons = {
    render: () => (
        <React.Fragment>
            {objectValues(iconNames).map((iconName) => {
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
    ),
};
