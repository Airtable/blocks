// @flow
import * as React from 'react';

// Helper method for using hooks with class components.
export default function withHooks<Config: {}, InjectedProps: {}, Instance>(
    Component: React.AbstractComponent<Config, Instance>,
    getAdditionalPropsToInject: (props: $Diff<Config, InjectedProps>) => InjectedProps,
): React.AbstractComponent<$Diff<Config, InjectedProps>, Instance> {
    return React.forwardRef((props, ref) => {
        const propsToInject = getAdditionalPropsToInject(props);
        return <Component ref={ref} {...props} {...propsToInject} />;
    });
}
