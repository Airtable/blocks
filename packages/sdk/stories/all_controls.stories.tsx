// @flow
import React, {useState} from 'react';
import {ControlSize} from '../src/base/ui/control_sizes';
import Box from '../src/base/ui/box';
import Button from '../src/base/ui/button';
import Input from '../src/base/ui/input';
import Select from '../src/base/ui/select';
import SelectButtons from '../src/base/ui/select_buttons';
import Switch from '../src/base/ui/switch';
import {SelectOptionValue} from '../src/base/ui/select_and_select_buttons_helpers';

export default {
    title: 'All controls',
    component: Box,
};

const sizes = [ControlSize.small, ControlSize.default, ControlSize.large];
const options = ['Apple', 'Pear', 'Banana'].map((value) => ({value, label: value}));

function capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}

export const Sizes = {
    render: () => {
        const [value, setValue] = useState('');
        const [isChecked, setIsChecked] = useState(true);
        const [selectValue, setSelectValue] = useState<SelectOptionValue | null>(null);
        return (
            <React.Fragment>
                {sizes.map((size) => (
                    <Box
                        key={size}
                        display="flex"
                        flexDirection="column"
                        width="300px"
                        marginBottom={5}
                    >
                        <Input
                            marginBottom={2}
                            size={size}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={`${capitalize(size)} input`}
                        />
                        <Select
                            marginBottom={2}
                            size={size}
                            options={[
                                {value: null, label: `${capitalize(size)} select`},
                                ...options,
                            ]}
                            value={selectValue}
                            onChange={(newSelectValue) =>
                                setSelectValue(newSelectValue ? newSelectValue : null)
                            }
                        />
                        <SelectButtons
                            marginBottom={2}
                            size={size}
                            options={options}
                            value={selectValue}
                            onChange={(newSelectValue) =>
                                setSelectValue(newSelectValue ? newSelectValue : null)
                            }
                        />
                        <Switch
                            marginBottom={2}
                            size={size}
                            value={isChecked}
                            onChange={setIsChecked}
                            label={`${capitalize(size)} switch`}
                        />
                        <Button variant="primary" size={size}>
                            {capitalize(size)} button
                        </Button>
                    </Box>
                ))}
            </React.Fragment>
        );
    },
};
