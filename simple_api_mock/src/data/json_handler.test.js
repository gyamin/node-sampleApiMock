const JsonHandler = require('./json_handler');

const user_sample = {"id":1,"login_id":"test001@test.com","password":"12345678","last_nmae":"","first_name":"","birthday":"2000-01-06"}
let userHandler = new JsonHandler('user', user_sample)

test('JsonHandler.select()', () => {
    let users = userHandler.select()
    expect(users.length).toBe(2)
    expect(users[0].login_id).toBe("test001@test.com")
});

test('JsonHandler.select(1)', () => {
    let user = userHandler.select(1)
    expect(user.login_id).toBe("test001@test.com")
});

test('JsonHandler.insert()', () => {
    userHandler.insert({"id":3,"login_id":"test003@test.com","password":"12345678","last_nmae":"テスト","first_name":"００３","birthday":"2000-01-03"})
    let target = userHandler.select(3)
    expect(target.login_id).toBe("test003@test.com")
});

test('JsonHandler.update()', () => {
    userHandler.update(3, {"id":3,"login_id":"test003-2@test.com","password":"12345678","last_nmae":"テスト","first_name":"００３","birthday":"2000-01-03"})
    let target = userHandler.select(3)
    expect(target.login_id).toBe("test003-2@test.com")
});

test('JsonHandler.delete()', () => {
    userHandler.delete(3)
    let users = userHandler.select()
    expect(users.length).toBe(2)

    let target = userHandler.select(3)
    expect(target.length).toBe(0)
});


