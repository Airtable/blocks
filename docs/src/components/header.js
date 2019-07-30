import {Link} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import blocksSvg from '../images/blocks.svg';

const HeaderLink = ({to, children}) => (
    <li
        style={{
            margin: 0,
            marginLeft: '1rem',
            padding: 0,
        }}
    >
        {to.startsWith('https://') ? <a href={to}>{children}</a> : <Link to={to}>{children}</Link>}
    </li>
);

const Header = ({siteTitle}) => (
    <header
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'stretch',
            marginBottom: `1.45rem`,
            borderBottom: `1px solid #eee`,
        }}
    >
        <h1
            style={{
                display: 'flex',
                flex: '1',
                height: '100%',
                alignItems: 'center',
                margin: 0,
            }}
        >
            {/* TODO(evanhahn): this img should be clickable as part of the link */}
            <img
                src={blocksSvg}
                style={{
                    margin: 0,
                    padding: '1rem',
                    width: '2em',
                }}
                alt=""
            />
            <Link
                to="/"
                style={{
                    color: 'black',
                    textDecoration: `none`,
                }}
            >
                {siteTitle}
            </Link>
        </h1>
        <div
            style={{
                paddingRight: '1rem',
            }}
        >
            <ul
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    margin: 0,
                    padding: 0,
                    listStyleType: 'none',
                }}
            >
                <HeaderLink to="/guides">Guides</HeaderLink>
                <HeaderLink to="/#examples">Examples</HeaderLink>
                <HeaderLink to="/api">API reference</HeaderLink>
                <HeaderLink to="https://airtable.com">Back to Airtable</HeaderLink>
            </ul>
        </div>
    </header>
);

Header.propTypes = {
    siteTitle: PropTypes.string,
};

Header.defaultProps = {
    siteTitle: ``,
};

export default Header;
