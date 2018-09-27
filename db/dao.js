'use strict'

const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('userInfo.sqlite');

function insert(){

    // SQLを同期的に実行する
    db.serialize( () => {

        db.run('CREATE TABLE IF NOT EXISTS userInfo(userID TEXT,timestamp TEXT)');
    
        const stmt = db.prepare('INSERT INTO userInfo VALUES (?,?)');
        //stmt.run(['test','20190927']);
    
        // prepare() で取得したPrepared Statement オブジェクトをクローズする
        // これをしないとエラー？
        stmt.finalize();
    
    });
    db.close(); 
}

function select(){
    db.serialize( () => {
        db.each('SELECT * FROM userInfo',(error , row) => {
            if (error) {
                console.log('検索に失敗しました：' + error.message);
                return;
            }
            console.log('登録されているID：' + row.userID);
        });
    });
    db.close();
}

//insert();
select();

module.exports = {
    insert:insert,
    select:select
}