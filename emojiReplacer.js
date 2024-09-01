const emojiTable = {
    '🔑': 'whatever',
};
function replaceEmojis(inputString, defaultChar = '') {
    // Regex to match any emoji
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    // Replace emojis according to the emojiTable
    return inputString.replace(emojiRegex, (match) => {
        return emojiTable[match] || defaultChar;
    });
}

module.exports = replaceEmojis;