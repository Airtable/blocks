// @flow
import * as React from 'react';
import {cx} from 'emotion';
import useStyledSystem, {type StyleParser} from './use_styled_system';

/**
 * @private
 * A helper method for working with the useStyledSystem hook in class-based components.
 * It takes a React component and converts style props into a single className prop.
 *
 * @param {React.Component} Component The React component you want to use with styled system
 * @param {StyleParser} styleParser The style parser, constructed with `compose`
 * @returns {React.Component} The transformed React component
 *
 * @example
 * import * as React from 'react';
 * import {compose} from '@styled-system/core';
 * import withStyledSystem from './with_styled_system';
 * import {
 *     flexContainerSet,
 *     flexContainerSetPropTypes,
 *     type FlexContainerSetProps,
 *     flexItemSet,
 *     type FlexItemSetProps,
 *     flexItemSetPropTypes,
 *     margin,
 *     marginPropTypes,
 *     type MarginProps,
 * } from './system';
 *
 * type Props = {|
 *     className: string,
 *     onClick: () => void,
 *     children: React.Node,
 * |};
 *
 * type StyleProps = {|
 *     ...FlexContainerSetProps,
 *     ...FlexItemSetProps,
 *     ...MarginProps,
 * |};
 *
 * const styleParser = compose({
 *     ...flexContainerSet,
 *     ...flexItemSet,
 *     ...margin,
 * });
 *
 * const stylePropTypes = {
 *     ...flexContainerSetPropTypes,
 *     ...flexItemSetPropTypes,
 *     ...marginPropTypes,
 * };
 *
 * class MyComponent extends React.Component<Props, void> {
 *     render() {
 *         const {className, onClick, children} = this.props;
 *         return (
 *             <div className={className} onClick={onClick}>
 *                 {children}
 *             </div>
 *         );
 *     }
 * }
 *
 * export default withStyledSystem<Props, StyleProps, MyComponent>(
 *     MyComponent,
 *     styleParser,
 *     stylePropTypes,
 * );
 */
export default function withStyledSystem<Props: {className: string}, StyleProps: {}, Instance>(
    Component: React.AbstractComponent<$Exact<Props>, Instance>,
    styleParser: StyleParser<StyleProps>,
    stylePropTypes: {[string]: mixed},
): React.AbstractComponent<{...Props, ...StyleProps}, Instance> {
    const stylePropNamesSet = new Set(styleParser.propNames);
    const WithStyledSystem = React.forwardRef((props, ref) => {
        // eslint-disable-next-line flowtype/no-weak-types
        const styleProps: any = {};
        // eslint-disable-next-line flowtype/no-weak-types
        const nonStyleProps: any = {};
        for (const propName of Object.keys(props)) {
            if (stylePropNamesSet.has(propName)) {
                styleProps[propName] = props[propName];
            } else {
                nonStyleProps[propName] = props[propName];
            }
        }
        const classNameForStyleProps = useStyledSystem((styleProps: StyleProps), styleParser);
        return (
            <Component
                ref={ref}
                {...(nonStyleProps: Props)}
                className={cx(classNameForStyleProps, nonStyleProps.className)}
            />
        );
    });
    // eslint-disable-next-line flowtype/no-weak-types
    (WithStyledSystem: any).propTypes = {
        // eslint-disable-next-line flowtype/no-weak-types
        ...(Component: any).propTypes,
        ...stylePropTypes,
    };
    const componentName = Component.displayName || Component.name || 'Component';
    WithStyledSystem.displayName = `WithStyledSystem(${componentName})`;
    return WithStyledSystem;
}
