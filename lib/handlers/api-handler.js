const r2 = require("r2");

async function requestSend(url,headers) {
    try {
        return await r2(url).json;
    }
    catch(ex){
        throw ex;
    }
}

module.exports = {
    requestSend
}