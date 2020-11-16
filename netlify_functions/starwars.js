const fetch = require('node-fetch');
exports.handler = async function(event, context, callback) {
    if(event.queryStringParameters.search === 'FAIL') {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Error", query: event.queryStringParameters})
        };
    }

    const checkStatus = (res) => {
    if (res.ok) { // res.status >= 200 && res.status < 300
        return res.json()
    } else {
        throw new Error(res.statusText);
    }
    }

    try {
        const response = await fetch(`https://swapi.dev/api/films/?search=${encodeURIComponent(event.queryStringParameters.search)}`)
        const data = await checkStatus(response)
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(data)
        })
      } catch (error) {
        callback(error)
      }
}