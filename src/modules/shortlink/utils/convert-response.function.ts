export function convertResponse(statusCode, message = "", result = {}) {
    return {
        statusCode, result, message
    }
}