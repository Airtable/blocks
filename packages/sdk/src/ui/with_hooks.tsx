/** @module @airtable/blocks/ui: withHooks */ /** */
import * as React from 'react';

/**
 * A higher-order component for working with React hooks in class-based components. It takes a React
 * component and wraps it, injecting values from hooks as additional props. `withHooks` uses
 * {@link https://reactjs.org/docs/forwarding-refs.html|`React.forwardRef`} to make sure that you can
 * use refs with your wrapped component in exactly the same way you would if you weren't using
 * `withHooks`.
 *
 * @param Component The React component you want to inject hooks into.
 * @param getAdditionalPropsToInject A function that takes props and returns more props to be injected into the wrapped component.
 * @returns The wrapped React component.
 *
 * @example
 * ```js
 * import React from 'react';
 * import {useRecords, withHooks} from '@airtable/blocks/ui';
 *
 * // RecordList takes a list of records and renders it
 * class RecordList extends React.Component {
 *      render() {
 *          const records = this.props.records.map(record => {
 *              return <li key={record.id}>{record.primaryCellValueAsString}</li>
 *          });
 *
 *          return <ul>{records}</ul>;
 *      }
 * }
 *
 * // using withHooks, we wrap up RecordList. It takes a queryResult prop, and injects a records
 * // prop from useRecords
 * const WrappedRecordList = withHooks(RecordList, ({queryResult}) => {
 *      const records = useRecords(queryResult);
 *      return {
 *          records: records,
 *      };
 * });
 *
 * // when we use WrappedRecordList, we only need to pass in queryResult:
 * <WrappedRecordList queryResult={someQueryResult} />
 * ```
 *
 * @example
 * ```js
 * import React from 'react';
 * import {Record, QueryResult} from '@airtable/blocks/models';
 * import {withHooks, useRecords} from '@airtable/blocks/ui';
 * // with typescript, things are a little more complex: we need to provide some type annotations to
 * // indicate which props are injected:
 *
 * type RequiredProps = {
 *      queryResult: QueryResult,
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
 *      ({queryResult}) => {
 *          const records = useRecords(queryResult);
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
export default function withHooks<InjectedProps extends {}, Props extends InjectedProps, Instance>(
    Component:
        | (new (props: Props) => React.Component) & {displayName?: string}
        | React.RefForwardingComponent<Instance, Props>
        | React.FunctionComponent<Props>,
    getAdditionalPropsToInject: (props: Omit<Props, keyof InjectedProps>) => InjectedProps,
): React.RefForwardingComponent<
    Instance,
    Omit<Props, keyof InjectedProps> & React.RefAttributes<Instance>
> {
    return React.forwardRef<
        Instance,
        Omit<Props, keyof InjectedProps> & React.RefAttributes<Instance>
    >((props, ref) => {
        const propsToInject = getAdditionalPropsToInject(props);
        return <Component ref={ref} {...(props as any)} {...propsToInject} />;
    }) as any;
}
