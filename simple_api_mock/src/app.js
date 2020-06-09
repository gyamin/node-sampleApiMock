const express = require('express')
const port = 3000
const fs = require('fs');
const bodyParser = require('body-parser')
const jsonHandler = require('./data/json_handler')

const app = express()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// 起動確認
app.get('/', function (req, res) {
    res.send('Hello World')
})

// === ユーザ ===
const user_sample = {"id":1,"login_id":"test001@test.com","password":"12345678","last_nmae":"テスト","first_name":"００１","birthday":"2000-01-01"}
const userHandler = new jsonHandler('user', user_sample)
// ユーザ一覧取得
app.get('/users', function (req, res) {
    const users = userHandler.select()
    res.send(users)
})

// ユーザ追加
app.post('/users/', function (req, res) {
    userHandler.insert(req.body)
    res.send()
})

// ユーザ削除
app.delete('/users/', function (req, res) {
    userHandler.delete(req.body.id)
    res.send()
})

// === ニュース ===

// express起動
app.listen(port)
console.log("listening at localhost:" + port)