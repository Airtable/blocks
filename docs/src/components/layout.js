/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import {useStaticQuery, graphql} from 'gatsby';
import {MDXProvider} from '@mdx-js/react';
import omit from 'lodash/omit';
import * as slug from 'slug';
import isString from 'lodash/isString';

import SEO from './seo';
import Header from './header';
import LinkFromMarkdown from './link_from_markdown';

import './type.css';
import './helpers.css';
import './custom.css';

function makeAnchoredHeader(type) {
    return function AnchoredHeader(props) {
        const children = Array.isArray(props.children) ? props.children : [props.children];
        const anchorName = slug(children.filter(isString).join('-'), {lower: true});

        return React.createElement(
            type,
            omit(props, ['children']),
            <a name={anchorName} />,
            ...children,
        );
    };
}

const Layout = ({children}) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    titleFirst
                    titleSecond
                }
            }
        }
    `);

    const {titleFirst, titleSecond} = data.site.siteMetadata;

    return (
        <>
            {/* todo(kyleribant): pipe in specific page titles */}
            <SEO title={`${titleFirst} ${titleSecond}`} />

            <Header titleFirst={titleFirst} titleSecond={titleSecond} />

            <main className="col-12 sm-col-10 lg-col-6 mx-auto xs-px3 display main">
                <MDXProvider
                    components={{
                        h1: makeAnchoredHeader('h1'),
                        h2: makeAnchoredHeader('h2'),
                        h3: makeAnchoredHeader('h3'),
                        h4: makeAnchoredHeader('h4'),
                        a: LinkFromMarkdown,
                    }}
                >
                    {children}
                </MDXProvider>
            </main>

            <footer className="footer white stroked col-12">
                <div className="mx-auto max-width-4 pb2 pt2 col-12 flex px3 big display h5 flex justify-between items-center">
                    <div>
                        <p className="mb-half">Need help or have feedback?</p>

                        <a href="mailto:blocks@airtable.com" className="text-blue">
                            blocks@airtable.com
                        </a>
                    </div>

                    <p className="mb0">© Airtable {new Date().getFullYear()}</p>
                </div>
            </footer>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
