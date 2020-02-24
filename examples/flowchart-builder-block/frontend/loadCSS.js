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

    g.node,
    g.edge {
        transition: opacity 0.15s linear;
    }

    g.edge > polygon {
        cursor: no-drop;
    }

    #graph:hover g.node,
    #graph:hover g.edge {
        opacity: 0.5;
    }

    #graph g.node:hover,
    #graph g.edge:hover {
        opacity: 1;
    }
`;

function loadCSS() {
    loadCSSFromString(cssString);
}

export default loadCSS;
