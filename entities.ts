abstract class OrderHistoryEntry
{
    public id: number;
    public name: string;
    public deliverer: string;
    public products: JSON;
    public price: number;
    public paymend_method: string;
    public status: string;
    public date: Date;
}

abstract class TopupHistoryEntry
{
    public id: number;
    public userid: number;
    public value: number;
    public date: Date;
}

abstract class WithdrawHistoryEntry
{
    public id: number;
    public userid: number;
    public value: number;
    public date: Date;
}

abstract class TransferHistoryEntry
{
    public id: number;
    public userid: number;
    public value: number;
    public target: number;
    public reason: string;
    public date: Date;
}

abstract class Product
{
    public id: number;
    public name: string;
    public description: string;
    public emoji_id: string;
    public category_id: string;
    public price: number;
    public enabled: number;
    public stock: number;
}

abstract class Category
{
    public id: number;
    public name: string;
    public description: string;
    public emoji_id: string;
    public order_id: number;
}

abstract class User
{
    public id: number;
    public minecraft_username: string;
    public uuid: string;
    public balance: number;
    public card_number: number;
    public referal: string;
    public address: string;
}