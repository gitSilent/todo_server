const express = require('express');
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser())
app.use(cors())

let todos = [
    {
        "taskDesc": "todo 1 desc",
        "isCompleted": false
    },

    {
        "taskDesc": "todo 2 desccc",
        "isCompleted": true
    }
];

app.get('/todos', (req,res)=>{
    res.send(todos)
}
)

app.put('/todos', (req,res)=>{
    console.log(req.body)
    todos.push(req.body)
})
app.listen(3500)