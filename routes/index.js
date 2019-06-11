var express = require('express');
var router = express.Router();
const fs = require('fs');


const { google } = require('googleapis');
var sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'newToken.json';

var googleApi = require('../controllers/apiController')();
const osu = require('osu-call');
osu.give_key('44ba7018c729ead1f41710c166389a52eea4fd80')






/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index')
});

router.get('/problem', function (req, res, next) {
  res.render('problem')
});

router.get('/success', function (req, res, next) {
  res.render('success')
});

module.exports = router;
