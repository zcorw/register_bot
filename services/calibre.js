const createDatabase = require('../database/calibre');
const pbkdf2 = require('pbkdf2');
const { randomString } = require('../utils');

function create(username) {
  const password = randomString();
  const salt = randomString(8);
  const derivedKey = pbkdf2.pbkdf2Sync(password, salt, 150000, 32, 'sha256').toString('hex');

  return createDatabase().then((db) => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM user WHERE nickname = "${username}"`, function (err, rows) {
        if (err) {
          reject(err);
          return;
        }
        if (rows && rows.length !== 0) {
          reject(new Error('该邮箱已注册'));
          return;
        }
        db.run('INSERT INTO user (nickname, email, password, role, locale, sidebar_view, default_language, mature_content, kindle_mail) VALUES ($name, $name, $password, 274, "en", 197053, "all", 1, "")', {
          $name: username,
          $password: `pbkdf2:sha256:150000$${salt}$${derivedKey}`,
        }, (err) => {
          if (err) {
            if (/UNIQUE constraint failed/.test(err.message)) {
              reject(new Error('该邮箱已注册'));
            } else {
              reject(err);
            }
          } else {
            resolve(password)
          }

        });
      });
    })

  });
}

module.exports.create = create