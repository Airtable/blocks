// @flow
import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import {ControlSize} from '../src/ui/control_sizes';
import Box from '../src/ui/box';
import Button from '../src/ui/button';
import Input from '../src/ui/input';
import Select from '../src/ui/select';
import SelectButtons from '../src/ui/select_buttons';
import Switch from '../src/ui/switch';

const stories = storiesOf('All controls', module);
const sizes = [ControlSize.small, ControlSize.default, ControlSize.large];
const options = ['Apple', 'Pear', 'Banana'].map(value => ({value, label: value}));

function capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}

stories.add('sizes', () => {
    const [value, setValue] = useState('');
    const [isChecked, setIsChecked] = useState(true);
    const [selectValue, setSelectValue] = useState<string | null>(null);
    return (
        <React.Fragment>
            {sizes.map(size => (
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
                        onChange={e => setValue(e.target.value)}
                        placeholder={`${capitalize(size)} input`}
                    />
                    <Select
                        marginBottom={2}
                        size={size}
                        options={[{value: null, label: `${capitalize(size)} select`}, ...options]}
                        value={selectValue}
                        onChange={newSelectValue =>
                            setSelectValue(newSelectValue ? (newSelectValue as string) : null)
                        }
                    />
                    <SelectButtons
                        marginBottom={2}
                        size={size}
                        options={options}
                        value={selectValue}
                        onChange={newSelectValue =>
                            setSelectValue(newSelectValue ? (newSelectValue as string) : null)
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
});
