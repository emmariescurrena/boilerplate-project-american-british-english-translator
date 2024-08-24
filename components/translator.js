const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

const americanToBritish = [
    ...Object.entries(americanOnly),
    ...Object.entries(americanToBritishSpelling)
];
const britishToAmerican = [
    ...Object.entries(americanToBritishSpelling).map((wordArr) => wordArr.reverse()),
    ...Object.entries(britishOnly)
];

const americanTitle = Object.entries(americanToBritishTitles);
const britishTitle = Object.entries(americanToBritishTitles).map((wordArr) =>
    wordArr.reverse()
);

const americanTimeRegex = /\d{1,2}:\d{2}/g;
const britishTimeRegex = /\d{1,2}\.\d{2}/g;


class Translator {
    translate(text, locale, highlight = false) {
        const wordTranslation =
            locale == 'american-to-british' ? americanToBritish : britishToAmerican;

        const titleTranslation =
            locale == 'american-to-british' ? americanTitle : britishTitle;

        const [timeTranslation, timeRegex] =
            locale == 'american-to-british'
                ? [{ from: ':', to: '.' }, americanTimeRegex]
                : [{ from: '.', to: ':' }, britishTimeRegex];

        let translation = text;

        for (let word of wordTranslation) {
            let tester = new RegExp(`(?<!-)(\\b${word[0]}\\b)`, 'gi');
            if (tester.test(translation)) {
                let replacement = highlight
                    ? `<span class="highlight">${word[1]}</span>`
                    : word[1];
                translation = translation.replace(tester, replacement);
            }
        }

        for (let title of titleTranslation) {
            let tester = new RegExp(title[0] + '(?=\\s)', 'gi');
            if (tester.test(translation)) {
                let replacement = highlight
                    ? `<span class="highlight">${title[1]}</span>`
                    : title[1];
                translation = translation.replace(tester, replacement);
            }
        }

        let tester = new RegExp(timeRegex);
        if (tester.test(translation)) {
            let timestampsToReplace = translation.match(tester);
            for (let timestamp of timestampsToReplace) {
                let replacement = timestamp.replace(timeTranslation.from, timeTranslation.to);
                if (highlight) {
                    replacement = `<span class="highlight">${replacement}</span>`
                }

                translation = translation.replace(tester, replacement);
            }
        }

        return translation;
    }
}

module.exports = Translator;