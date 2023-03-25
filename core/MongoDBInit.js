import { MongoClient } from "mongodb"
const url = `mongodb+srv://root:password@mongo:27017/marketdb`

const MongoDBInit = () => {
    MongoClient.connect(url, (err, db) => {
        if(err) throw err;
        console.log("Mongo/Database => 'markets' Created!");
        db.close();
    })
}

export default MongoDBInit;