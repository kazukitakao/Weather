'use strict'

// herokuにデプロイするためにpostgresqlに変更
const Post = require('./post');

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

function select(){
    return new Promise(function(resolve,reject){

        const db = new sqlite.Database('userInfo.sqlite');
        let userArray = new Array();
    
        db.serialize( () => {
            db.each('SELECT * FROM userInfo',(error , row) => {
                if (error) {
                    console.log('検索に失敗しました：' + error.message);
                    return;
                }
                userArray.push(row.userId);
                console.log('登録されているID：' + row.userId);
                resolve(userArray);
            });
        });
        db.close( (err) => {
            if (err) {
                console.log(err.message);                
            }
        });
    })
}

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