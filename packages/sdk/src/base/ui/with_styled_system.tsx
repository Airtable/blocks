import * as React from 'react';
import {cx} from 'emotion';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {type styleFn} from '@styled-system/core';
import {cast, keys} from '../../shared/private_utils';
import useStyledSystem from './use_styled_system';

/**
 * @internal
 * A higher-order component for working with the `useStyledSystem` hook in class-based components.
 * It takes a React component and converts style props into a single className prop.
 *
 * Generate boilerplate for using this hook with our scaffolding tool: https://o80pm.csb.app/
 *
 * Returns The transformed React component.
 *
 * @param Component The React component you want to use with styled system.
 * @param styleParser The style parser, constructed with `compose`.
 * @example
 * ```js
 * import * as React from 'react';
 * import {compose} from '@styled-system/core';
 * import withStyledSystem from './with_styled_system';
 * import {
 *     flexContainerSet,
 *     FlexContainerSetProps,
 *     flexItemSet,
 *     FlexItemSetProps,
 *     margin,
 *     MarginProps,
 * } from './system';
 *
 * interface Props {
 *     className?: string;
 *     onClick: () => void;
 *     children: React.ReactNode;
 * };
 *
 * interface MyComponentStyleProps extends FlexContainerSetProps, FlexItemSetProps, MarginProps {}
 *
 * const styleParser = compose(
 *     flexContainerSet,
 *     flexItemSet,
 *     margin,
 * );
 *
 *
 * class MyComponent extends React.Component<Props, void> {
 *     static staticProp = 'STATIC';
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
 * export default withStyledSystem<Props, MyComponentStyleProps, MyComponent, { staticProp: string }>(
 *     MyComponent,
 *     styleParser,
 *     {
 *         // Optional default style props.
 *         margin: 3
 *     }
 * );
 * ```
 */
export default function withStyledSystem<
    Props extends {className?: string},
    StyleProps extends {},
    Instance,
    Statics extends {},
>(
    Component:
        | ((new (props: Props) => React.Component) & {displayName?: string})
        | React.ComponentType<Props>,
    styleParser: styleFn,
    defaultStyleProps?: StyleProps,
): React.ForwardRefExoticComponent<Props & StyleProps & React.RefAttributes<Instance>> & Statics {
    const WithStyledSystem = React.forwardRef<
        Instance,
        Props & StyleProps & React.RefAttributes<Instance>
    >((props, ref) => {
        const {styleProps, nonStyleProps} = splitStyleProps<Props & StyleProps, StyleProps>(
            props,
            styleParser.propNames,
            defaultStyleProps,
        );
        const classNameForStyleProps = useStyledSystem(cast<StyleProps>(styleProps), styleParser);
        return (
            <Component
                ref={ref}
                {...(nonStyleProps as any)}
                className={cx(classNameForStyleProps, (nonStyleProps as any).className)}
            />
        );
    });
    const componentName = Component.displayName || Component.name || 'Component';
    WithStyledSystem.displayName = `WithStyledSystem(${componentName})`;
    hoistNonReactStatics(WithStyledSystem, Component);
    return WithStyledSystem as any;
}

/**
 * @internal
 * A helper method to split props into style props (for use with styled system) and
 * non-style props (to be passed into the wrapped component).
 *
 * Returns A result object with two keys: `styleProps` and `nonStyleProps`, which contain the
 * respective split props.
 *
 * @param props Props to be split into style and non-style props.
 * @param stylePropNames The list of allowed style prop names.
 * @param defaultStyleProps Default values for style props.
 */
export function splitStyleProps<AllProps extends {className?: string}, StyleProps extends {}>(
    props: React.PropsWithoutRef<AllProps>,
    stylePropNames: Array<string> = [],
    defaultStyleProps?: StyleProps,
): {
    styleProps: StyleProps;
    nonStyleProps: Omit<AllProps, keyof StyleProps>;
} {
    const stylePropNamesSet: Set<keyof any> = new Set(stylePropNames);
    const styleProps: any = {...defaultStyleProps};
    const nonStyleProps: any = {};
    for (const propName of keys(props)) {
        if (stylePropNamesSet.has(propName)) {
            styleProps[propName] = props[propName];
        } else {
            nonStyleProps[propName] = props[propName];
        }
    }
    return {
        styleProps,
        nonStyleProps,
    };
}
