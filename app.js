//npm으로 설치한 애들 연결하기
const expressLayout = require('express-ejs-layouts');
const express = require('express');
const cookieParser = require('cookie-parser')
const routers = require('./routes/route');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//static 정적인 파일을 읽어준다.

app.use(expressLayout);
app.use(cookieParser())
app.use('/', routers);
app.use(express.static(path.join(__dirname, 'public'))); //public 폴더로 절대경로 지정
module.exports = app;