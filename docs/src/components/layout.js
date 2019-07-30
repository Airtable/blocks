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

import Header from './header';
import './layout.css';

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
                    title
                }
            }
        }
    `);

    return (
        <>
            <Header siteTitle={data.site.siteMetadata.title} />
            <div
                style={{
                    margin: `0 auto`,
                    maxWidth: 960,
                    padding: `0px 1.0875rem 1.45rem`,
                    paddingTop: 0,
                }}
            >
                <main>
                    <MDXProvider
                        components={{
                            h1: makeAnchoredHeader('h1'),
                            h2: makeAnchoredHeader('h2'),
                            h3: makeAnchoredHeader('h3'),
                            h4: makeAnchoredHeader('h4'),
                        }}
                    >
                        {children}
                    </MDXProvider>
                </main>
            </div>
            <footer
                style={{
                    padding: `1.45rem 0`,
                    borderTop: `1px solid #eee`,
                    textAlign: 'center',
                }}
            >
                © Airtable {new Date().getFullYear()}
            </footer>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
