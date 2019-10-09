// Controls are things such as `Button`, `Input`, `Select` and `SelectButtons`.
// Currently only `Button` uses this.
export const controlSizes = {
    small: {
        fontSize: 2,
        height: '28px',
        lineHeight: '19px',
    },
    default: {
        fontSize: 3,
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
        ...controlSizes.small,
        paddingX: '10px',
    },
    default: {
        ...controlSizes.default,
        paddingX: '12px',
    },
    large: {
        ...controlSizes.large,
        paddingX: '14px',
    },
};
