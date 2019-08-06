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
        {to.startsWith('https://') ? (
            <a href={to} className="quiet link-unquiet">
                {children}
            </a>
        ) : (
            <Link to={to} className="quiet link-unquiet">
                {children}
            </Link>
        )}
    </li>
);

const HeaderLogo = ({titleFirst, titleSecond}) => (
    <div className="logo">
        <Link
            to="/"
            style={{
                color: 'black',
                textDecoration: `none`,
            }}
            className="flex items-center"
        >
            <img
                src={blocksSvg}
                style={{
                    margin: 0,
                    width: '2.5rem',
                }}
            />

            <span className="flex flex-column ml2">
                <span className="display huge h3 strong">{titleFirst}</span>
                <span className="monospace big h5">{titleSecond}</span>
            </span>
        </Link>
    </div>
);

const Header = ({titleFirst, titleSecond}) => (
    <header className="white stroked display px3 col-12">
        <div className="flex items-center mx-auto justify-between max-width-4 pt2 pb2">
            <HeaderLogo titleFirst={titleFirst} titleSecond={titleSecond} />

            <ul
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    margin: 0,
                    padding: 0,
                    listStyleType: 'none',
                }}
                className="big h5"
            >
                <HeaderLink to="/guides">Guides</HeaderLink>
                <HeaderLink to="/api">API</HeaderLink>
                <a
                    href="https://airtable.com"
                    className="rounded-big py1 px2 flex items-center strong link-quiet blue text-white ml2 xs-hide sm-hide"
                >
                    Back to Airtable
                </a>
            </ul>
        </div>
    </header>
);

Header.propTypes = {
    titleFirst: PropTypes.string,
    titleSecond: PropTypes.string,
};

Header.defaultProps = {
    titleFirst: ``,
    titleSecond: ``,
};

export default Header;
