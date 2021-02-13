function nullishCoalescing(value) {
    return value ?? 0;
}

function optionalChaining(value) {
    return value?.method();
}

export class ClassProperties {
    name = optionalChaining({method: nullishCoalescing.bind(null, '')});
}
