/** @module @airtable/blocks/ui: Loader */ /** */
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import LoaderCore from '../../shared/ui/loader';
import {baymax} from './baymax_utils';
import useStyledSystem from './use_styled_system';
import {
    flexItemSet,
    FlexItemSetProps,
    positionSet,
    PositionSetProps,
    margin,
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

/**
 * Props for the {@link Loader} component. Also accepts:
 * * {@link LoaderStyleProps}
 *
 * @docsPath UI/components/Loader
 * @noInheritDoc
 */
export interface LoaderProps extends LoaderStyleProps {
    /** The color of the loading spinner. Defaults to `'#888'` */
    fillColor?: string;
    /** A scalar for the loading spinner. Increasing the scale increases the size of the loading spinner. Defaults to `0.3`. */
    scale?: number;
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
const Loader = ({
    fillColor = '#888',
    scale = 0.3,
    className,
    style,
    ...styleProps
}: LoaderProps) => {
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

export default Loader;
