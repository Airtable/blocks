/** @module @airtable/blocks/ui: Loader */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import LoaderCore from '../../shared/ui/loader';
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
export interface LoaderProps extends LoaderStyleProps {
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
        <LoaderCore
            fillColor={fillColor}
            scale={scale}
            className={cx(
                baymax('animate-spin-scale animate-infinite'),
                classNameForStyleProps,
                className,
            )}
            style={style}
        />
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
