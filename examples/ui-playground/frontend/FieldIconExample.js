// @flow
import React from 'react';
import {FieldIcon, useBase} from '@airtable/blocks/ui';

export default function FieldIconExample(props: void) {
    const base = useBase();
    const field = base.tables[0].fields[0];
    return <FieldIcon field={field} alignSelf="start" />;
}
