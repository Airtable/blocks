// @flow
import * as React from 'react';

/**
 * A helper method for working with react hooks in class-based components. It takes a React
 * component and wraps it, injecting values from hooks as additional props. `withHooks` uses
 * {@link https://reactjs.org/docs/forwarding-refs.html React.forwardRef} to make sure that you can
 * use refs with your wrapped component in exactly the same way you would if you weren't using
 * withHooks.
 *
 * @param {React.Component} Component The React component you want to inject hooks into
 * @param {Function} getAdditionalPropsToInject a function that takes props and returns more props to be injected into the wrapped component
 * @returns {React.Component} the wrapped React component
 *
 * @example
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
 *
 * @example
 * import React from 'react';
 * import {Record, QueryResult} from '@airtable/blocks/models';
 * import {withHooks, useRecords} from '@airtable/blocks/ui';
 * // with flow, things are a little more complex: we need to provide some type annotations to
 * // indicate which props are injected:
 *
 * type RequiredProps = {|
 *      queryResult: QueryResult,
 * |};
 *
 * type InjectedProps = {|
 *      records: Array<Record>,
 * |};
 *
 * type RecordListProps = {|
 *      ...RequiredProps,
 *      ...InjectedProps,
 * |};
 *
 * class RecordList extends React.Component<RecordListProps> {
 *      // implementation is the same as the example above
 * }
 *
 * // you need to annotate the return type as React.AbstractComponent. This takes two type args:
 * //   - the Config (usually just props) of the resulting component
 * //   - the instance type (what you get out of a ref) of the resulting component
 * const WrappedRecordList: React.AbstractComponent<RequiredProps, RecordList> = withHooks(
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
 */
export default function withHooks<Config: {}, InjectedProps: {}, Instance>(
    Component: React.AbstractComponent<Config, Instance>,
    getAdditionalPropsToInject: (props: $Diff<Config, InjectedProps>) => InjectedProps,
): React.AbstractComponent<$Diff<Config, InjectedProps>, Instance> {
    return React.forwardRef((props, ref) => {
        const propsToInject = getAdditionalPropsToInject(props);
        return <Component ref={ref} {...props} {...propsToInject} />;
    });
}
