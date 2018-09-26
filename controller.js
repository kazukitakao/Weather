'use strict';
const http = require('http');
const router = require('./lib/router');
const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelSecret: 'dda96be6327f93bbbcbd6880821fa397',
  channelAccessToken: 'BYHiPhzvLQBYw/tEMqfHWQyRTSgXMq6hwUVhujkJroYUiDTtvoeLraaEqCDLJdoSpBKNrhBN4vsvqQrYPUwkRMOh6O9SJZsZwDyjnLtcNp4ceWKkviqO2hPnrMUPBuGZLC+2DZ3d42DKXoicx84HzwdB04t89/1O/w1cDnyilFU='
};

const app = express();

// Webhookでデータを受信する
// Webhookイベントオブジェクトの内容で処理を分ける
// ①LINEでメッセージが送られてきた時の処理
// ②友人登録された時、DBにIDを登録する処理
// ③友人解除された時、DBからIDを削除する処理
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    switch (req.body.events.type) {
      case 'Message':
        break;
      case 'Follow':
        break;
      case 'Leave':
        break;
      default:
        break;
    }


    // 複数人からのリプライがあることを想定してall？
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }else if(event.type){
}

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);

// ポートを起動サーバの環境変数基準にする
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info('Listening on ' + port);
});