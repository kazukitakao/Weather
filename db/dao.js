'use strict'


// herokuにデプロイするためにpostgresqlに変更
const sqlite = require('sqlite3').verbose();

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/secret_board',
  {
    logging: false,
    operatorsAliases: false 
  });

function userInsert(userId,timeStamp){

    const db = new sqlite.Database('userInfo.sqlite');
    // SQLを同期的に実行する
    db.serialize( () => {

        db.run('CREATE TABLE IF NOT EXISTS userInfo(userId TEXT primary key,timeStamp TEXT)');
    
        const stmt = db.prepare('INSERT INTO userInfo VALUES (?,?)');
        stmt.run([userId,timeStamp]);
    
        // prepare() で取得したPrepared Statement オブジェクトをクローズする
        stmt.finalize();
    });

    db.close((err) => {
        if (err) {
            console.log(err.message);                
        }
    });
    console.log(userId + 'のデータを' + timeStamp + 'に登録しました');
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

    const db = new sqlite.Database('userInfo.sqlite');
    db.serialize( () => {
        db.run('DELETE FROM userInfo WHERE userId = ?',userId, (err) => {
            if (err) {
                console.log(err.message);                
            }
        });
    });
    db.close( (err) => {
        if (err) {
            console.log(err.message);                
        }
    });
    console.log('解除されたID：' + userId);
}    

module.exports = {
    userInsert:userInsert,
    userDelete:userDelete,
    select:select
}