import React from 'react';
import Tooltip from '../src/ui/tooltip';
import Button from '../src/ui/button';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap} from './helpers/code_utils';
import {injectGlobal} from 'emotion';

export default {
    component: Tooltip,
};

injectGlobal`
    @keyframes opacityFadeIn {
        from { opacity: 0.0; }
        to { opacity: 1.0; }
    }
`;

function TextExample() {
    return (
        <Example
            options={{
                placementX: {
                    type: 'select',
                    label: 'Placement X',
                    options: [
                        Tooltip.placements.LEFT,
                        Tooltip.placements.CENTER,
                        Tooltip.placements.RIGHT,
                    ],
                    defaultValue: Tooltip.placements.CENTER,
                },
                placementY: {
                    type: 'select',
                    label: 'Placement Y',
                    options: [
                        Tooltip.placements.TOP,
                        Tooltip.placements.CENTER,
                        Tooltip.placements.BOTTOM,
                    ],
                    defaultValue: Tooltip.placements.BOTTOM,
                },
                shouldHideTooltipOnClick: {
                    type: 'switch',
                    label: 'Should hide tooltip on click',
                },
            }}
            renderCodeFn={({placementX, placementY, ...restOfValues}) => {
                const props = createJsxPropsStringFromValuesMap(restOfValues as any);
                const placementXProp = `placementX={Tooltip.placements.${placementX.toUpperCase()}}`;
                const placementYProp = `placementY={Tooltip.placements.${placementY.toUpperCase()}}`;
                return `
                    import {Tooltip, Button} from '@airtable/blocks/ui';

                    const tooltipExample = (
                        <Tooltip content="Notifications" ${placementXProp} ${placementYProp} ${props}>
                            <Button icon="bell" aria-label="Notifications" />
                        </Tooltip>
                    )
                `;
            }}
        >
            {values => (
                <Tooltip content="Notifications" {...(values as any)}>
                    <Button icon="bell" aria-label="Notifications" />
                </Tooltip>
            )}
        </Example>
    );
}

export const _Example = {
    render: () => <TextExample />,
};
