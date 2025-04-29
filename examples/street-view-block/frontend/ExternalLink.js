import React from 'react';
import {Link} from '@airtable/blocks/base/ui';

const ExternalLink = ({children, href, size = 'default'}) => {
    const aProps = {
        href,
        size,
        rel: 'noopener noreferrer',
        target: '_blank',
    };
    return <Link {...aProps}>{children}</Link>;
};

export default React.forwardRef(ExternalLink);
