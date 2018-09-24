'use strict';

// LINESDK
const line = require('@line/bot-sdk');
// XMLパース
const parseString = require('xml2js').parseString;

// LINESECRETとTOKEN
const config = {
    channelSecret: 'dda96be6327f93bbbcbd6880821fa397',
    channelAccessToken: 'BYHiPhzvLQBYw/tEMqfHWQyRTSgXMq6hwUVhujkJroYUiDTtvoeLraaEqCDLJdoSpBKNrhBN4vsvqQrYPUwkRMOh6O9SJZsZwDyjnLtcNp4ceWKkviqO2hPnrMUPBuGZLC+2DZ3d42DKXoicx84HzwdB04t89/1O/w1cDnyilFU='
};

const client = new line.Client(config);

function getRSS(url){
    return new Promise(function(resolve,reject){
        let request = require('request');
        
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
                    console.log('取得完了:' + message);
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
