exports.handler = async function(event, context) {
    if(event.queryStringParameters.search === 'FAIL') {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Hello World"})
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hello World"})
    };
}