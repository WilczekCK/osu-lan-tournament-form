
var utilities = utilities || {};

utilities = {
    osuApiKey: 'YOUR-OSU-API-KEY',
    isSigned: function (players, incomingPlayer) {
        var x = 0;
        for (x; x < players.length; x++) {
            if (incomingPlayer == players[x]) {
                console.log('User like that is already in db')
                return true;
            }
        }
    },
    prepareUser: function (incomingPlayer, formCredentials) {
        if (incomingPlayer[0] == undefined) {
            return undefined;
        }

        playerInfo = {
            nickname: incomingPlayer[0].username,
            id: formCredentials.id,
            pp: incomingPlayer[0].pp_raw,
            email: formCredentials.email,
        }

        return playerInfo
    },
    finalStep: function(result, res){
        if (result) {
            return res.redirect('../success');
        }

        console.log('There is a problem with appending the information')
        return res.redirect('../problem');
    }
}

module.exports = function () {
    return utilities || 'Problem with utilities';
}