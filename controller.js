'use strict';
//const http = require('http');
//const router = require('./lib/router');
const express = require('express');
const line = require('@line/bot-sdk');
const dao = require('./db/dao');

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

    let eventType = req.body.events[0].type
    switch (eventType) {
      // リプライ
      case 'Message':
        break;
      // グループ登録
      case 'follow':
        console.log('受け取った登録ID：' + req.body.events[0].source.userId);
        console.log('受け取った時間：' + req.body.events[0].timestamp);
        //dao.insert(userId,timeStamp);
        break;
      // グループ離脱
      case 'unfollow':

        break;
      default:
        break;
    }


    // 複数人からのリプライがあることを想定してall？
    // Promise
    //   .all(req.body.events.map(handleEvent))
    //   .then((result) => res.json(result));
});

// const client = new line.Client(config);

// function handleEvent(event) {
//   if (event.type !== 'message' || event.message.type !== 'text') {
//     return Promise.resolve(null);
//   }else if(event.type){
// }

//   return client.replyMessage(event.replyToken, {
//     type: 'text',
//     text: event.message.text //実際に返信の言葉を入れる箇所
//   });
// }

// ポートを起動サーバの環境変数基準にする
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at ${port}`);  
});

// const port = process.env.PORT || 8000;
// server.listen(port, () => {
//   console.info('Listening on ' + port);
// });req.