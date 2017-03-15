'use strict'

const mongoose = require('mongoose');
const readline = require('readline');
const r1 = readline.createInterface({input: process.stdin, output: process.stdout});
const config = require('./config.json');

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
    user: config.db.user,
    pass: config.db.password
}).catch(e => {
    console.error(e);
    throw e;
});

let login = '';
let password = '';

r1.question('Логин', answer => {
   login = answer;

    r1.question('Пароль', answer => {
        password = answer;
        r1.close();
    });
});

r1.on('close', () => {
    require('./models/user');

    const User = mongoose.model('user');
    const adminUser = new User({login: login, password: password});

    User
        .findOne({login: login})
        .then(u => {
            if (u) {
                throw new Error('Такой пользователь уже существует');
            }

            return adminUser.save();
        })
        .then(u => console.log('Ok!'), e => console.error(e.message))
        .then(()=> process.exit(0));
});


