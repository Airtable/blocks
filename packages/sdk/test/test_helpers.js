// @flow
import {ReactWrapper} from 'enzyme';

/**
 * include a section of code that must pass flow but shouldn't actually be executed. Use it along
 * with '// flow-expect-error' to write tests for flow-type definitions that won't be run by jest.
 */
export function flowTest(description: string, fn: () => mixed): void {
}

export function getComputedStylePropValue<Props: {}>(
    wrapper: ReactWrapper<Props>,
    styleProp: string,
): string {
    const domNode = wrapper.getDOMNode();
    return getComputedStyle(domNode).getPropertyValue(styleProp);
}
