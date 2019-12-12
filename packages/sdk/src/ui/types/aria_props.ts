/** @module @airtable/blocks/ui/types: Aria props */ /** */
import {AriaAttributes} from 'react';
import PropTypes from 'prop-types';

/** */
export interface AriaProps {
    /** Defines a string value that labels the current element. */
    ['aria-label']?: AriaAttributes['aria-label'];
    /** Identifies the element (or elements) that labels the current object. */
    ['aria-labelledby']?: AriaAttributes['aria-labelledby'];
    /** Identifies the element (or elements) that describes the current object. */
    ['aria-describedby']?: AriaAttributes['aria-describedby'];
    /** Identifies the element (or elements) whose contents or presence are controlled by the current element. */
    ['aria-controls']?: AriaAttributes['aria-controls'];
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    ['aria-expanded']?: AriaAttributes['aria-expanded'];
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    ['aria-haspopup']?: AriaAttributes['aria-haspopup'];
    /** Indicates whether the element is exposed to an accessibility API. */
    ['aria-hidden']?: AriaAttributes['aria-hidden'];
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    ['aria-live']?: AriaAttributes['aria-live'];
}

/** @internal */
export const ariaPropTypes = {
    'aria-label': PropTypes.string,
    'aria-labelledby': PropTypes.string,
    'aria-describedby': PropTypes.string,
    'aria-controls': PropTypes.string,
    'aria-expanded': PropTypes.bool,
    'aria-haspopup': PropTypes.bool,
    'aria-hidden': PropTypes.bool,
    'aria-live': PropTypes.oneOf(['off', 'assertive', 'polite'] as const),
};
