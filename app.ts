import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

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

app.use('/auth', require('./routes/auth'));
app.use('/payment', require('./routes/success'));
app.use('/categories', require('./routes/categories'));
app.use('/products', require('./routes/products'));
app.use('/panel', require('./routes/panel'));

app.get('/', function(req, res){
    res.status(200).sendFile(__dirname + "/routes/public/main.html")
});
app.get('*', function(req, res){
    res.status(404).sendFile(__dirname + "/routes/public/not_found.html")
});

app.listen(3000, () => {
    console.log(`Сервер запущен на порте ${3000}`)
})