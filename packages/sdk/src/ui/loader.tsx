/** @module @airtable/blocks/ui: Loader */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {baymax} from './baymax_utils';
import useStyledSystem from './use_styled_system';
import {
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    margin,
    marginPropTypes,
    MarginProps,
} from './system';

const ORIGINAL_SIZE = 54;

/**
 * Style props for the {@link Loader} component. Accepts:
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link PositionSetProps}
 */
interface LoaderStyleProps extends FlexItemSetProps, PositionSetProps, MarginProps {}

const styleParser = compose(flexItemSet, positionSet, margin);

export const loaderStylePropTypes = {
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/**
 * Props for the {@link Loader} component. Also accepts:
 * * {@link LoaderStyleProps}
 *
 * @docsPath UI/components/Loader
 * @noInheritDoc
 */
interface LoaderProps extends LoaderStyleProps {
    /** The color of the loading spinner. Defaults to `'#888'` */
    fillColor: string;
    /** A scalar for the loading spinner. Increasing the scale increases the size of the loading spinner. Defaults to `0.3`. */
    scale: number;
    /** Additional class names to apply to the loading spinner. */
    className?: string;
    /** Additional styles to apply to the loading spinner. */
    style?: React.CSSProperties;
}

/**
 * A loading spinner component.
 *
 * [[ Story id="loader--example" title="Loader example" ]]
 *
 * @docsPath UI/components/Loader
 * @component
 */
const Loader = (props: LoaderProps) => {
    const {fillColor, scale, className, style, ...styleProps} = props;
    const classNameForStyleProps = useStyledSystem<LoaderStyleProps>(styleProps, styleParser);

    return (
        <svg
            width={ORIGINAL_SIZE * scale}
            height={ORIGINAL_SIZE * scale}
            viewBox={`0 0 ${ORIGINAL_SIZE} ${ORIGINAL_SIZE}`}
            className={cx(
                baymax('animate-spin-scale animate-infinite'),
                classNameForStyleProps,
                className,
            )}
            style={{
                shapeRendering: 'geometricPrecision',
                ...style,
            }}
        >
            <g>
                <path
                    d="M10.9,48.6c-1.6-1.3-2-3.6-0.7-5.3c1.3-1.6,3.6-2.1,5.3-0.8c0.8,0.5,1.5,1.1,2.4,1.5c7.5,4.1,16.8,2.7,22.8-3.4c1.5-1.5,3.8-1.5,5.3,0c1.4,1.5,1.4,3.9,0,5.3c-8.4,8.5-21.4,10.6-31.8,4.8C13,50.1,11.9,49.3,10.9,48.6z"
                    fill={fillColor}
                />
                <path
                    d="M53.6,31.4c-0.3,2.1-2.3,3.5-4.4,3.2c-2.1-0.3-3.4-2.3-3.1-4.4c0.2-1.1,0.2-2.2,0.2-3.3c0-8.7-5.7-16.2-13.7-18.5c-2-0.5-3.2-2.7-2.6-4.7s2.6-3.2,4.7-2.6C46,4.4,53.9,14.9,53.9,27C53.9,28.5,53.8,30,53.6,31.4z"
                    fill={fillColor}
                />
                <path
                    d="M16.7,1.9c1.9-0.8,4.1,0.2,4.8,2.2s-0.2,4.2-2.1,5c-7.2,2.9-12,10-12,18.1c0,1.6,0.2,3.2,0.6,4.7c0.5,2-0.7,4.1-2.7,4.6c-2,0.5-4-0.7-4.5-2.8C0.3,31.5,0,29.3,0,27.1C0,15.8,6.7,5.9,16.7,1.9z"
                    fill={fillColor}
                />
            </g>
        </svg>
    );
};

Loader.propTypes = {
    fillColor: PropTypes.string.isRequired,
    scale: PropTypes.number.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    ...loaderStylePropTypes,
};

Loader.defaultProps = {
    fillColor: '#888',
    scale: 0.3,
};

export default Loader;
