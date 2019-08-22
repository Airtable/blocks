export default function(event) {
    return {
        statusCode: 200,
        body: event.body,
    };
}
