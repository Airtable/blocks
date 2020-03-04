import {loadCSSFromString} from '@airtable/blocks/ui';

/**
 * A string that contains all of the CSS used in this block.
 */
const cssString = `
    @keyframes scaleUpAndDown {
        from {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }   
    }

    .GameEmoji {
        font-size: 32px;
        margin-bottom: 12;
        animation: scaleUpAndDown 3s ease infinite;
        animation-fill-mode: forwards;
    }

    .PictureGrid {
        width: 100%;
        height: 100%;
        flex: auto;
        display: flex;
        flex-wrap: wrap;
        margin: 24px auto 0;
        max-width: 512px;
    }

    .PictureGrid-2-options {
        padding-bottom: 20vh;
        align-items: center;
    }

    .PictureGrid-2-options .Picture {
        width: calc(50% - 16px);
        height: calc(100% - 16px);
    }

    .PictureGrid-4-options {
        padding-bottom: 8vh;
    }

    .PictureGrid-4-options .Picture {
        width: calc(50% - 16px);
        height: calc(50% - 16px);
    }

    .Picture {
        margin: 8px;
        max-height: 240px;
        transition: all 0.12s;
        overflow: hidden;
        cursor: pointer;
        background-size: cover;
        background-position: center;
        border-radius: 3px;
    }

    .Picture:hover {
        z-index: 1;
        transform: scale(1.02);
    }

    .Picture:active {
        transform: scale(0.99);
    }

    .Picture-isRoundComplete {
        pointer-events: none;
    }

    .Picture-winner {
        transform: scale(1.03);
        z-index: 1;
    }

    .Picture-pickedSucessfully {
        box-shadow: 0 4px 24px -4px green;
    }

    .Picture-pickedUnsuccessfully {
        box-shadow: 0 4px 24px -4px red;
    }

    .Picture-loser {
        opacity: 0.6;
    }

    .GameRoundEmoji {
        display: inline-block;
        font-size: 32px;
        position: relative;
        transition: all 0.16s;
        transform: scale(1) rotate(0);
    }

    .GameRoundEmoji-isRoundComplete {
        transform: scale(1.5) rotate(360deg);
    }

    .ProgressBar {
        border-radius: 4px;
        margin-top: 16px;
        margin-bottom: 16px;
        height: 4px;
        width: 100%;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        background-color: rgba(0, 0, 0, 0.2);
        overflow: hidden;
    }

    @keyframes progressFill {
        from {
            width: 100%;
        }
        to {
            width: 0%
        }
    }

    .ProgressBar-fill {
        background-color: #2d7ff9;
        height: 4px;
        animation: progressFill 1s ease infinite;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
    }
`;

/**
 * A function that loads the CSS on the page.
 */
function loadCSS() {
    loadCSSFromString(cssString);
}

export default loadCSS;
