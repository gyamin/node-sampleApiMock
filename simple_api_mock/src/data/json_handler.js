const fs = require('fs');

class JsonHandler {
    constructor(name, structure) {
        this.name = name
        this.structure = structure

        this.jsonPath = "./data" + "/" + this.name + ".json"
    }

    checkStructure(object) {
        if(typeof object !== "object") {
            throw '対象がオブジェクト形式でありません。'
        }
        for(let key of Object.keys(object)) {
            // keyが構造設定に存在しない場合エラー
            if(Object.keys(this.structure).indexOf(key) === -1) {
                throw key + ' は想定されないキーです。'
            }

            // TODO 今後各種チェックは増やしても良い
            // keyの値が構造設定の型とあっていない場合エラー
        }
    }

    readJson() {
        return JSON.parse(fs.readFileSync(this.jsonPath, 'utf8'));
    }

    writeJson(data) {
        fs.writeFileSync(this.jsonPath, JSON.stringify(data));
    }

    select(id=null) {
        if(id) {
            const data = this.readJson()
            const index = data.findIndex((v) => v.id === id);
            if(index === -1) {
                return []
            }
            return data[index]
        }else{
            return this.readJson()
        }
    }

    insert(object) {
        this.checkStructure(object)
        const data = this.readJson()
        data.push(object)
        this.writeJson(data)
    }

    update(id, object) {
        this.checkStructure(object)
        const data = this.readJson()

        // idに合致する要素のインデックスを取得
        const index = data.findIndex((v) => v.id === id);
        if(index === -1) {
            return false
        }
        // 更新
        data[index] = object
        this.writeJson(data)
        return true
    }

    delete(id) {
        const data = this.readJson()
        // idに合致する要素のインデックスを取得
        const index = data.findIndex((v) => v.id === id);
        if(index === -1) {
            return false
        }
        data.splice(index, 1)
        this.writeJson(data)
        return true
    }
}
module.exports = JsonHandler;