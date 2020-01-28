import React from 'react';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babylon';
import Box from '../../src/ui/box';
import CodeBlock from './code_block';
import useResizablePanel from './use_resizable_panel';

const CODE_PANEL_INITIAL_HEIGHT = 140;
const CODE_PANEL_MIN_HEIGHT = 24;

interface Props {
    code: string;
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

export default function ExampleCodePanel({code}: Props) {
    const {isExpanded, containerProps, handleProps, overlayNode} = useResizablePanel({
        minHeight: CODE_PANEL_MIN_HEIGHT,
        initialHeight: CODE_PANEL_INITIAL_HEIGHT,
    });

    const formattedCode = prettier.format(code, {
        parser: 'babel',
        plugins: [parserBabel],
    });

    return (
        <React.Fragment>
            <Box
                {...containerProps}
                display="flex"
                position="relative"
                flexDirection="column"
                backgroundColor="lightGray1"
                borderTop="thick"
                overflow="hidden"
            >
                <div
                    {...handleProps}
                    style={{...handleProps.style, position: 'absolute', width: '100%'}}
                >
                    <Box
                        height={CODE_PANEL_MIN_HEIGHT}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                    >
                        {handlebars}
                    </Box>
                </div>
                {isExpanded && (
                    <Box overflowY="auto" flex="auto" paddingX={3} paddingY={4}>
                        <CodeBlock code={formattedCode} />
                    </Box>
                )}
            </Box>
            {overlayNode}
        </React.Fragment>
    );
}
