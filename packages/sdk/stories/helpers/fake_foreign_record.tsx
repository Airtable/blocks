import React from 'react';
import Text from '../../src/ui/text';

export default function FakeForeignRecord({children}: {children: React.ReactNode}) {
    return (
        <Text
            height={22}
            paddingX={1}
            display="inline-flex"
            alignItems="center"
            borderRadius="default"
            style={{backgroundColor: 'rgb(233, 238, 249)'}}
            marginRight={1}
        >
            {children}
        </Text>
    );
}
