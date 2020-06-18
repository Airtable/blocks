import React from 'react';
import {Box, Link} from '@airtable/blocks/ui';

const BannerBarMenuItems = [
    {text: 'Documentation', href: 'https://vega.github.io/vega-lite/docs/'},
    {text: 'Examples', href: 'https://vega.github.io/vega-lite/examples/'},
    {text: 'Community', href: 'https://community.airtable.com/'},
];

function BannerBar() {
    return (
        <Box flex="none" display="flex" alignItems="center">
            {BannerBarMenuItems.map(({text, href}, index) => (
                <Link
                    key={`banner-bar-link-${index}`}
                    href={href}
                    target="_blank"
                    marginLeft={2}
                    marginRight={1}
                    fontWeight="strong"
                    variant="light"
                >
                    {text}
                </Link>
            ))}
        </Box>
    );
}

export default React.memo(BannerBar);
