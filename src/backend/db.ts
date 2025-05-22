import Database from 'better-sqlite3';


const db = new Database('local.db');
db.pragma('foreign_keys = ON');

db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY,name TEXT)`);
db.exec(`CREATE TABLE IF NOT EXISTS files (uri TEXT PRIMARY KEY,user_id INTEGER,FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`);

const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
stmt.run('庄司');

export function appendFileToDb(uri:string,userId:string){
    const appendFileStmt = db.prepare('INSERT INTO files (uri,user_id) VALUES (?,?)')
    appendFileStmt.run(uri,userId)
}


