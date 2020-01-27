import React, {useState} from 'react';
import Text from '../../src/ui/text';
import TextButton from '../../src/ui/text_button';
import Box from '../../src/ui/box';
import Heading from '../../src/ui/heading';

interface StylePropListProps {
    stylePropsByCategory: {[category: string]: Array<string>};
}

export default function StylePropList({stylePropsByCategory}: StylePropListProps) {
    const [areStylePropsExpanded, setAreStylePropsExpanded] = useState(false);

    return (
        <Box marginTop={3}>
            <Box
                id="style-props"
                aria-hidden={!areStylePropsExpanded}
                display={areStylePropsExpanded ? undefined : 'none'}
            >
                {Object.keys(stylePropsByCategory).map(category => {
                    return (
                        <StylePropCategory
                            key={category}
                            category={category}
                            styleProps={stylePropsByCategory[category]}
                        />
                    );
                })}
            </Box>
            <TextButton
                icon={areStylePropsExpanded ? 'chevronUp' : 'chevronDown'}
                onClick={() => setAreStylePropsExpanded(!areStylePropsExpanded)}
                aria-controls="style-props"
                aria-expanded={areStylePropsExpanded}
            >
                {areStylePropsExpanded ? 'Hide' : 'Show'} style props
            </TextButton>
        </Box>
    );
}

interface StylePropCategoryProps {
    category: string;
    styleProps: Array<string>;
}

function StylePropCategory({category, styleProps}: StylePropCategoryProps) {
    return (
        <Box marginY={3}>
            <Heading
                textColor="light"
                opacity="quieter"
                size="xsmall"
                variant="caps"
                marginBottom="2px"
            >
                {category}
            </Heading>
            {styleProps.map(stylePropName => (
                <Text
                    key={stylePropName}
                    size="small"
                    fontFamily="monospace"
                    textColor="light"
                    lineHeight="16px"
                >
                    {stylePropName}
                </Text>
            ))}
        </Box>
    );
}
