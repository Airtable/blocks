// @flow
import {act} from 'react-dom/test-utils';
/**
 * include a section of code that must pass flow but shouldn't actually be executed. Use it along
 * with '// flow-expect-error' to write tests for flow-type definitions that won't be run by jest.
 */
export function flowTest(description: string, fn: () => mixed): void {
    // no-op
}

// we're using a pre-release build of react for tests so we can use act asynchronously, but it's
// not built in to flow yet.
export const actAsync: (() => Promise<void>) => Promise<void> = (act: any);
