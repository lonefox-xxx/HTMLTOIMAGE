function base64ToString(base64String) {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const decodedString = Buffer.from(base64Data, 'base64');
    return decodedString;
}

module.exports = base64ToString