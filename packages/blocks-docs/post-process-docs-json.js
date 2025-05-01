const fs = require('fs');

function iterateItems(item, callback) {
    callback(item);
    if (item.signatures) {
        for (const signature of item.signatures) {
            iterateItems(signature, callback);
        }
    }
    if (item.getSignature) {
        for (const getSignature of item.getSignature) {
            iterateItems(getSignature, callback);
        }
    }
    if (item.children) {
        for (const child of item.children) {
            iterateItems(child, callback);
        }
    }
}

class PlaceholderPathReplacer {
    constructor(replacementPath) {
        this.replacementPath = replacementPath;
    }

    replacePlaceholderPathInExampleText(docsJson) {
        iterateItems(docsJson, item => {
            if (item.comment?.tags) {
                for (const tag of item.comment.tags) {
                    if (tag.tag === 'example') {
                        tag.text = tag.text.replace(
                            /@airtable\/blocks\/\[placeholder-path\]/g,
                            `@airtable/blocks/${this.replacementPath}`,
                        );
                    }
                }
            }
        });
    }
}

class SdkModeTypesReplacer {
    constructor(docsJson) {
        let TableClassId;
        let FieldClassId;
        iterateItems(docsJson, item => {
            if (item.kindString === 'Class' && item.name === 'Table') {
                TableClassId = item.id;
            }
            if (item.kindString === 'Class' && item.name === 'Field') {
                FieldClassId = item.id;
            }
        });
        if (!TableClassId || !FieldClassId) {
            throw new Error('TableClassId or FieldClassId not found');
        }
        this.TableClassId = TableClassId;
        this.FieldClassId = FieldClassId;
    }

    replaceSdkModeTypesWithConcreteTypes(docsJson) {
        iterateItems(docsJson, item => {
            if (item.type) {
                this._replaceSdkModeTypesWithConcreteTypesInType(item.type);
            }
            if (item.parameters) {
                for (const parameter of item.parameters) {
                    this._replaceSdkModeTypesWithConcreteTypesInType(parameter.type);
                }
            }
        });
    }

    _replaceSdkModeTypesWithConcreteTypesInType(type) {
        if (type.type === 'unknown') {
            if (type.name === 'SdkModeT["TableT"]') {
                this._clearExistingProperties(type);
                type.type = 'reference';
                type.name = 'Table';
                type.id = this.TableClassId;
            } else if (type.name === 'SdkModeT["FieldT"]') {
                this._clearExistingProperties(type);
                type.type = 'reference';
                type.name = 'Field';
                type.id = this.FieldClassId;
            }
        }
        if (type.type === 'union') {
            for (const _type of type.types) {
                this._replaceSdkModeTypesWithConcreteTypesInType(_type);
            }
        }
        if (type.typeArguments) {
            for (const typeArgument of type.typeArguments) {
                this._replaceSdkModeTypesWithConcreteTypesInType(typeArgument);
            }
        }
    }

    _clearExistingProperties(obj) {
        for (const key in obj) {
            delete obj[key];
        }
    }
}

function main() {
    const docsJsonFilePath = process.argv[2];
    const placeholderPath = docsJsonFilePath.includes('interface-blocks') ? 'interface' : 'base';
    const file = fs.readFileSync(docsJsonFilePath, 'utf8');
    const docsJson = JSON.parse(file);

    const replacer = new PlaceholderPathReplacer(placeholderPath);
    replacer.replacePlaceholderPathInExampleText(docsJson);

    const sdkModeTypesReplacer = new SdkModeTypesReplacer(docsJson);
    sdkModeTypesReplacer.replaceSdkModeTypesWithConcreteTypes(docsJson);

    fs.writeFileSync(docsJsonFilePath, JSON.stringify(docsJson, null, 2), 'utf8');
}

main();
