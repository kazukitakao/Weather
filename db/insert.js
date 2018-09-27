'use strict'

const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('userInfo.sqlite');

// SQLを同期的に実行する
db.serialize( () => {
    db.run('CREATE TABLE IF NOT EXISTS userInfo(userID TEXT,timestamp TEXT)');

    const stmt = db.prepare('INSERT INTO userInfo VALUES (?,?)');
    stmt.run(['test','20190927']);

    // prepare() で取得したPrepared Statement オブジェクトをクローズする
    // これをしないとエラー？
    stmt.finalize();

});

db.close();