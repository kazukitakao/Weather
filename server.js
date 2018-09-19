'use strict';

// expressモジュールをロード
const express = require('express');
const line = require('@line/bot-sdk');

const PORT = process.env.PORT || 3000;

// LINESECRETとTOKEN
const config = {
    channelSecret: 'dda96be6327f93bbbcbd6880821fa397',
    channelAccessToken: 'BYHiPhzvLQBYw/tEMqfHWQyRTSgXMq6hwUVhujkJroYUiDTtvoeLraaEqCDLJdoSpBKNrhBN4vsvqQrYPUwkRMOh6O9SJZsZwDyjnLtcNp4ceWKkviqO2hPnrMUPBuGZLC+2DZ3d42DKXoicx84HzwdB04t89/1O/w1cDnyilFU='
};

// 使用可能性のあるライブラリ
// sequeilize DB操作用
// xmlパース
// 


// データ取得先のURLを設定する
const url = "http://www.drk7.jp/weather/xml/13.xml";
// XMLパースしてデータを取得する
// 取得するデータをxpathで指定する
// 雨降るよちゃんだと時間ごとの降水確率を取得
// ％の下限値を設定
// ％によって送信するメッセージを設定する
// 文字列の中に取得した降水確率をFormatする
// 送信先ユーザはIDを配列にして渡す必要がある


// インスタンス化してappに代入
const app = express();

app.post('/webhook',line.middleware(config),(req,res) => {
    console.log(req.body.events);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

// 
const client = new line.Client(config);

function handleEvent(event){
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    // テキストメッセージリクエストを行う関数
    return client.replyMessage(event.replyToken,{
        type: 'text',
        text: event.message.text // 実際に返信の言葉を入れる箇所
    });
}

// listen()メソッドを実行して3000番ポートで待受
app.listen(PORT);
// Promiseの詳細なスタックトレースを出力する
process.on('unhandledRejection', console.dir);
console.log(`Server running at ${ PORT }`);