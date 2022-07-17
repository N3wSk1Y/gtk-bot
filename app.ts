import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

const paymentRouter = require('./routes/success');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const panelRouter = require('./routes/panel');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'routes/public')));
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.set('view engine', 'html');

app.use('/auth', authRouter);
app.use('/payment', paymentRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/panel', panelRouter);
app.get('*', function(req, res){
    res.sendFile(__dirname + "/routes/public/success.html")
});

app.listen(3000, () => {
    console.log(`Сервер запущен на порте ${3000}`)
})