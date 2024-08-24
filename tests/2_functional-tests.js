const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {

    test('Translation with text and locale fields', function (done) {
        chai
            .request(server)
            .post('/api/translate')
            .send({
                text: 'brekky',
                locale: 'british-to-american'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.text, 'brekky');
                assert.equal(
                    res.body.translation,
                    '<span class="highlight">breakfast</span>'
                );
                done();
            });
    });

    test('Translation with text and invalid locale field', function (done) {
        chai
            .request(server)
            .post('/api/translate')
            .send({
                text: 'breakfast',
                locale: 'american-to-japanese'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid value for locale field');
                done();
            });
    });

    test('Translation with missing text field', function (done) {
        chai
            .request(server)
            .post('/api/translate')
            .send({
                locale: 'american-to-british'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Translation with missing text field', function (done) {
        chai
            .request(server)
            .post('/api/translate')
            .send({
                text: 'breakfast'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Translation with missing locale field', function (done) {
        chai
            .request(server)
            .post('/api/translate')
            .send({
                text: '',
                locale: 'american-to-british'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'No text to translate');
                done();
            });
    });

    test('Translation with text that needs no translation', function (done) {
        chai
            .request(server)
            .post('/api/translate')
            .send({
                text: 'banana',
                locale: 'american-to-british'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.text, 'banana');
                assert.equal(res.body.translation, 'Everything looks good to me!');
                done();
            });
    });

});
