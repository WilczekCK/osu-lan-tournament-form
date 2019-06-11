const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
var sheets = google.sheets('v4');

//Credentials to log-in into the google api
//straight from developers.google.com
//without it you won't save it to docs
var googleCredentials = require('../private/credentials.json');
var googleApi = googleApi || {};

googleApi = {
    settings: {
        SCOPES: ['https://www.googleapis.com/auth/spreadsheets'],
        TOKEN_PATH: 'newToken.json',
        CREDENTIALS: 'private/credentials.json',
        SPREADSHEET: 'SHEET-ID'
    },
    getPlayers: function (gameMode) {
        var selectedGameMode = gameMode //name of sheet in google sheets

        return new Promise(function (resolve, reject) {
            // Load client secrets from a local file.
            fs.readFile(googleApi.settings.CREDENTIALS, (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                // Authorize a client with credentials, then call the Google Sheets API.
                authorize(JSON.parse(content), listMajors);
            });


            function authorize(credentials, callback) {
                const { client_secret, client_id, redirect_uris } = credentials.installed;
                const oAuth2Client = new google.auth.OAuth2(
                    client_id, client_secret, redirect_uris[0]);

                // Check if we have previously stored a token.
                fs.readFile(googleApi.settings.TOKEN_PATH, (err, token) => {
                    if (err) return getNewToken(oAuth2Client, callback);
                    oAuth2Client.setCredentials(JSON.parse(token));
                    callback(oAuth2Client);
                });
            }

            function getNewToken(oAuth2Client, callback) {
                const authUrl = oAuth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: googleApi.settings.SCOPES,
                });
                console.log('Authorize this app by visiting this url:', authUrl);
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                rl.question('Enter the code from that page here: ', (code) => {
                    rl.close();
                    oAuth2Client.getToken(code, (err, token) => {
                        if (err) return console.error('Error while trying to retrieve access token', err);
                        oAuth2Client.setCredentials(token);

                        fs.writeFile(googleApi.settings.TOKEN_PATH, JSON.stringify(token), (err) => {
                            if (err) return console.error(err);
                            console.log('Token stored to', googleApi.settings.TOKEN_PATH);
                        });
                        callback(oAuth2Client);
                    });
                });
            }


            //Prints all of the values in sheet which are in ROW 0 (first row)
            function listMajors(auth) {
                const sheets = google.sheets({ version: 'v4', auth });
                sheets.spreadsheets.values.get({
                    spreadsheetId: googleApi.settings.SPREADSHEET,
                    range: selectedGameMode,
                }, (err, res) => {
                    if (err) return console.log('The API returned an error: ' + err);
                    const rows = res.data.values;
                    if (rows.length) {
                        var allPlayers = [];

                        //ID OF PLAYERS -- ROWS FROM GOOGLE SHEETS
                        //Make an array to make it simple
                        //in this case it's the first row, which contains
                        //IDS of players
                        rows.map((row) => {
                            allPlayers.push(`${row[0]}`) 
                        });

                        resolve(allPlayers);
                    } else {
                        console.log('No data found.');
                    }
                });
            }
        })
    },
    addPlayer: function (playerInfo, sheetName) {
        var incomingPlayer = playerInfo;
        var googleSheet = sheetName;
        
        return new Promise(function (resolve, reject) {


            // Load client secrets from a local file.
            fs.readFile(googleApi.settings.CREDENTIALS, (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                // Authorize a client with credentials, then call the Google Sheets API.
                authorize(JSON.parse(content), listMajors);
            });

            function authorize(credentials, callback) {
                const { client_secret, client_id, redirect_uris } = credentials.installed;
                const oAuth2Client = new google.auth.OAuth2(
                    client_id, client_secret, redirect_uris[0]);

                // Check if we have previously stored a token.
                fs.readFile(googleApi.settings.TOKEN_PATH, (err, token) => {
                    if (err) return getNewToken(oAuth2Client, callback);
                    oAuth2Client.setCredentials(JSON.parse(token));
                    callback(oAuth2Client);
                });
            }

            function getNewToken(oAuth2Client, callback) {
                const authUrl = oAuth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: googleApi.settings.SCOPES,
                });
                console.log('Authorize this app by visiting this url:', authUrl);
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                rl.question('Enter the code from that page here: ', (code) => {
                    rl.close();
                    oAuth2Client.getToken(code, (err, token) => {
                        if (err) return console.error('Error while trying to retrieve access token', err);
                        oAuth2Client.setCredentials(token);
                        // Store the token to disk for later program executions
                        fs.writeFile(googleApi.settings.TOKEN_PATH, JSON.stringify(token), (err) => {
                            if (err) return console.error(err);
                            console.log('Token stored to', googleApi.settings.TOKEN_PATH);
                        });
                        callback(oAuth2Client);
                    });
                });
            }

            function listMajors(authClient) {
                var request = {
                    spreadsheetId: googleApi.settings.SPREADSHEET,
                    range: googleSheet,
                    valueInputOption: 'RAW',
                    insertDataOption: 'INSERT_ROWS',
                    resource: {
                        values: [
                            [incomingPlayer.id, incomingPlayer.nickname, incomingPlayer.email, incomingPlayer.pp] //columns names in docs
                        ],
                    },
                    auth: authClient
                };

                sheets.spreadsheets.values.append(request, function (err, response) {
                    if (err) {
                        console.error(err);
                        resolve(false)
                    }

                    resolve(true)
                    
                });
            }
        })//end of promise
    }
}

module.exports = function () {
    return googleApi || 'Problem with google api docs connection!';
}