import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

const paymentRouter = require('./routes/success');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/payment', paymentRouter);

app.listen(80, () => {
    console.log(`Сервер запущен на порте ${80}`)
})