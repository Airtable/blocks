// @flow
import PropTypes from 'prop-types';

export type AriaProps = {|
    'aria-label'?: string,
    'aria-labelledby'?: string,
    'aria-describedby'?: string,
    'aria-controls'?: string,
    'aria-expanded'?: boolean,
    'aria-haspopup'?: boolean,
    'aria-hidden'?: boolean,
    'aria-live'?: boolean,
|};

export const ariaPropTypes = {
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    'aria-controls': PropTypes.string,
    'aria-expanded': PropTypes.bool,
    'aria-haspopup': PropTypes.bool,
    'aria-hidden': PropTypes.bool,
    'aria-live': PropTypes.bool,
};
