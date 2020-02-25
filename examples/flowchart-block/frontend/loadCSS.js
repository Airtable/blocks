import {loadCSSFromString} from '@airtable/blocks/ui';

const cssString = `
    span.prompt {
        padding: 2rem;
        margin: 0;
        font-size: 17px;
        font-weight: 500;
        color: hsl(0, 0%, 46%);
        line-height: 1.5;
        text-align: center;
    }

    g.node {
        cursor: pointer;
        user-select: none;
    }
`;

function loadCSS() {
    loadCSSFromString(cssString);
}

export default loadCSS;
