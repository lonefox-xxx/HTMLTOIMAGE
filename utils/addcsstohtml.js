function addStylesToHTML(htmlString, additionalStyles) {
    const styleTag = '<style>';
    const styleTagEnd = '</style>';

    if (htmlString.includes('<head>')) {
        const modifiedHTML = htmlString.replace(
            /(<head>[\s\S]*?)(<\/head>)/i,
            (match, headStart, headEnd) => {
                const combinedHead = `${headStart}${styleTag}${additionalStyles}${styleTagEnd}${headEnd}`;
                return combinedHead;
            }
        );
        return modifiedHTML;
    } else {
        const modifiedHTML = htmlString.replace(
            /(<html[\s\S]*?>)([\s\S]*?)(<body[\s\S]*?>)/i,
            (match, htmlStart, bodyStart) => {
                const combinedHTML = `${htmlStart}<head>${styleTag}${additionalStyles}${styleTagEnd}</head>${bodyStart}`;
                return combinedHTML;
            }
        );
        return modifiedHTML;
    }
}



module.exports = addStylesToHTML;