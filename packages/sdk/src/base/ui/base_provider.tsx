import * as React from 'react';
import Base from '../models/base';
import {SdkContext} from '../../shared/ui/sdk_context';

/**
 * Props for the {@link BaseProvider} component.
 *
 * @docsPath UI/components/BaseProvider
 */
interface BaseProviderProps {
    /** The {@Base} instance associated with the App. */
    value: Base;
    /** The contents to render. */
    children: React.ReactNode;
}

/**
 * A React Provider which allows Components to be rendered outside of an App's
 * React tree.
 *
 * @example
 * ```js
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import {BaseProvider} from '@airtable/blocks/ui';
 *
 * function getHtmlStringForRecordCard(base, record) {
 *     return ReactDOM.renderToStaticMarkup(
 *         <BaseProvider value={base}>
 *             <RecordCard record={record} />
 *         </BaseProvider>
 *     );
 * }
 * ```
 * @docsPath UI/components/BaseProvider
 * @component
 */
function BaseProvider(props: BaseProviderProps) {
    const {value, children} = props;
    const sdk = value.__sdk;

    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
}

export default BaseProvider;
