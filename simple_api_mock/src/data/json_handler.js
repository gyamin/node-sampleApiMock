

class JsonHandler {
    constructor(name, structure) {
        this.name = name
        this.structure = structure

        this.jsonPath = "./data" + "/" + this.name + ".json"
    }

    checkStructure(data) {
        if(typeof data !== "object") {
            throw 'the data checked is not object.'
        }

    }

    select() {
        const data = JSON.parse(fs.readFileSync(this.jsonPath, 'utf8'));
        return data
    }

    insert() {
        const data = JSON.parse(fs.readFileSync(this.jsonPath, 'utf8'));
        return data
    }


}