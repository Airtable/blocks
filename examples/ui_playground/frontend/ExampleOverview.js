// @flow
import * as React from 'react';
import {type Example} from './Example';

type Props = {
    examples: Array<Example>,
    onSelect: (example: Example) => void | Promise<void>,
};

export default function ExampleOverview(props: Props) {
    const {examples, onSelect} = props;

    return (
        <div>
            <div className="border-bottom border-darken2 p2 flex items-center">
                <div className="strong big center flex-auto">Component examples</div>
            </div>
            {examples.map(example => {
                return (
                    <a
                        href=""
                        className="border-bottom border-darken2 p2 block darken1-hover darken1-focus"
                        key={example.name}
                        onClick={e => {
                            e.preventDefault();
                            onSelect(example);
                        }}
                    >
                        {example.name}
                    </a>
                );
            })}
        </div>
    );
}
