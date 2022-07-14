import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

const paymentRouter = require('./routes/success');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'routes/public')));
app.set('view engine', 'html');

app.use('/payment', paymentRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);

app.listen(3000, () => {
    console.log(`Сервер запущен на порте ${3000}`)
})