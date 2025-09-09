import React, {useEffect, useState} from 'react';
import prettier from 'prettier/standalone';
import * as prettierPluginBabel from 'prettier/plugins/babel';
import Box from '../../src/base/ui/box';
import CodeBlock from './code_block';
import useResizablePanel from './use_resizable_panel';

interface Props {
    code: string;
    onHeightChange: (height: number) => unknown;
    minHeight: number;
    initialHeight: number;
}

const handlebars = (
    <React.Fragment>
        <Box
            backgroundColor="dark"
            width="32px"
            height="1px"
            opacity="quietest"
            marginBottom="2px"
        />
        <Box backgroundColor="dark" width="32px" height="1px" opacity="quietest" />
    </React.Fragment>
);

export default function ExampleCodePanel({code, onHeightChange, minHeight, initialHeight}: Props) {
    const {height, isExpanded, containerProps, handleProps, overlayNode} = useResizablePanel({
        minHeight,
        initialHeight,
    });

    useEffect(() => {
        onHeightChange(height);
    }, [height]);

    const [formattedCode, setFormattedCode] = useState<string | null>(null);
    useEffect(() => {
        prettier
            .format(code, {
                parser: 'babel',
                plugins: [prettierPluginBabel],
            })
            .then(setFormattedCode);
    }, [code]);

    return (
        <React.Fragment>
            <Box
                {...containerProps}
                display="flex"
                position="absolute"
                bottom={0}
                width="100%"
                flexDirection="column"
                backgroundColor="lightGray1"
                borderTop="thick"
                overflow="hidden"
                zIndex={999}
            >
                <div
                    {...handleProps}
                    style={{...handleProps.style, position: 'absolute', width: '100%'}}
                >
                    <Box
                        height="20px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                    >
                        {handlebars}
                    </Box>
                </div>
                {isExpanded && formattedCode && (
                    <Box overflowY="auto" flex="auto" padding={3} paddingY="20px">
                        <CodeBlock code={formattedCode} />
                    </Box>
                )}
            </Box>
            {overlayNode}
        </React.Fragment>
    );
}
