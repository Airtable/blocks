/** @module @airtable/blocks/ui: withHooks */ /** */
import * as React from 'react';
import {spawnError} from '../error_utils';

/**
 * @hidden
 * A higher-order component for working with React hooks in class-based components. It takes a React
 * component and wraps it, injecting values from hooks as additional props. `withHooks` uses
 * [`React.forwardRef`](https://reactjs.org/docs/forwarding-refs.html) to make sure that you can
 * use refs with your wrapped component in exactly the same way you would if you weren't using
 * `withHooks`.
 *
 * If you need an reference to the actual component instance, you can return a `ref` prop.
 *
 * @param Component The React component you want to inject hooks into.
 * @param getAdditionalPropsToInject A function that takes props and returns more props to be injected into the wrapped component.
 * @example
 * ```js
 * import React from 'react';
 * import {useRecords, withHooks} from '@airtable/blocks/base/ui';
 *
 * // RecordList takes a list of records and renders it
 * class RecordList extends React.Component {
 *      render() {
 *          const records = this.props.records.map(record => {
 *              return <li key={record.id}>{record.name}</li>
 *          });
 *
 *          return <ul>{records}</ul>;
 *      }
 * }
 *
 * // using withHooks, we wrap up RecordList. It takes a table prop, and injects a records
 * // prop from useRecords
 * const WrappedRecordList = withHooks(RecordList, ({table}) => {
 *      const records = useRecords(table);
 *
 *      const instanceRef = React.useRef();
 *      useEffect(() => {
 *          console.log('RecordList instance:', instanceRef.current);
 *      });
 *
 *      return {
 *          records: records,
 *          ref: instanceRef,
 *      };
 * });
 *
 * // when we use WrappedRecordList, we only need to pass in table:
 * <WrappedRecordList table={someTable} />
 * ```
 *
 * @example
 * ```js
 * import React from 'react';
 * import {Record, Table} from '@airtable/blocks/[placeholder-path]/models';
 * import {withHooks, useRecords} from '@airtable/blocks/[placeholder-path]/ui';
 * // with typescript, things are a little more complex: we need to provide some type annotations to
 * // indicate which props are injected:
 *
 * type RequiredProps = {
 *      table: Table,
 * };
 *
 * type InjectedProps = {
 *      records: Array<Record>,
 * };
 *
 * type RecordListProps = RequiredProps & InjectedProps;
 *
 * class RecordList extends React.Component<RecordListProps> {
 *      // implementation is the same as the example above
 * }
 *
 * // you need to annotate the call to withHooks. This takes three type args:
 * //   - The injected props
 * //   - The full resulting props passed to the element
 * //   - the instance type (what you get out of a ref) of the resulting component
 * const WrappedRecordList = withHooks<InjectedProps, RecordListProps, RecordList>(
 *      RecordList,
 *      ({table}) => {
 *          const records = useRecords(table);
 *          return {
 *              records
 *          };
 *      },
 * );
 *
 * // when using a ref to the component, you can't refer to it as WrappedRecordList like a normal
 * // class component. Instead, you need to wrap it in React.ElementRef:
 * const ref: React.ElementRef<typeof WrappedRecordList> = getTheRefSomehow();
 * ```
 */
export default function withHooks<InjectedProps, Props extends InjectedProps, Instance>(
    Component:
        | ((new (props: Props) => React.Component) & {displayName?: string})
        | React.ComponentType<Props>,
    getAdditionalPropsToInject: (
        props: React.PropsWithoutRef<Omit<Props, keyof InjectedProps>>,
    ) => InjectedProps & {ref?: React.Ref<Instance>},
): React.ForwardRefExoticComponent<
    Omit<Props, keyof InjectedProps> & React.RefAttributes<Instance>
> {
    if (!getAdditionalPropsToInject) {
        throw spawnError('withHooks: getAdditionalPropsToInject is required');
    }

    return React.forwardRef<
        Instance,
        Omit<Props, keyof InjectedProps> & React.RefAttributes<Instance>
    >((props, forwardedRef) => {
        const propsToInject = getAdditionalPropsToInject(props);
        if (propsToInject === null || typeof propsToInject !== 'object') {
            throw spawnError('withHooks: getAdditionalPropsToInject must return an object');
        }

        const injectedRef = propsToInject.ref;

        const mergedRef = React.useMemo(() => {
            if (!injectedRef && !forwardedRef) {
                return undefined;
            }

            return (instance: Instance | null): void => {
                if (injectedRef && typeof injectedRef === 'object') {
                    (injectedRef as React.RefObject<Instance | null>).current = instance;
                } else if (typeof injectedRef === 'function') {
                    injectedRef(instance);
                }

                if (forwardedRef && typeof forwardedRef === 'object') {
                    (forwardedRef as React.RefObject<Instance | null>).current = instance;
                } else if (typeof forwardedRef === 'function') {
                    forwardedRef(instance);
                }
            };
        }, [injectedRef, forwardedRef]);

        return <Component {...(props as any)} {...propsToInject} ref={mergedRef} />;
    }) as any;
}
