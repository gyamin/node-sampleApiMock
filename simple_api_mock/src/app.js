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
const userStructure = {"id":1,"login_id":"test001@test.com","password":"12345678","last_nmae":"テスト","first_name":"００１","birthday":"2000-01-01"}
const userHandler = new jsonHandler('user', userStructure)
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

// === 備品 ===
const equipmentStructure = {"id": 1, "name": "MacBook Pro (16-inch, 2019)", "color":  "シルバー", "manageId":  "00001"}
const equipmentHandler = new jsonHandler('equipment', equipmentStructure)
// 備品一覧取得
app.get('/equipments', function (req, res) {
    const equipments = equipmentHandler.select()
    res.send(equipments)
})

// === ユーザ備品 ===
const userEquipmentStructure = {"id": 1, "user_id": 1, "equipment_id": 1}
const userEquipmentHandler = new jsonHandler('user_equipment', userEquipmentStructure)

// 特定のユーザが所有する備品を返す
// ちょっとこういう話になってくるとRDBMSを登場させたくなってくるが、jsonで頑張るとこんな感じ
app.get('/users/:userId/equipments', function (req, res) {
    // selectByKeyメソッドで、対象のjsonからkeyがvalueに一致する値を取得できる。
    // ここでは、user_idというキーの値が、urlの:userIdで指定されるユーザidの値と同じものを取得している。
    const userEquipmentsMap = userEquipmentHandler.selectByKey("user_id", parseInt(req.params['userId']))

    let userEquipments = []
    userEquipmentsMap.forEach(function(item){
        let equipment = equipmentHandler.select(item["equipment_id"])
        userEquipments.push(equipment)
    })

    res.send(userEquipments)
})

// express起動
app.listen(port)
console.log("listening at localhost:" + port)