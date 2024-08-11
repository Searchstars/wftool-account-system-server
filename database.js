import { MongoClient } from 'mongodb';
import * as tools from "./tools.js"

const url = 'mongodb://localhost:27017';
const dbName = 'wftool-account-database';

const CLIENT = new MongoClient(url);
let DB = null

let COLLECTION_ACCOUNT = null
let COLLECTION_LOG = null
let COLLECTION_BACKDOOR_REPORT = null

export async function Connect() {
    await CLIENT.connect();

    console.log("Connected successfully to MongoDB");

    DB = CLIENT.db(dbName);
    COLLECTION_ACCOUNT = DB.collection('accounts');
    COLLECTION_LOG = DB.collection('logs')
    COLLECTION_BACKDOOR_REPORT = DB.collection('backdoor_reports')

    WriteLog("INFO", {
        message: "Server Startup Finshed!"
    })
}

export async function Login(username, password) {
    const user = await COLLECTION_ACCOUNT.findOne({
        username,
        password
    })
    if(user){
        return user
    }
    return false
}

export async function WriteLog(type, params) {
    params.type = type
    params.time = tools.getCurrentTimeString()
    console.log("ADD LOG:", params)
    await COLLECTION_LOG.insertOne(params)
}

export async function WriteBackdoorReport(params) {
    if(params.username){
        await COLLECTION_BACKDOOR_REPORT.insertOne(params)
        return true
    }
    await WriteLog("WARN", {
        message: "params invaild when upload backdoor report",
        params: params
    })
}