const express = require('express')
const fs = require('fs');
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// 起動確認
app.get('/', function (req, res) {
    res.send('Hello World')
})

// ユーザ一覧を返す
app.get('/users', function (req, res) {
    const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
    res.send(users)
})

// ユーザを追加する
app.post('/users/', function (req, res) {
    const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
    users.push(req.body)
    fs.writeFileSync('./data/users.json', JSON.stringify(users));
    res.send()
})

app.listen(3000)