import mysql from 'mysql';
import DatabaseConfig from './configurations/database.json'
import request from "request";

const connection = mysql.createConnection({
    host     : DatabaseConfig.HOST,
    user     : DatabaseConfig.USER ,
    password : DatabaseConfig.PASSWORD,
    database : DatabaseConfig.DATABASE
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
    return new Promise((resolve, reject) => {
        request(options, function (error: any, response: any) {
            if (error) reject(error)
            const body = response.body
            resolve(body)
        })
    })
}

