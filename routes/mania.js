var express = require('express');
var router = express.Router();
var utilities = require('../controllers/utilityController')();
var googleApi = require('../controllers/apiController')();
const osu = require('osu-call');
osu.give_key(utilities.osuApiKey)

router.get('/', function (req, res, next) {
  //path is a value which tell the form
  //where he have to redirect user
  //to submit the form
  res.render('form', { path: 'mania' })
});

router.post('/add', function (req, res, next) {
  //get all of the players which are already in the
  //google sheets and compare them with new player
  //if true, redirect

  googleApi.getPlayers('GraczeMN')
    .then(result => {
      //first parameter are all users in arrays
      //second parameter is id from form
      if (utilities.isSigned(result, req.body.id) == true) {
        return res.redirect('../problem');
      }

      osu.get_user({ u: req.body.id, m: "3" })
        .then(result => {
          if (utilities.prepareUser(result, req.body)) {
            googleApi.addPlayer(utilities.prepareUser(result, req.body), 'GraczeMN')
              .then(result => {
                utilities.finalStep(result, res);
              });
          }

        })//end of osu promise
    }) //end of google promise
})

module.exports = router;
