import { DBRequest } from "./database";

export enum OperationTypes {
    iMarket = 'imarket_balance',
    Bank = 'bank_balance'
}

export enum HistoryTypes {
    Transfer = 'transfer_history',
    Orders = 'orders_history',
    Topup = 'topup_history',
    Withdraw = 'withdraw_history',
}

export async function accountExists(userid: number): Promise<boolean> {
    const count = await DBRequest(`SELECT count(id) as count
                                       FROM \`users\`
                                       WHERE id = '${userid}'`)
    return (count as any[])[0].count !== 0
}

export async function getBalance(userid: number): Promise<number> {
    if (!await accountExists(userid))
        return
    const response = await DBRequest(`SELECT * FROM \`users\` WHERE id = ${userid}`) as any[]
    return response[0].balance;
}

export async function topupBalance (userid: number, value: number, reason: string): Promise<number> {
    if (!await accountExists(userid))
        return
    const balance = (await DBRequest(`SELECT * FROM users WHERE id = ${userid}`) as any[])[0].balance as number

    await DBRequest(`UPDATE \`users\` SET balance = ${balance+value} WHERE \`users\`.\`id\` = ${userid}`)
    const response = await DBRequest(`SELECT * FROM \`users\` WHERE id = ${userid}`) as any[]
    return response[0].balance;
}

export async function transferBalance (userid: number, value: number, target: OperationTypes, reason: string): Promise<number> {
    if (!await accountExists(userid))
        return
    const balance = (await DBRequest(`SELECT * FROM users WHERE id = ${userid}`) as any[])[0].balance as number
    const imarketBalance = (await DBRequest(`SELECT * FROM stats WHERE config_id = 1`) as any[])[0].imarket_balance as number

    await DBRequest(`UPDATE \`users\` SET balance = ${balance-value} WHERE \`users\`.\`id\` = ${userid}`)
    await DBRequest(`UPDATE \`stats\` SET imarket_balance = ${imarketBalance+value} WHERE \`stats\`.\`config_id\` = 1`)
    const response = await DBRequest(`SELECT * FROM \`users\` WHERE id = ${userid}`) as any[]
    await postTransferHistory(userid, value, Math.abs(Object.keys(OperationTypes).indexOf(target)), reason)
    return response[0].balance;
}

export async function getHistory(userid: number, historyType: HistoryTypes) {
    return await DBRequest(`SELECT * FROM ${historyType} WHERE userid = ${userid}`)
}

export async function postTransferHistory(userid: number, value: number, target: number, reason: string) {
    return await DBRequest(`INSERT INTO transfer_history (userid, value, target, reason) VALUES (${userid}, ${value}, ${target}, '${reason}')`)
}
