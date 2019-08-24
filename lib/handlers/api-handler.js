const r2 = require("r2");

async function requestSend(url,headers) {
    try {
        const response = await r2(url).json;
        return response
    }
    catch(ex){
        throw ex;
    }
}

module.exports = {
    requestSend
}