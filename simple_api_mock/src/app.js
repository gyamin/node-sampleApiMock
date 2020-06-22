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
// user_structureはユーザオブジェクトのサンプルを指定する。
//構造が明示されることでオブジェクトのイメージが掴みやすくする目的と、データの追加や変更時に構造チェックする目的。別にnullでもいい。
const user_structure = {"id":1,"login_id":"test001@test.com","password":"12345678","last_nmae":"テスト","first_name":"００１","birthday":"2000-01-01"}
const userHandler = new jsonHandler('user', user_structure)
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

// ユーザ検索
app.get('/users/:userId', function (req, res) {
    let user = userHandler.select(parseInt(req.params['userId']))
    res.send(user)
})

// ユーザ削除
app.delete('/users/:userId', function (req, res) {
    userHandler.delete(parseInt(req.params['userId']))
    res.send()
})

// ===  ===

// express起動
app.listen(port)
console.log("listening at localhost:" + port)