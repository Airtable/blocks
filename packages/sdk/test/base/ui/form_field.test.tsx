import React from 'react';
import {render} from '@testing-library/react';
import {FormField, Select, Input} from '../../../src/base/ui/unstable_standalone_ui';

describe('FormField', () => {
    it('renders outside of a blocks context', () => {
        render(<FormField />);
    });

    describe('<Select> integration', () => {
        const options = [{value: 'demo', label: 'demo'}];

        it('creates and associates a label', () => {
            const {container} = render(
                <FormField label="my label">
                    <Select options={options} value="demo" />
                </FormField>,
            );
            const labels = container.querySelectorAll('label');
            expect(labels.length).toEqual(1);
            const labelTarget = labels[0].getAttribute('for');
            const selects = container.querySelectorAll('select');
            expect(selects.length).toEqual(1);
            expect(selects[0].getAttribute('id')).toEqual(labelTarget);
        });

        it('creates and associates a description using aria-describedby', () => {
            const {container} = render(
                <FormField description="my select description">
                    <Select options={options} value="demo" />
                </FormField>,
            );
            const select = container.querySelector('select');

            expect(select).not.toBeNull();
            const descriptionId = select?.getAttribute('aria-describedby');
            expect(typeof descriptionId).toEqual('string');
            const desc = container.querySelector(`[id="${descriptionId}"]`);
            expect(desc).not.toBeNull();
            expect(desc?.textContent).toEqual('my select description');
        });

        it('creates and extends a description using aria-describedby', () => {
            const {container} = render(
                <FormField description="from FormField">
                    <Select options={options} aria-describedby="another-id" value="demo" />
                    <div id="another-id">from markup</div>
                </FormField>,
            );
            const select = container.querySelector('select');

            expect(select).not.toBeNull();
            const descriptionIds = select?.getAttribute('aria-describedby');

            expect(typeof descriptionIds).toEqual('string');
            const ids = (descriptionIds as string).split(/\s+/);
            expect(ids.length).toEqual(2);
            const descriptions = [
                container.querySelector(`[id="${ids[0]}"]`)?.textContent || '',
                container.querySelector(`[id="${ids[1]}"]`)?.textContent || '',
            ];
            expect(descriptions).toContain('from FormField');
            expect(descriptions).toContain('from markup');
        });
    });

    describe('<Input> integration', () => {
        it('creates and associates a label', () => {
            const {container} = render(
                <FormField label="my label">
                    <Input value="0" onChange={() => {}} />
                </FormField>,
            );
            const labels = container.querySelectorAll('label');
            expect(labels.length).toEqual(1);
            const labelTarget = labels[0].getAttribute('for');
            const inputs = container.querySelectorAll('input');
            expect(inputs.length).toEqual(1);
            expect(inputs[0].getAttribute('id')).toEqual(labelTarget);
        });

        it('creates and associates a description using aria-describedby', () => {
            const {container} = render(
                <FormField description="my input description">
                    <Input value="0" onChange={() => {}} />
                </FormField>,
            );
            const input = container.querySelector('input');

            expect(input).not.toBeNull();
            const descriptionId = input?.getAttribute('aria-describedby');
            expect(typeof descriptionId).toEqual('string');
            const desc = container.querySelector(`[id="${descriptionId}"]`);
            expect(desc).not.toBeNull();
            expect(desc?.textContent).toEqual('my input description');
        });

        it('creates and extends a description using aria-describedby', () => {
            const {container} = render(
                <FormField description="from FormField">
                    <Input value="0" aria-describedby="another-id" onChange={() => {}} />
                    <div id="another-id">from markup</div>
                </FormField>,
            );
            const input = container.querySelector('input');

            expect(input).not.toBeNull();
            const descriptionIds = input?.getAttribute('aria-describedby');
            expect(typeof descriptionIds).toEqual('string');

            const ids = (descriptionIds as string).split(/\s+/);
            expect(ids.length).toEqual(2);
            const descriptions = [
                container.querySelector(`[id="${ids[0]}"]`)?.textContent || '',
                container.querySelector(`[id="${ids[1]}"]`)?.textContent || '',
            ];
            expect(descriptions).toContain('from FormField');
            expect(descriptions).toContain('from markup');
        });
    });
});
