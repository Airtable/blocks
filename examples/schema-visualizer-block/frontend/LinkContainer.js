import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {FieldType} from '@airtable/blocks/models';

import {HighlightContext} from './HighlightWrapper';
import {LINK_PROP_TYPE} from './constants';

/**
 * Container group for the link path elements. Handles node mouseover/mouseout (event delegation
 * done in the HighlightWrapper).
 *
 * Note: `props.linkPathsByLinkId` is only used for the initial render, and whenever the base
 * schema changes. Aside from that, it is never changed via React, so the value here is actually
 * stale. This is because we updated the path `d` values during mousemove, and never push this
 * state from the DOM back into React world upon finishing dragging. This could be done by
 * extracting the `d` attribute from all links on drag finish, but it works fine as is.
 *
 * @param {Object} props.linksById all link objects, by id
 * @param {Object} props.linkPathsByLinkId all link paths, by id
 * @param {Object} props.enabledLinksByType whether each link type is enabled, by link type
 */
export default function LinkContainer({linksById, linkPathsByLinkId, enabledLinksByType}) {
    const {onNodeOrLinkMouseOver, onNodeOrLinkMouseOut} = useContext(HighlightContext);

    return (
        <g
            id="link-container"
            onMouseMove={onNodeOrLinkMouseOver}
            onMouseOut={onNodeOrLinkMouseOut}
        >
            {Object.values(linksById).map(link => {
                const isEnabled = enabledLinksByType[link.type];

                return (
                    <path
                        display={isEnabled ? undefined : 'none'}
                        key={link.id}
                        id={link.id}
                        className={`Link ${link.type}`}
                        d={linkPathsByLinkId[link.id]}
                    />
                );
            })}
        </g>
    );
}

LinkContainer.propTypes = {
    linksById: PropTypes.objectOf(LINK_PROP_TYPE),
    linkPathsByLinkId: PropTypes.objectOf(PropTypes.string),
    enabledLinksByType: PropTypes.shape({
        [FieldType.MULTIPLE_RECORD_LINKS]: PropTypes.boolean,
        [FieldType.FORMULA]: PropTypes.boolean,
        [FieldType.COUNT]: PropTypes.boolean,
        [FieldType.ROLLUP]: PropTypes.boolean,
        [FieldType.MULTIPLE_LOOKUP_VALUES]: PropTypes.boolean,
    }),
};
