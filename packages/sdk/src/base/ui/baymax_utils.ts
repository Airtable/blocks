import {css, keyframes} from 'emotion';
import {has} from '../../shared/private_utils';
import {spawnError} from '../../shared/error_utils';

const bounceIn = keyframes`
    from, 50%, to {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }
    0% {
        opacity: 0.9;
        -webkit-transform: scale3d(.98, .98, .98);
        transform: scale3d(.98, .98, .98);
    }
    70% {
        opacity: 1;
        -webkit-transform: scale3d(1.01, 1.01, 1.01);
        transform: scale3d(1.01, 1.01, 1.01);
    }
    to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
`;

const spinScale = keyframes`
    0% {
        transform: rotate(0) scale(1);
    }
    50% {
        transform: rotate(360deg) scale(0.9);
    }
    100% {
        transform: rotate(720deg) scale(1);
    }
`;

// TODO (stephen): import values from theme object?
const emotionClassNameByBaymaxClassName = {
    absolute: css`
        position: absolute;
    `,
    'align-top': css`
        vertical-align: top;
    `,
    'all-0': css`
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    `,
    animate: css`
        transition: 0.085s all ease-in;
    `,
    'animate-bounce-in': css`
        animation-name: ${bounceIn};
        animation-duration: 240ms;
    `,
    'animate-infinite': css`
        animation-iteration-count: infinite;
    `,
    'animate-spin-scale': css`
        animation-name: ${spinScale};
        animation-duration: 1800ms;
        animation-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);
    `,
    appFontColorLight: css`
        color: hsl(0, 0%, 33%);
    `,
    'background-center': css`
        background-position: center center;
    `,
    'background-cover': css`
        background-size: cover;
    `,
    'background-transparent': css`
        background-color: transparent;
    `,
    big: css`
        font-size: 0.9rem;
    `,
    block: css`
        display: block;
    `,
    blue: css`
        background-color: rgb(45, 127, 249);
    `,
    'border-box': css`
        box-sizing: border-box;
    `,
    'bottom-0': css`
        bottom: 0;
    `,
    caps: css`
        text-transform: uppercase;
        letter-spacing: 0.1em;
    `,
    cardBoxShadow: css`
        box-shadow: 0 0 0 2px hsla(0, 0%, 0%, 0.1);
        transition-property: box-shadow;
        -webkit-transition-property: box-shadow;
        -moz-transition-property: box-shadow;
        transition-duration: 0.15s;
        -webkit-transition-duration: 0.15s;
        -moz-transition-duration: 0.15s;
        transition-timing-function: ease-out;
        -webkit-transition-timing-function: ease-out;
        -moz-transition-timing-function: ease-out;
        &:hover {
            box-shadow: 0 0 0 2px hsla(0, 0%, 0%, 0.25);
        }
    `,
    center: css`
        text-align: center;
    `,
    circle: css`
        border-radius: 50%;
    `,
    dark: css`
        background-color: hsl(0, 0%, 20%);
    `,
    darken1: css`
        background-color: hsla(0, 0%, 0%, 0.05);
    `,
    'darken1-focus': css`
        &:focus {
            background-color: hsla(0, 0%, 0%, 0.05);
        }
    `,
    'darken1-hover': css`
        &:hover {
            background-color: hsla(0, 0%, 0%, 0.05);
        }
    `,
    darken2: css`
        background-color: hsla(0, 0%, 0%, 0.1);
    `,
    darken3: css`
        background-color: hsla(0, 0%, 0%, 0.25);
    `,
    darken4: css`
        background-color: hsla(0, 0%, 0%, 0.5);
    `,
    fixed: css`
        position: fixed;
    `,
    flex: css`
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
    `,
    'flex-auto': css`
        -webkit-box-flex: 1;
        -webkit-flex: 1 1 auto;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        min-width: 0;
        min-height: 0;
    `,
    'flex-inline': css`
        display: -webkit-inline-flex;
        display: -ms-inline-flexbox;
        display: inline-flex;
    `,
    'flex-none': css`
        -webkit-box-flex: 0;
        -webkit-flex: none;
        -ms-flex: none;
        flex: none;
    `,
    'flex-reverse': css`
        -webkit-flex-direction: row-reverse;
        flex-direction: row-reverse;
    `,
    'flex-wrap': css`
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    `,
    focusable: css`
        &:focus {
            outline: 0;
            box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.1);
        }
    `,
    gray: css`
        background-color: rgb(102, 102, 102);
    `,
    grayLight2: css`
        background-color: rgb(238, 238, 238);
    `,
    green: css`
        background-color: rgb(32, 201, 51);
    `,
    'height-full': css`
        height: 100%;
    `,
    inline: css`
        display: inline;
    `,
    'inline-block': css`
        display: inline-block;
    `,
    'items-center': css`
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        -ms-grid-row-align: center;
        align-items: center;
    `,
    'justify-center': css`
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
    `,
    'justify-end': css`
        -webkit-box-pack: end;
        -webkit-justify-content: flex-end;
        -ms-flex-pack: end;
        justify-content: flex-end;
    `,
    'justify-start': css`
        -webkit-box-pack: start;
        -webkit-justify-content: flex-start;
        -ms-flex-pack: start;
        justify-content: flex-start;
    `,
    'left-0': css`
        left: 0;
    `,
    'light-scrollbar': css`
        &::-webkit-scrollbar {
            width: 12px;
            height: 12px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        &::-webkit-scrollbar-button {
            display: none;
            height: 0;
            width: 0;
        }
        &::-webkit-scrollbar-thumb {
            background-color: hsla(0, 0%, 0%, 0.35);
            background-clip: padding-box;
            border: 3px solid rgba(0, 0, 0, 0);
            border-radius: 6px;
            min-height: 36px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background-color: hsla(0, 0%, 0%, 0.4);
        }
    `,
    'line-height-4': css`
        line-height: 1.5;
    `,
    'link-quiet': css`
        &:hover {
            opacity: 0.85;
        }
    `,
    'link-unquiet': css`
        &:hover {
            opacity: 1;
        }
    `,
    'link-unquiet-focusable': css`
        &:hover {
            opacity: 1;
        }
        &:focus {
            opacity: 1;
        }
    `,
    m0: css`
        margin: 0;
    `,
    m2: css`
        margin: 1rem;
    `,
    mb1: css`
        margin-bottom: 0.5rem;
    `,
    ml1: css`
        margin-left: 0.5rem;
    `,
    'mr-half': css`
        margin-right: 0.25rem;
    `,
    mr1: css`
        margin-right: 0.5rem;
    `,
    mt0: css`
        margin-top: 0;
    `,
    mt1: css`
        margin-top: 0.5rem;
    `,
    mt2: css`
        margin-top: 1rem;
    `,
    'no-outline': css`
        outline: 0;
    `,
    'no-user-select': css`
        user-select: none;
        -webkit-user-select: none;
    `,
    noevents: css`
        pointer-events: none;
    `,
    normal: css`
        font-size: 0.8rem;
    `,
    nowrap: css`
        white-space: nowrap;
    `,
    'overflow-auto': css`
        overflow: auto;
    `,
    'overflow-hidden': css`
        overflow: hidden;
    `,
    'p-half': css`
        padding: 0.25rem;
    `,
    p1: css`
        padding: 0.5rem;
    `,
    p2: css`
        padding: 1rem;
    `,
    pill: css`
        border-radius: 9999px;
    `,
    pointer: css`
        cursor: pointer;
    `,
    pr1: css`
        padding-right: 0.5rem;
    `,
    'print-color-exact': css`
        -webkit-print-color-adjust: exact;
    `,
    px1: css`
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    `,
    quiet: css`
        opacity: 0.75;
    `,
    quieter: css`
        opacity: 0.5;
    `,
    red: css`
        background-color: rgb(248, 43, 96);
    `,
    relative: css`
        position: relative;
    `,
    'right-0': css`
        right: 0;
    `,
    rounded: css`
        border-radius: 3px;
    `,
    'rounded-big': css`
        border-radius: 6px;
    `,
    'self-end': css`
        -webkit-align-self: flex-end;
        -ms-flex-item-align: end;
        align-self: flex-end;
    `,
    small: css`
        font-size: 11px;
    `,
    stroked1: css`
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    `,
    strong: css`
        font-weight: 500;
    `,
    'styled-input': css`
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-style: solid;
        border-width: 2px;
        border-color: transparent;
        outline: none;
        &:active {
            border-color: hsla(0, 0%, 0%, 0.25);
        }
        &:focus {
            border-color: hsla(0, 0%, 0%, 0.25);
        }
    `,
    'text-blue': css`
        color: rgb(45, 127, 249);
        fill: rgb(45, 127, 249);
    `,
    'text-blue-focus': css`
        &:focus {
            color: rgb(45, 127, 249);
            fill: rgb(45, 127, 249);
        }
    `,
    'text-dark': css`
        color: hsl(0, 0%, 20%);
        fill: hsl(0, 0%, 20%);
    `,
    'text-white': css`
        color: hsl(0, 0%, 100%);
        fill: hsl(0, 0%, 100%);
    `,
    'top-0': css`
        top: 0;
    `,
    truncate: css`
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
    understroke: css`
        padding-bottom: 0.14rem;
        border-bottom: 2px solid hsla(0, 0%, 0%, 0.1);
    `,
    white: css`
        background-color: hsl(0, 0%, 100%);
    `,
    'width-full': css`
        width: 100%;
    `,
    yellow: css`
        background-color: rgb(252, 180, 0);
    `,
};

/**
 * @internal
 */
export function baymax(baymaxClassNames: string): string {
    return baymaxClassNames
        .split(/\s+/)
        .filter(Boolean)
        .map(baymaxClassName => {
            if (has(emotionClassNameByBaymaxClassName, baymaxClassName)) {
                return emotionClassNameByBaymaxClassName[baymaxClassName];
            } else {
                throw spawnError(
                    'Baymax class not found: %s. If required, add the definition to baymax_utils.js.`',
                    baymaxClassName,
                );
            }
        })
        .join(' ');
}
