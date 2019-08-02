// @flow
import React, {useState} from 'react';
import ExamplePlayground from './ExamplePlayground';
import ExampleOverview from './ExampleOverview';
import {type Example} from './Example';

type Props = {
    examples: Array<Example>,
};

export default function ExampleManager(props: Props) {
    const [selectedExample, setSelectedExample] = useState(null);
    const {examples} = props;

    if (selectedExample) {
        return (
            <ExamplePlayground onBack={() => setSelectedExample(null)} example={selectedExample} />
        );
    }

    return <ExampleOverview examples={examples} onSelect={setSelectedExample} />;
}
