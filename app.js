'use strict';
const express = require('express');
const line = require('@line/bot-sdk');
const dao = require('./db/dao');

const config = {
  channelSecret: process.env.LINE_SECRET,
  channelAccessToken: process.env.LINE_ACCESS_TOKEN
};

const app = express();

// Webhookイベントオブジェクトの内容で処理を分ける
// 友人登録された時、DBにIDを登録する処理
// 友人解除された時、DBからIDを削除する処理
app.post('/webhook', line.middleware(config), (req, res) => {

    let eventType = req.body.events[0].type
    console.log('受け取ったイベントタイプ：' + eventType);
    
    switch (eventType) {
      // グループ登録
      case 'follow':
        dao.userInsert(req.body.events[0].source.userId,req.body.events[0].timestamp);
        break;
      // グループ離脱
      case 'unfollow':
        dao.userDelete(req.body.events[0].source.userId,req.body.events[0].timestamp);
        break;
      default:
        console.log('イベントタイプ：' + eventType + ' 予期していないリクエストです');
        break;
    }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running at ${port}`);  
});