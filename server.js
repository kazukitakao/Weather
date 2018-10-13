'use strict';

const line = require('@line/bot-sdk');
const parseString = require('xml2js').parseString;
const dao = require('./db/dao');

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

                let message = '';
                parseString(body, function (err, obj) {
                    if (err) { console.log(err); return; }
                    
                    // 東京都の時間ごとの降水確率を取得している
                    let date = obj.weatherforecast.pref[0].area[3].info[0].$.date;
                    let items = obj.weatherforecast.pref[0].area[3].info[0].rainfallchance;
                    let per6to12 = items[0].period[1]._;
                    let per12to18 = items[0].period[2]._;
                    let per18to24 = items[0].period[3]._;

                    // 表示下限値
                    let minPer = 20;
                    // 文頭と末尾につく文字を設定
                    const sentenceBegin = ['いい朝だね！', 
                                           '今日もよく眠れた？', 
                                           '二日酔い大丈夫？', 
                                           '早起きしてえらいね！', 
                                           'いつもより起きるのちょっと遅いんじゃない？'];
                    const sentenceEnd = ['気を付けて行ってきてね(^^)', 
                                         'いい一日を過ごしてね(^^)', 
                                         '雨に負けずに今日も頑張ってね(^^)', 
                                         '今日も一日楽しんでいこうね(^^)', 
                                         '楽しいことがありますように(^^)'];
                    const word3 = '今日は雨が降りそうだから傘を忘れないでね！'

                    // テンプレート文字列は改行がそのまま反映される
                    let templeteString = `${sentenceBegin[Math.floor(Math.random() * sentenceBegin.length)]} ${word3} 降水確率はこんな感じだよ。
                                          6〜12時 ${per6to12}%\n12〜18時${per12to18}%\n18〜24時 ${per18to24}%
                                          ${sentenceEnd[Math.floor(Math.random() * sentenceEnd.length)]}`;
                    message = templeteString;
                    // items[0].period 00-06時の降水確率で表示させるか判断
                    // 頭と最後に文字を結合
                    // 降水確率の比較方法 時間は配列
                    // 配列の中の値が範囲内かどうか判定
                    // 範囲 0〜19以下 20〜49以下 50〜 
                    // if(items[0].period.every(isBelow20)){

                    // }else{
                    //     // 快晴のパターン
                    // }
                    // message = '今日の日付：' + date + '\n';
                    // items[0].period.forEach(period => {
                    //     message += period.$.hour + '時：' + period._ + '% \n'
                    // });
                });
               resolve(message);
            }
        });
    })
}

const url = "http://www.drk7.jp/weather/xml/13.xml";

getRSS(url).then((result) => {

    const message = {
        type: 'text',
        text: result
    };
    dao.select().then((result) => {
        client.multicast(result, message)
            .catch((err) => {
                console.log(err.message);
            });
    });
}).catch(function onReject(err){
    console.log(err.message);
});


/**
 *
 *
 * @param {*} currentValue
 * @returns
 */
function isBelow20(currentValue){
    return 20 >= currentValue;
}


/**
 *
 *
 * @param {*} currentValue
 * @returns
 */
function isBelow50(currentValue){
    return 50 >= currentValue;
}