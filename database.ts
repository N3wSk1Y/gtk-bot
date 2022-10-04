import mysql from 'mysql';
import request from "request";

const connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER ,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
});

export async function DBRequest(request: string) {
    return new Promise((resolve, reject) => {
        connection.query(request, function (error, results, fields) {
            if (error) reject(error)
            resolve(results)
        });
    })
}

export async function HTTPRequest(options: any) {
    return new Promise(async (resolve, reject) => {
        await request(options, function (error: any, response: any) {
            if (error) reject(error)
            resolve(response.body)
        })
    })
}