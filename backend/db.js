const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    db.run('ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT ""', (err) => {
        if (err) {
            console.error('Ошибка при добавлении колонки password:', err.message);
        } else {
            console.log('Колонка password успешно добавлена');
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             name TEXT NOT NULL,
                                             email TEXT NOT NULL UNIQUE,
                                             password TEXT NOT NULL
        )
    `);
});


module.exports = db;
