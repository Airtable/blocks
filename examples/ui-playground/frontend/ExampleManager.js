// @flow
import React, {useState, useEffect} from 'react';
import ExamplePlayground from './ExamplePlayground';
import ExampleOverview from './ExampleOverview';
import {type Example} from './Example';

type Props = {
    examples: Array<Example>,
};

export default function ExampleManager(props: Props) {
    const {examples} = props;
    const [selectedExampleName, setSelectedExampleName] = useState(
        localStorage.getItem('selectedExampleName'),
    );
    const selectedExample = examples.find(({name}) => name === selectedExampleName);

    useEffect(() => {
        localStorage.setItem('selectedExampleName', selectedExampleName);
    }, [selectedExampleName]);

    if (selectedExample) {
        return (
            <ExamplePlayground
                onBack={() => setSelectedExampleName(null)}
                example={selectedExample}
            />
        );
    }

    return <ExampleOverview examples={examples} onSelect={setSelectedExampleName} />;
}
