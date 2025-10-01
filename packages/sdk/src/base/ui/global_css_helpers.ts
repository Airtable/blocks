export const SPIN_SCALE_ANIMATION_NAME = `spinScale_${Math.random().toString(36).substring(2, 11)}`;
export const BUTTON_LINK_CLASS_NAME = `buttonLink_${Math.random().toString(36).substring(2, 11)}`;

const spinScaleKeyframesStyle = `
    @keyframes ${SPIN_SCALE_ANIMATION_NAME} {
        0% {
            transform: rotate(0) scale(1);
        }
        50% {
            transform: rotate(360deg) scale(0.9);
        }
        100% {
            transform: rotate(720deg) scale(1);
        }
    }
`;

const buttonLinkStyle = `
    .${BUTTON_LINK_CLASS_NAME} {
        cursor: pointer;
        padding-bottom: 0.14rem;
        border-bottom: 2px solid hsla(0, 0%, 0%, 0.1);
    }
    .${BUTTON_LINK_CLASS_NAME}:hover {
        opacity: 1;
    }
`;

export const getCssContentToAddToHead = () => {
    return `${spinScaleKeyframesStyle}\n${buttonLinkStyle}`;
};
