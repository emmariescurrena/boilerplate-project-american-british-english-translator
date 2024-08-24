'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

    const translator = new Translator();

    app.route('/api/translate')
        .post((req, res) => {
            const text = req.body.text;
            const locale = req.body.locale;

            if (text == undefined || locale == undefined) {
                return res.json({ error: 'Required field(s) missing' });
            }
            if (text.length == 0) {
                return res.json({ error: 'No text to translate' });
            }
            if (locale != 'american-to-british' && locale != 'british-to-american') {
                return res.json({ error: 'Invalid value for locale field' });
            }

            const translation = translator.translate(text, locale, true);

            if (translation == text) {
                return res.json({
                    text,
                    translation: 'Everything looks good to me!'
                });
            }

            return res.json({ text, translation });
        });
};
