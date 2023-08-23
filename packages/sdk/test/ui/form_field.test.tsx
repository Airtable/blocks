import React from 'react';
import {mount, render} from 'enzyme';
import {FormField, Select, Input} from '../../src/ui/unstable_standalone_ui';

describe('FormField', () => {
    it('renders outside of a blocks context', () => {
        mount(<FormField />);
    });

    describe('<Select> integration', () => {
        const options = [{value: 'demo', label: 'demo'}];

        it('creates and associates a label', () => {
            const $el = render(
                <FormField label="my label">
                    <Select options={options} value="demo" />
                </FormField>,
            );
            expect($el.find('label').length).toEqual(1);
            const labelTarget = $el.find('label').attr('for');
            expect($el.find('select').length).toEqual(1);
            expect($el.find('select').attr('id')).toEqual(labelTarget);
        });

        it('creates and associates a description using aria-describedby', () => {
            const $el = render(
                <FormField description="my select description">
                    <Select options={options} value="demo" />
                </FormField>,
            );
            const $select = $el.find('select');

            expect($select.length).toEqual(1);
            const descriptionId = $select.attr('aria-describedby');
            expect(typeof descriptionId).toEqual('string');
            const $desc = $el.find(`[id="${descriptionId}"]`);
            expect($desc.length).toEqual(1);
            expect($desc.text()).toEqual('my select description');
        });

        it('creates and extends a description using aria-describedby', () => {
            const $el = render(
                <FormField description="from FormField">
                    <Select options={options} aria-describedby="another-id" value="demo" />
                    <div id="another-id">from markup</div>
                </FormField>,
            );
            const $select = $el.find('select');

            expect($select.length).toEqual(1);
            const descriptionIds = $select.attr('aria-describedby');

            expect(typeof descriptionIds).toEqual('string');
            const ids = (descriptionIds as string).split(/\s+/);
            expect(ids.length).toEqual(2);
            const descriptions = [
                $el.find(`[id="${ids[0]}"]`).text(),
                $el.find(`[id="${ids[1]}"]`).text(),
            ];
            expect(descriptions).toContain('from FormField');
            expect(descriptions).toContain('from markup');
        });
    });

    describe('<Input> integration', () => {
        it('creates and associates a label', () => {
            const $el = render(
                <FormField label="my label">
                    <Input value="0" onChange={() => {}} />
                </FormField>,
            );
            expect($el.find('label').length).toEqual(1);
            const labelTarget = $el.find('label').attr('for');
            expect($el.find('input').length).toEqual(1);
            expect($el.find('input').attr('id')).toEqual(labelTarget);
        });

        it('creates and associates a description using aria-describedby', () => {
            const $el = render(
                <FormField description="my input description">
                    <Input value="0" onChange={() => {}} />
                </FormField>,
            );
            const $input = $el.find('input');

            expect($input.length).toEqual(1);
            const descriptionId = $input.attr('aria-describedby');
            expect(typeof descriptionId).toEqual('string');
            const $desc = $el.find(`[id="${descriptionId}"]`);
            expect($desc.length).toEqual(1);
            expect($desc.text()).toEqual('my input description');
        });

        it('creates and extends a description using aria-describedby', () => {
            const $el = render(
                <FormField description="from FormField">
                    <Input value="0" aria-describedby="another-id" onChange={() => {}} />
                    <div id="another-id">from markup</div>
                </FormField>,
            );
            const $input = $el.find('input');

            expect($input.length).toEqual(1);
            const descriptionIds = $input.attr('aria-describedby');
            expect(typeof descriptionIds).toEqual('string');

            const ids = (descriptionIds as string).split(/\s+/);
            expect(ids.length).toEqual(2);
            const descriptions = [
                $el.find(`[id="${ids[0]}"]`).text(),
                $el.find(`[id="${ids[1]}"]`).text(),
            ];
            expect(descriptions).toContain('from FormField');
            expect(descriptions).toContain('from markup');
        });
    });
});
