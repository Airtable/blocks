/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import Highlight, {defaultProps, PrismTheme} from 'prism-react-renderer';

const theme: PrismTheme = {
    plain: {
        color: '#393A34',
    },
    styles: [
        {
            types: ['comment', 'prolog', 'doctype', 'cdata'],
            style: {
                color: '#999988',
                fontStyle: 'italic',
            },
        },
        {
            types: ['namespace'],
            style: {
                opacity: 0.7,
            },
        },
        {
            types: ['string', 'attr-value'],
            style: {
                color: '#e3116c',
            },
        },
        {
            types: ['punctuation', 'operator'],
            style: {
                color: '#393A34',
            },
        },
        {
            types: [
                'entity',
                'url',
                'symbol',
                'number',
                'boolean',
                'variable',
                'constant',
                'property',
                'regex',
                'inserted',
            ],
            style: {
                color: '#36acaa',
            },
        },
        {
            types: ['atrule', 'keyword', 'attr-name', 'selector'],
            style: {
                color: '#00a4db',
            },
        },
        {
            types: ['function', 'deleted', 'tag'],
            style: {
                color: '#d73a49',
            },
        },
        {
            types: ['function-variable'],
            style: {
                color: '#6f42c1',
            },
        },
        {
            types: ['tag', 'selector', 'keyword'],
            style: {
                color: 'hsl(216, 100%, 33%)',
            },
        },
    ],
};

export default function CodeBlock({code}: {code: string}) {
    const formattedExampleCodeString = code
        .trim()
        .split('\n')
        .filter((line) => !line.startsWith('```'))
        .join('\n');
    return (
        <div>
            <Highlight
                {...defaultProps}
                code={formattedExampleCodeString}
                theme={theme}
                language="jsx"
            >
                {({className, style, tokens, getLineProps, getTokenProps}) => (
                    <pre
                        className={className}
                        style={{
                            ...style,
                            margin: 0,
                            fontFamily: 'Menlo, Courier, monospace',
                            fontSize: 11,
                        }}
                    >
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({line, key: i})}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({token, key})} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}
