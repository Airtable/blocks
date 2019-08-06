import React from 'react';
import {mount} from 'enzyme';

import LinkFromMarkdown from '../src/components/link_from_markdown';

describe('LinkFromMarkdown', () => {
    it('renders mailto:', () => {
        const wrapper = mount(
            <LinkFromMarkdown href="mailto:mary@airtable.com">email</LinkFromMarkdown>,
        );

        const aTag = wrapper.find('a');

        expect(aTag.name()).toEqual('a');
        expect(aTag.prop('href')).toEqual('mailto:mary@airtable.com');
        expect(aTag.prop('children')).toEqual('email');
    });

    describe('for an external link', () => {
        it('renders an http url', () => {
            const wrapper = mount(
                <LinkFromMarkdown href="http://example.com">example</LinkFromMarkdown>,
            );

            const aTag = wrapper.find('a');

            expect(aTag.name()).toEqual('a');
            expect(aTag.prop('href')).toEqual('http://example.com');
            expect(aTag.prop('children')).toEqual('example');
        });

        it('renders an https url', () => {
            const wrapper = mount(
                <LinkFromMarkdown href="https://example.com">example</LinkFromMarkdown>,
            );

            const aTag = wrapper.find('a');

            expect(aTag.name()).toEqual('a');
            expect(aTag.prop('href')).toEqual('https://example.com');
            expect(aTag.prop('children')).toEqual('example');
        });

        it('renders an ftp url', () => {
            const wrapper = mount(
                <LinkFromMarkdown href="ftp://example.com">example</LinkFromMarkdown>,
            );

            const aTag = wrapper.find('a');

            expect(aTag.name()).toEqual('a');
            expect(aTag.prop('href')).toEqual('ftp://example.com');
            expect(aTag.prop('children')).toEqual('example');
        });
    });

    it('renders anchor link', () => {
        const wrapper = mount(<LinkFromMarkdown href="#section">section</LinkFromMarkdown>);
        const aTag = wrapper.find('a');

        expect(aTag.name()).toEqual('a');
        expect(aTag.prop('href')).toEqual('#section');
        expect(aTag.prop('children')).toEqual('section');
    });

    describe('for internal link', () => {
        it('renders an `a` tag with passed contents', () => {
            // Markdown renderer will have added prefix - `/blocks` - already
            const wrapper = mount(
                <LinkFromMarkdown href="/blocks/guides">guides</LinkFromMarkdown>,
            );

            const aTag = wrapper.find('a');

            expect(aTag.name()).toEqual('a');
            expect(aTag.prop('children')).toEqual('guides');
        });

        describe('on a site without a prefix', () => {
            let pathPrefix;

            beforeEach(() => {
                pathPrefix = global.__PATH_PREFIX__;
                global.__PATH_PREFIX__ = '';
            });

            it('renders url unchanged', () => {
                const wrapper = mount(<LinkFromMarkdown href="/guides">guides</LinkFromMarkdown>);

                const aTag = wrapper.find('a');

                expect(aTag.prop('href')).toEqual('/guides');
            });

            afterEach(() => {
                global.__PATH_PREFIX__ = pathPrefix;
            });
        });

        describe('on a site with a prefix', () => {
            let pathPrefix;

            beforeEach(() => {
                pathPrefix = global.__PATH_PREFIX__;
                global.__PATH_PREFIX__ = '/blocks';
            });

            it('renders url with only one prefix', () => {
                // Markdown renderer will have added prefix - `/blocks` - already
                const wrapper = mount(
                    <LinkFromMarkdown href="/blocks/guides">guides</LinkFromMarkdown>,
                );

                const aTag = wrapper.find('a');

                // Link would erroneously also add the prefix to the URL. Check
                // there is only one prefix in final URL.
                expect(aTag.prop('href')).toEqual('/blocks/guides');
            });

            beforeEach(() => {
                global.__PATH_PREFIX__ = pathPrefix;
            });
        });
    });
});
