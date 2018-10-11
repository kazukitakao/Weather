'use strict';

// LINESDK
const line = require('@line/bot-sdk');
// XMLパース
const parseString = require('xml2js').parseString;

const dao = require('./db/dao');

// LINESECRETとTOKEN
const config = {
    channelSecret: process.env.LINE_SECRET,
    channelAccessToken: process.env.LINE_ACCESS_TOKEN
};

const client = new line.Client(config);

function getRSS(url){
    return new Promise((resolve,reject) => {
        let request = require('request');
        
        request(url, function (err, response, body) {
            if (!err && response.statusCode == 200) {

                let message;

                parseString(body, function (err, obj) {
                    if (err) { console.log(err); return; }
            
                    let date = obj.weatherforecast.pref[0].area[3].info[0].$.date;
                    let items = obj.weatherforecast.pref[0].area[3].info[0].rainfallchance;
                    message = '今日の日付：' + date + '\n';
                    items[0].period.forEach(period => {
                        message += period.$.hour + '時：' + period._ + '% \n'
                    });
                });
               resolve(message);
            }
        });
    })
}

// データ取得先のURLを設定する
const url = "http://www.drk7.jp/weather/xml/13.xml";

getRSS(url).then((result) => {

    console.log('RSS情報:' + result);
    const message = {
        type: 'text',
        text: result
    };
    dao.select().then((result) => {

        console.log('ユーザ一覧:' + result);

        client.multicast(result, message)
            .catch((err) => {
                console.log(err.message);
            });
    });
}).catch(function onReject(err){
    console.log(err.message);
});