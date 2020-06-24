# お手軽WebAPIモックの使い方

## はじめに
WebAPIを出来るだけ簡単に作りたい。という、簡単なようで、難しい要望に応えるために、簡単WebAPIアプリケーションのサンプルを作成しました。   
Node.js の express というWebフレームワークで作成しています。        
基本的にできるだけ簡易にWebAPIを実装できることを念頭に、RDBMSなどは利用せず、データは固定のJSONファイルで保持することとしています。   
エンティティ毎に名前をつけたJSONファイルに、配列でオブジェクトを格納しておき、WebAPIを通して、そのデータを取得したり、追加したり、削除したり、更新したりするイメージです。

## セットアップ

### Node環境の構築
以下を参照し、Nodenv 環境を作成ください。Macでは Homebrew が利用できるので、簡単に導入が可能です。
https://github.com/nodenv/nodenv
```
$ nodenv install 12.18.0
$ cd simple_api_mock/src/
$ nodenv local 12.18.0
$ node -v
v12.18.0
```

### モジュールインストール
```
$ npm install
```

### WebAPIサーバの起動
```
$ npm run serve
listening at localhost:3000
```

## 使い方、開発の仕方
src/app.js が全てです。   
expressのチュートリアルレベルの内容ですので見ればわかるかと思います。      
expressはNodeでは一般的なWebフレームワークですので、やろうと思えば、いくらでも複雑に実装は追加できます。（ただ、あまりやると、このモックの目的から外れますが。）

基本的には、app.js に、APIとして必要なエンドポイント(ルーティング)を定義し、定義したルーティングに実装を施し、結果をレスポンスします。
サンプルを確認ください。ですが、./data/json_handler.js がJSONファイルの基本的なIOを処理するようにしていますので、
シンプルでいいのであれば、このクラスを通じてJSONからデータを取得したり、追加したりできます。

## サンプル

### app.jsのソース
``` js
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
```

### 実行例

- ユーザ一覧取得
```
$ curl -X GET localhost:3000/users
[
    {"id":1,"login_id":"test001@test.com","password":"12345678","last_nmae":"","first_name":"","birthday":"2000-01-06"},
    {"id":2,"login_id":"test002@test.com","password":"12345678","last_nmae":"","first_name":"","birthday":"2000-01-06"}
]
```

- ユーザの追加
```
$ curl -X POST -H "Content-Type: application/json" -d '{"id":3,"login_id":"test003@test.com","password":"12345678","last_nmae":"テスト","first_name":"００３","birthday":"2000-01-03"}' localhost:3000/users
```

```
$ curl -X GET localhost:3000/users
[
    {"id":1,"login_id":"test001@test.com","password":"12345678","last_nmae":"","first_name":"","birthday":"2000-01-06"},
    {"id":2,"login_id":"test002@test.com","password":"12345678","last_nmae":"","first_name":"","birthday":"2000-01-06"},
    {"id":3,"login_id":"test003@test.com","password":"12345678","last_nmae":"テスト","first_name":"００３","birthday":"2000-01-03"}
]
```

- ユーザの削除
```
$ curl -X DELETE localhost:3000/users/3
```

```
$ curl -X GET localhost:3000/users
[
    {"id":1,"login_id":"test001@test.com","password":"12345678","last_nmae":"","first_name":"","birthday":"2000-01-06"},
    {"id":2,"login_id":"test002@test.com","password":"12345678","last_nmae":"","first_name":"","birthday":"2000-01-06"}
]
```

- 備品一覧の取得
```
$ curl http://localhost:3000/equipments
[
    {"id":1,"name":"MacBook Pro (16-inch, 2019)","color":"シルバー","manageId":"00001"},
    {"id":2,"name":"MacBook Pro (13-inch, 2019, Two Thunderbolt 3 ports)","color":"スペースグレイ","manageId":"00002"},
    {"id":3,"name":"MacBook Pro (15-inch, 2019)","color":"シルバー","manageId":"00003"},
    {"id":4,"name":"MacBook Pro (13-inch, 2019, Four Thunderbolt 3 ports)","color":"スペースグレイ","manageId":"00004"},
    {"id":5,"name":"MacBook Pro (15-inch, 2018)","color":"シルバー","manageId":"00005"},
    {"id":6,"name":"MacBook Pro (13-inch, 2018, Four Thunderbolt 3 ports)","color":"シルバー","manageId":"00006"},
    {"id":7,"name":"MacBook Pro (15-inch, 2017)","color":"シルバー","manageId":"00007"},
    {"id":8,"name":"MacBook Pro (13-inch, 2017, Four Thunderbolt 3 ports)","color":"シルバー","manageId":"00008"},
    {"id":9,"name":"MacBook Pro (13-inch, 2017, Two Thunderbolt 3 ports)","color":"シルバー","manageId":"00009"},
    {"id":10,"name":"MacBook Pro (15-inch, 2016)","color":"シルバー","manageId":"00010"}
]
```

- ユーザ割当備品の取得
```
$ curl http://localhost:3000/users/1/equipments
[
    {"id":1,"name":"MacBook Pro (16-inch, 2019)","color":"シルバー","manageId":"00001"},
    {"id":2,"name":"MacBook Pro (13-inch, 2019, Two Thunderbolt 3 ports)","color":"スペースグレイ","manageId":"00002"}
]
```