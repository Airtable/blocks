/**
 * Helper function that takes in records and returns an array with the names and picture URLs of the attachment field.
 * @param {Object} param
 * @param {Array<Record>} param.records - The records.
 * @param {Field} param.attachmentField - The attachment field.
 * @param {Field} param.nameField - The name field.
 * @return {Array<{recordId: string, name: string, largePictureUrl: string, smallPictureUrl: string}>} - A list of names with pictures.
 */
export default function getListOfNamesWithPictures({records, attachmentField, nameField}) {
    const listOfNamesWithPictures = [];

    for (const record of records) {
        const attachmentCellValue = record.getCellValue(attachmentField);

        let attachmentObj;
        if (attachmentCellValue && attachmentCellValue.length > 0) {
            // Try to get the first attachment object from the cell value.
            attachmentObj = attachmentCellValue[attachmentCellValue.length - 1];
        }

        if (
            !attachmentObj ||
            !attachmentObj.thumbnails ||
            !attachmentObj.thumbnails.large ||
            !attachmentObj.thumbnails.small
        ) {
            // If there are no attachment present, continue without it.
            continue;
        }

        const name = record.getCellValueAsString(nameField);

        if (name.trim() === '') {
            // If there is no useful name, continue without it.
            continue;
        }

        listOfNamesWithPictures.push({
            recordId: record.id,
            name,
            // Store both the large and small urls, so we can load the small one first with `srcset` on the `img`.
            // This makes the game playable on slow load times if the large image takes longer to load.
            largePictureUrl: attachmentObj.thumbnails.large.url,
            smallPictureUrl: attachmentObj.thumbnails.small.url,
        });
    }

    return listOfNamesWithPictures;
}
