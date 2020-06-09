
## ユーザ一覧取得
```

```

## ユーザの追加
/users にユーザ情報を json で post することでユーザ情報を登録する
```
$ curl -X POST -H "Content-Type: application/json" -d '{"id":2,"login_id":"test002@test.com","password":"12345678","last_nmae":"","first_name":"","birthday":"2000-01-06"}' localhost:3000/users
```
一覧を取得すると、ユーザが追加されている
```
$ curl http://localhost:3000/users
[{"id":1,"login_id":"test001@test.com","password":"12345678","last_nmae":"","first_name":"","birthday":"2000-01-05"},{"id":2,"login_id":"test002@test.com","password":"12345678","last_nmae":"","first_name":"","birthday":"2000-01-06"}]
```