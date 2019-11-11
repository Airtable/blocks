import getStylePropsForResponsiveProp from '../src/ui/system/utils/get_style_props_for_responsive_prop';

describe('getStylePropForResponsiveProp', () => {
    it('returns responsive style props for scale', () => {
        const result = getStylePropsForResponsiveProp(
            {
                smallViewport: 'xsmall',
                mediumViewport: 'small',
            },
            {
                xsmall: {
                    fontSize: 1,
                    textColor: 'dark',
                    lineHeight: '14px',
                    fontWeight: 400,
                    fontFamily: 'default',
                    marginY: 0,
                },
                small: {
                    fontSize: 2,
                    textColor: 'dark',
                    lineHeight: '16px',
                    fontWeight: 400,
                    fontFamily: 'default',
                    marginY: 0,
                },
            },
        );

        expect(result).toStrictEqual({
            fontSize: {
                smallViewport: 1,
                mediumViewport: 2,
            },
            textColor: 'dark',
            lineHeight: {
                smallViewport: '14px',
                mediumViewport: '16px',
            },
            fontWeight: 400,
            fontFamily: 'default',
            marginY: 0,
        });
    });
});
