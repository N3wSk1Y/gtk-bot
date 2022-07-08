import mysql from 'mysql';
import DatabaseConfig from './configurations/database.json'

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
