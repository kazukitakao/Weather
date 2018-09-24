'use strict';

// expressモジュールをロード
const express = require('express');
// LINESDK
const line = require('@line/bot-sdk');
// XMLパース
const parseString = require('xml2js').parseString;

//const PORT = process.env.PORT || 3000;

// LINESECRETとTOKEN
const config = {
    channelSecret: 'dda96be6327f93bbbcbd6880821fa397',
    channelAccessToken: 'BYHiPhzvLQBYw/tEMqfHWQyRTSgXMq6hwUVhujkJroYUiDTtvoeLraaEqCDLJdoSpBKNrhBN4vsvqQrYPUwkRMOh6O9SJZsZwDyjnLtcNp4ceWKkviqO2hPnrMUPBuGZLC+2DZ3d42DKXoicx84HzwdB04t89/1O/w1cDnyilFU='
};

const client = new line.Client(config);

function getRSS(url){
    return new Promise(function(resolve,reject){
        let request = require('request');
        console.log('start');
        request(url, function (err, response, body) {
            if (!err && response.statusCode == 200) {

                let message = '';

                parseString(body, function (err, obj) {
                    if (err) { console.log(err); return; }
            
                    let date = obj.weatherforecast.pref[0].area[3].info[0].$.date;
                    let items = obj.weatherforecast.pref[0].area[3].info[0].rainfallchance;
                    message = '今日の日付：' + date + '\n';
                    items[0].period.forEach(period => {
                        message += period.$.hour + '時：' + period._ + '% \n'
                    });
                    // message = JSON.stringify({
                    //     type: 'text',
                    //     text: message
                    // });
                    console.log('取得完了:' + message);
                    //console.log(message);
                });
               resolve(message);
            }
        });
    })
}

// データ取得先のURLを設定する
const url = "http://www.drk7.jp/weather/xml/13.xml";

getRSS(url).then(function testMessage(result){

    console.log('非同期テスト:' + result);
    const message = {
      type: 'text',
      text: result
    };
    client.pushMessage('U1c6bab7aa9b25288eab65bfd8e4011c1', message)
        .catch((err) => {
        console.log(err.message);
    });

}).catch(function onReject(err){
    console.log(err.message);
});

// let request = require('request');
// request(url, function (err, response, body) {
//     if (!err && response.statusCode == 200) {
//         analyzeRSS(body);
//     }
// });


// ％によって送信するメッセージを設定する
// 文字列の中に取得した降水確率をFormatする
function analyzeRSS(rss) {
    parseString(rss, function (err, obj) {
        if (err) { console.log(err); return; }

        let date = obj.weatherforecast.pref[0].area[3].info[0].$.date;
        let items = obj.weatherforecast.pref[0].area[3].info[0].rainfallchance;
        
        let message = '今日の日付：' + date + '\n';
        items[0].period.forEach(period => {
            message += period.$.hour + '時：' + period._ + '% \n'
        });
        
        console.log('取得完了：' + message);
        //console.log(message);
    });
};

// プッシュメッセージサンプル
// const message = {
//   type: 'text',
//   text: 'Hello World!'
// };
// console.log(message);

// client.pushMessage('U1c6bab7aa9b25288eab65bfd8e4011c1', message)
//   .catch((err) => {
//       console.log(err.message);
// });



// const app = express();

// app.post('/webhook', line.middleware(config), (req, res) => {
//     console.log(req.body.events);
//     // handleEventが完全に完了したら、json形式で返す
//     Promise
//         .all(req.body.events.map(handleEvent))
//         .then((result) => res.json(result));
// });

// function handleEvent(event) {
//     if (event.type !== 'message' || event.message.type !== 'text') {
//         return Promise.resolve(null);
//     }

//     // テキストメッセージリクエストを行う関数
//     return client.replyMessage(event.replyToken, {
//         type: 'text',
//         text: event.message.text // 実際に返信の言葉を入れる箇所
//     });
// }

// listen()メソッドを実行して3000番ポートで待受
//app.listen(PORT);
// Promiseの詳細なスタックトレースを出力する
//process.on('unhandledRejection', console.dir);
//console.log(`Server running at ${PORT}`);