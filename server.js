'use strict';

const line = require('@line/bot-sdk');
const parseString = require('xml2js').parseString;
const dao = require('./db/dao');

const config = {
    channelSecret: process.env.LINE_SECRET,
    channelAccessToken: process.env.LINE_ACCESS_TOKEN
};

const client = new line.Client(config);


/**
 * 天気予報のRSS情報を取得する
 *
 * @param {*} url RSS情報を配信しているサイトURL
 * @returns
 */
function getRSS(url){
    return new Promise((resolve,reject) => {
        let request = require('request');
        
        request(url, function (err, response, body) {
            if (!err && response.statusCode == 200) {

                let message = '';
                parseString(body, function (err, obj) {
                    if (err) { console.log(err); return; }
                    
                    // 東京都の時間ごとの降水確率を取得している
                    let items = obj.weatherforecast.pref[0].area[3].info[0].rainfallchance;
                    let per0to6 = items[0].period[0]._;
                    let per6to12 = items[0].period[1]._;
                    let per12to18 = items[0].period[2]._;
                    let per18to24 = items[0].period[3]._;
                    
                    // 全時間で降水確率が20%未満ならメッセージ送信しない
                    if(items[0].period.every(isBelow20)){
                        message = '';
                    }else{
                        // 文頭と末尾につく文字を設定
                        const sentenceBegin = ['よい朝じゃな！',
                            '昨日はよく眠れたかの？',
                            '二日酔いしとらんかの？',
                            '早起きとはえらいの！',
                            'ちと寝起きが悪いかの？'];
                        const sentenceEnd = ['気を付けて行ってくるのじゃ(^^)',
                            'いい一日を過ごすのじゃぞ(^^)',
                            '雨に負けずに今日も頑張るのじゃ(^^)',
                            '今日も一日楽しむのじゃ(^^)',
                            '楽しいことがあるといいの(^^)'];

                        let attentionWord = '';
                        if(items[0].period.every(isBelow50)){
                            attentionWord = '今日は雨が降るかもしれないから折りたたみ傘があると安心じゃ！';
                        }else{
                            attentionWord = '今日は雨が降りそうだから傘を忘れるでないぞ！';
                        }
                        // テンプレート文字列は改行がそのまま反映される
                        let templeteString = `${sentenceBegin[Math.floor(Math.random() * sentenceBegin.length)]}\r${attentionWord}
                                          降水確率はこんな感じじゃ。\r0〜6時 ${per0to6}%\r6〜12時 ${per6to12}%\r12〜18時 ${per12to18}%\r18〜24時 ${per18to24}%
                                          ${sentenceEnd[Math.floor(Math.random() * sentenceEnd.length)]}`;
                        message = templeteString;
                    }
                });
               resolve(message);
            }
        });
    })
}

/**
 * 配列の要素全ての値が21以上か判定
 *
 * @param {*} currentValue 配列の要素の値
 * @returns 20未満の場合、false。それ以外はtrue
 */
function isBelow20(currentValue){
    return 20 < currentValue;
}


/**
 * 配列の要素全ての値が51以上か判定
 *
 * @param {*} currentValue 配列の要素の値
 * @returns 50未満の場合、false。それ以外はtrue
 */
function isBelow50(currentValue){
    return 50 < currentValue;
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
    process.exit();
}).catch(function onReject(err){
    console.log(err.message);
});