export default function(request) {
    return {
        statusCode: 200,
        body: request.query.payload || request.body,
    };
}
