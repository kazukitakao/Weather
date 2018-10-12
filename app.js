'use strict';
const express = require('express');
const line = require('@line/bot-sdk');
const dao = require('./db/dao');

const config = {
  channelSecret: process.env.LINE_SECRET,
  channelAccessToken: process.env.LINE_ACCESS_TOKEN
};

const app = express();

// Webhookでデータを受信する
// Webhookイベントオブジェクトの内容で処理を分ける
// ①LINEでメッセージが送られてきた時の処理
// ②友人登録された時、DBにIDを登録する処理
// ③友人解除された時、DBからIDを削除する処理
app.post('/webhook', line.middleware(config), (req, res) => {

    let eventType = req.body.events[0].type
    console.log('受け取ったイベントタイプ：' + eventType);
    
    switch (eventType) {
      // リプライ
      case 'message':
        const client = new line.Client(config); 
        client.replyMessage(req.body.events[0].replyToken,{
          type: 'text',
          text: 'リプライ成功！！'
        });
        break;
      // グループ登録
      case 'follow':
        console.log('受け取った登録ID：' + req.body.events[0].source.userId);
        console.log('受け取った時間：' + req.body.events[0].timestamp);
        dao.userInsert(req.body.events[0].source.userId,req.body.events[0].timestamp);
        break;
      // グループ離脱
      case 'unfollow':
        console.log('解除ID：' + req.body.events[0].source.userId);
        console.log('解除時間：' + req.body.events[0].timestamp);
        dao.userDelete(req.body.events[0].source.userId,req.body.events[0].timestamp);
        break;
      default:
        console.log('予期していないリクエストです');
        break;
    }
});

// ポートを起動サーバの環境変数基準にする
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at ${port}`);  
});