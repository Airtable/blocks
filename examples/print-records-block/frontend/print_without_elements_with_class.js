import {loadCSSFromString} from '@airtable/blocks/base/ui';

export default function printWithoutElementsWithClass(className) {
    const printStyles = loadCSSFromString(`
        @media print {
            .${className} {
                display: none !important;
            }
    `);

    window.print();
    printStyles.remove();
}
