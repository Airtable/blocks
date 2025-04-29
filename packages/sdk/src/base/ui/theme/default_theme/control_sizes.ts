const sharedControlSizes = {
    small: {
        fontSize: 2, 
        height: '28px',
        lineHeight: '19px',
    },
    default: {
        fontSize: 2, 
        height: '32px',
        lineHeight: '21px',
    },
    large: {
        fontSize: 3, 
        height: '36px',
        lineHeight: '21px',
    },
};

export const buttonSizes = {
    small: {
        ...sharedControlSizes.small,
        paddingX: '10px',
    },
    default: {
        ...sharedControlSizes.default,
        paddingX: '12px',
    },
    large: {
        ...sharedControlSizes.large,
        paddingX: '14px',
    },
};

export const selectSizes = {
    small: {
        ...sharedControlSizes.small,
        paddingLeft: '8px',
        paddingRight: '24px',
        backgroundPosition: 'calc(100% - 8px)',
    },
    default: {
        ...sharedControlSizes.default,
        paddingLeft: '10px',
        paddingRight: '26px',
        backgroundPosition: 'calc(100% - 10px)',
    },
    large: {
        ...sharedControlSizes.large,
        paddingLeft: '12px',
        paddingRight: '28px',
        backgroundPosition: 'calc(100% - 12px)',
    },
};

export const inputSizes = {
    small: {
        ...sharedControlSizes.small,
        paddingX: '8px',
    },
    default: {
        ...sharedControlSizes.default,
        paddingX: '10px',
    },
    large: {
        ...sharedControlSizes.large,
        paddingX: '12px',
    },
};

export const selectButtonsSizes = {
    small: {
        ...sharedControlSizes.small,
        padding: 1,
    },
    default: {
        ...sharedControlSizes.default,
        padding: 1,
    },
    large: {
        ...sharedControlSizes.large,
        padding: 1,
    },
};

export const switchSizes = {
    small: {
        ...sharedControlSizes.small,
        paddingX: '8px',
    },
    default: {
        ...sharedControlSizes.default,
        paddingX: '10px',
    },
    large: {
        ...sharedControlSizes.large,
        paddingX: '12px',
    },
};
