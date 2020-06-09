# 環境構築

## 事前準備
### nodeバージョン確認
```
$ node -v
v12.18.0
```

### npmパッケージインストール
```
$ npm install
```

## mockアプリケーションの起動

### アプリケーション起動
```
$ node app.js 
```

### クライアントからアクセス
```
$ curl http://localhost:3000/
Hello World
```

## (参考)初期開発時npmパッケージ追加
### expressの導入
```
$ cd ./src
$ npm install express --save-dev
```

### jsetの導入
```
$ cd ./src
$ npm install jest --save-dev
```


