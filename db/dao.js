'use strict'

const Post = require('./post');


/**
 * グループ申請のあったユーザIDを登録
 *
 * @param {*} userId 申請されたユーザID
 * @param {*} timeStamp 申請時間
 */
function userInsert(userId,timeStamp){

    Post.create({
        userId:userId,
        timeStamp:timeStamp
    }).then( () => {
        console.log('DBに登録されました');
    }).catch((err) => {
        console.log('DB登録に失敗しました');
    })
}


/**
 * DBに登録されているユーザID一覧を取得
 *
 * @returns ユーザID一覧を格納した配列
 */
function select(){
    return new Promise(function(resolve,reject){

        let userArray = new Array();
        Post.findAll({
            attributes:['userId']
        }).then( (result) => {
            result.forEach((element) => {
                userArray.push(element.userId);    
            })
            resolve(userArray);
        }).catch((err) => {
            console.log('ID一覧取得に失敗しました');
        });
    })
}


/**
 * グループ離脱申請のあったユーザIDを削除
 *
 * @param {*} userId グループ離脱申請のあったユーザID
 */
function userDelete(userId){

    const filter = {
        where:{
            userId:userId
        }
    }

    Post.destroy(filter).then( () => {
        console.log('DB削除に成功しました');
    }).catch((err) => {
        console.log('DB削除に失敗しました');
    })
}    

module.exports = {
    userInsert:userInsert,
    userDelete:userDelete,
    select:select
}