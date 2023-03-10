const express = require('express');
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser')
var fileupload = require("express-fileupload");
const {MongoClient, ObjectId} = require('mongodb')

const uri = "mongodb://localhost:27017";
let db;
let col;

async function connectMongo(){
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("todo_db");
    col = db.collection("todos");
    let col_name = "todos";
   
}
connectMongo()

app.use(fileupload());

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {
    extended: true,
    limit: '50mb'
} ) );

app.use(cors())

app.get('/todos', (req,res)=>{
    col.find().toArray()
    .then((response)=>{
        res.send(response)
    })
}
)

app.post('/todos', (req,res)=>{
    // col.insertOne(req.body)
    // .then((data)=>{
    //     res.send(data)
    // })
    let file,prefix;
    try{
        file = req.files.file;
        console.log("request body: ", req.body)
        console.log("request file: ", file)
    
        prefix = `data:image/${file['name'].split(".")[file['name'].split(".").length - 1]};base64`;
    }catch(e){
        console.log(e)
    }

    col.insertOne({
        'taskDesc': req.body['taskDesc'],
        'isCompleted': req.body['isCompleted'] === "true" ? true : false,
        'image': req.files ? {
            base64Img : file.data,
            imgName : file.name,
            prefix : prefix
        }: ""
        
    }).then((data)=>{
        res.send(data)

    })
})

app.put('/todos',(req,res)=>{
    col.updateOne(
        {"_id" : new ObjectId(req.body['todoId'])}, 
        {
        "$set":{
            'isCompleted': req.body['changeTo']
            }
        } 
    ).then((data)=>{
        res.send(data)
    })

})

app.delete('/todos', (req,res)=>{
    
    col.deleteOne(
        {
            "_id" : new ObjectId (req.body["todoId"])
        }
    ).then((data)=>{
        res.send(data)
    })
})

app.listen(3500)