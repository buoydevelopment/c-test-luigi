var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var Url = require('./models/url');
var shortId = require('shortid');

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

let error = new Error();
const strCount = 6;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/urls', async (req, res) => {

    const longUrl = req.body.url;
    const shortUrl = req.body.short_url == undefined || req.body.short_url == '' ? shortId.generate().slice(0,strCount) : req.body.short_url;
    if (longUrl == undefined || longUrl == '') {
        error.code = 400;
        error.message = 'Bad Request: Url is not present!';
        return res.status(error.code).send({ message: error.message });
    }

    if (shortUrl.length != strCount ) {
        error.code = 406;
        error.message = 'Not Acceptable: ShortCode lenght must be 6!';
        return res.status(error.code).send({ message: error.message });
    }

    const shortUrlObj = await Url.findOne({ short_url: shortUrl });
    if (shortUrlObj) {
        error.code = 409;
        error.message = 'Conflict: The desired shortcode is already in use!';
        return res.status(error.code).send({ message:error.message });
    }

    const longUrlObj = await Url.findOne({ long_url:longUrl });
    if (!longUrlObj) {
        let newUrl = Url({ long_url:longUrl, short_url:shortUrl });
        await newUrl.save();
        return res.send({'short_url': config.webhost + shortUrl});
    }
    return res.send({'short_url': config.webhost + longUrlObj.short_url});

});

app.get('/:code', async (req, res) => {

    const short_url = req.params.code;
    const shortUrlObj = await Url.findOne({ short_url: short_url });
    if (!shortUrlObj) {
        error.code = 404;
        error.message = 'Not Found: Shortcode not found!';
        return res.status(error.code).send({ message: error.message });
    }
    const doc = await Url.findOneAndUpdate({ short_url:short_url }, { last_usage:new Date(), $inc:{ usage_count:1 } }, { "upsert":true, "new":true });
    return res.redirect(doc.long_url);

});

app.get('/:code/stats', async (req, res) => {

    const short_url = req.params.code;
    const doc = await Url.findOne({ short_url: short_url })
    if (!doc) {
        error.message = 'Not Found: Shortcode not found!';
        error.code = 404;
        return res.status(error.code).send({ message:error.message });
    }
    return res.send({
        created_at: doc.created_at,
        last_usage: doc.last_usage,
        usage_count: doc.usage_count
    });

});

var server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
