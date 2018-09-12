'use strict';

// expressモジュールをロード
const express = require('express');
const line = require('@line/bot-sdk');

const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: 'dda96be6327f93bbbcbd6880821fa397',
    channelAccessToken: 'BYHiPhzvLQBYw/tEMqfHWQyRTSgXMq6hwUVhujkJroYUiDTtvoeLraaEqCDLJdoSpBKNrhBN4vsvqQrYPUwkRMOh6O9SJZsZwDyjnLtcNp4ceWKkviqO2hPnrMUPBuGZLC+2DZ3d42DKXoicx84HzwdB04t89/1O/w1cDnyilFU='
};

// インスタンス化してappに代入
const app = express();

app.post('/webhook',line.middleware(config),(req,res) => {
    console.log(req.body.events);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event){
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

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