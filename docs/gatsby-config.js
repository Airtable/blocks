const path = require('path');

module.exports = {
    siteMetadata: {
        titleFirst: 'Airtable Blocks',
        titleSecond: 'Developer Docs',
        description: `Guides, examples and API reference materials to help you develop Airtable blocks`,
        author: `Airtable`,
    },
    pathPrefix: '/blocks',
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: `gatsby-plugin-mdx`,
            options: {
                gatsbyRemarkPlugins: [`gatsby-remark-prismjs`],
                defaultLayouts: {
                    default: require.resolve('./src/components/layout.js'),
                },
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `source`,
                path: path.join(__dirname, '..', 'packages', 'sdk', 'src'),
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/blocks.png`, // This path is relative to the root of the site.
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
    ],
};
