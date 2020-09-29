import React, {useState, useEffect, useRef} from 'react';
import {css} from 'emotion';
import {values as objectValues} from '../src/private_utils';
import {iconNames, IconName, deprecatedIconNameToReplacementName} from '../src/ui/icon_config';
import Icon, {iconStylePropTypes} from '../src/ui/icon';
import theme from '../src/ui/theme/default_theme';
import Text from '../src/ui/text';
import Box from '../src/ui/box';
import Example from './helpers/example';
import Input from '../src/ui/input';
import cssHelpers from '../src/ui/css_helpers';

const iconNamesArray = objectValues(iconNames);

const wrapperClassName = css({
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
});
const radioGroupClassName = css({
    display: 'flex',
    flexWrap: 'wrap',
    flex: 'auto',
    flexGrow: 0,
    overflowY: 'auto',
    position: 'relative',
    outline: 'none',
});
const iconButtonClassName = css({
    appearance: 'none',
    border: 'none',
    outline: 'none',
    width: '100%',
    height: '100%',
    borderRadius: theme.radii.default,
    color: theme.textColors.default,
    '&:hover': {
        backgroundColor: theme.colors.lightGray1,
    },
    ['&[data-checked="true"]']: {
        backgroundColor: theme.colors.lightGray2,
    },
});

function SelectableIconWithLabel({
    iconName,
    size,
    isChecked,
    onClick,
}: {
    iconName: IconName;
    size: number;
    isChecked: boolean;
    onClick: () => unknown;
}) {
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const {current} = ref;
        if (current && isChecked) {
            const parent = current.parentNode as HTMLElement;
            const currentBottomOffset = current.offsetTop + current.clientHeight;

            if (currentBottomOffset > parent.offsetHeight + parent.scrollTop) {
                parent.scrollTop = currentBottomOffset - parent.offsetHeight + 16;
            } else if (current.offsetTop < parent.scrollTop) {
                parent.scrollTop = current.offsetTop - 16;
            }
        }
    }, [isChecked]);

    return (
        <Box ref={ref} width="20%" height="100px" padding={2} style={{boxSizing: 'border-box'}}>
            <button
                id={iconName}
                key={iconName}
                className={iconButtonClassName}
                data-checked={isChecked}
                onClick={onClick}
            >
                <Icon name={iconName} size={size} margin={2} suppressWarning={true} />
                <Text size="small" className={cssHelpers.TRUNCATE}>
                    {iconName}
                </Text>
            </button>
        </Box>
    );
}

export default function IconExample() {
    const [searchQuery, setSearchQuery] = useState('');
    const preppedSearchQuery = searchQuery
        .toLowerCase()
        .trim()
        .split(' ')
        .join('');
    const filteredIconNamesArray = iconNamesArray.filter(name => {
        return name.toLowerCase().includes(preppedSearchQuery);
    });

    const [checkedIconName, setCheckedIconName] = useState<IconName | null>(
        filteredIconNamesArray.length ? filteredIconNamesArray[0] : null,
    );

    useEffect(() => {
        if (!filteredIconNamesArray.includes(checkedIconName as any)) {
            setCheckedIconName(filteredIconNamesArray.length ? filteredIconNamesArray[0] : null);
        }
    }, [searchQuery.trim(), filteredIconNamesArray, checkedIconName]);

    function _checkNextIcon(jump: number) {
        const currentIndex = checkedIconName ? filteredIconNamesArray.indexOf(checkedIconName) : 0;
        const nextIndex = (currentIndex + jump) % filteredIconNamesArray.length;
        setCheckedIconName(filteredIconNamesArray[nextIndex]);
    }
    function _checkPreviousIcon(jump: number) {
        const currentIndex = checkedIconName ? filteredIconNamesArray.indexOf(checkedIconName) : 0;
        if (currentIndex - jump < 0) {
            setCheckedIconName(filteredIconNamesArray[filteredIconNamesArray.length - jump]);
        } else {
            setCheckedIconName(filteredIconNamesArray[currentIndex - jump]);
        }
    }

    return (
        <Example
            options={{
                size: {
                    type: 'selectButtons',
                    label: 'Size',
                    options: [12, 16, 20],
                    defaultValue: 16,
                },
            }}
            styleProps={Object.keys(iconStylePropTypes)}
            renderCodeFn={values => {
                let exampleCode;
                let deprecatedWarning = '';
                if (checkedIconName) {
                    if (deprecatedIconNameToReplacementName.has(checkedIconName)) {
                        deprecatedWarning = '// DEPRECATED';
                        const alternative = deprecatedIconNameToReplacementName.get(
                            checkedIconName,
                        );
                        if (alternative) {
                            deprecatedWarning += `: use <Icon name="${alternative}" .../> instead.\n`;
                        }
                    }
                    exampleCode = `
                        const IconExample = () => {
                            return (<Icon name="${checkedIconName}" size={${values.size}} />)
                        }
                    `;
                } else {
                    exampleCode = `// No icon selected.`;
                }
                return `
                    import React from 'react';
                    import {Icon} from '@airtable/blocks/ui';

                    ${deprecatedWarning}
                    ${exampleCode}
                `;
            }}
        >
            {values => {
                return (
                    <div
                        className={wrapperClassName}
                        onKeyDown={e => {
                            if (e.ctrlKey || e.altKey || e.metaKey) {
                                return;
                            }
                            switch (e.key) {
                                case 'ArrowRight':
                                    _checkNextIcon(1);
                                    e.preventDefault();
                                    break;
                                case 'ArrowDown':
                                    _checkNextIcon(5);
                                    e.preventDefault();
                                    break;
                                case 'ArrowLeft':
                                    _checkPreviousIcon(1);
                                    e.preventDefault();
                                    break;
                                case 'ArrowUp':
                                    _checkPreviousIcon(5);
                                    e.preventDefault();
                                    break;
                            }
                        }}
                    >
                        <Box padding={3} borderBottom="thick" flex="none">
                            {/* TODO (jay): This should be a combobox, but we don't allow the right aria props. */}
                            <Input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search for icons..."
                            />
                        </Box>
                        <div
                            className={radioGroupClassName}
                            tabIndex={0}
                            role="listbox"
                            aria-label="Icons"
                            aria-activedescendant={checkedIconName || undefined}
                        >
                            {filteredIconNamesArray.length > 0 ? (
                                <React.Fragment>
                                    {filteredIconNamesArray.map(iconName => {
                                        return (
                                            <SelectableIconWithLabel
                                                key={iconName}
                                                iconName={iconName}
                                                size={values.size}
                                                isChecked={iconName === checkedIconName}
                                                onClick={() => setCheckedIconName(iconName)}
                                            />
                                        );
                                    })}
                                </React.Fragment>
                            ) : (
                                <Text textAlign="center" margin={4} width="100%">
                                    No results
                                </Text>
                            )}
                        </div>
                    </div>
                );
            }}
        </Example>
    );
}
