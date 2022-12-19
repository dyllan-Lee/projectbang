var mysql = require('mysql');
const {
  connect
} = require('./app');
var connection = mysql.createConnection({
  host: 'us-cdbr-east-06.cleardb.net',
  user: 'bec5bccc9f663a',
  password: 'bb7f8f0a',
  database: 'heroku_9b3e89282139ce5',
  dateStrings: 'date',
  multipleStatements: true
});
/* 데이터 베이스 연결 */
function getMemo(callback) {
  connection.query("SELECT * FROM notice1 ORDER BY id desc",
    (err, rows, fields) => {
      if (err) throw err;
      callback(rows);
    })
}


function insertbjoin(name, mail, num, userid, pwd, callback) {
  connection.query(`insert into join1(date,name,mail,num,userid,pwd)
  values(now(),'${name}','${mail}','${num}','${userid}','${pwd}')`, (err) => {
    if (err) throw err;
    callback();
  })
}

function logincheck(id, pwd, callback) {
  connection.query(`select * from join1 where userid='${id}' and pwd='${pwd}'`, (err, result) => {
    if (err) throw err;
    callback(result);
  })
}

function insertMemo(cont, title, callback) {
  connection.query(`INSERT INTO notice1(date,title,cont) VALUES(NOW(),
  '${title}','${cont}')`, (err) => {
    if (err) throw err;
    callback()
  })
}

function getMemoById(id, callback) {
  connection.query(`select * from notice1 where id=${id}`, (err, row) => {
    if (err) throw err;
    callback(row)
  })
}


function updateMemo(cont, title, id, callback) {
  connection.query(`update notice1 set DATE=now(),cont='${cont}',title='${title}' where id=${id}`, (err) => {
    if (err) throw err;
    callback();
  })
}

/* 데이터베이스 삭제 */
function deleteById(id, callback) {
  connection.query(`delete from notice1 where id=${id}`, (err) => {
    if (err) throw err;
    callback();
  })
}

/* 상품 정보 추가 */
function insertPd(img, title, info, infodetail, price, callback) {
  connection.query(`insert into product(create_time, img, title, info, infodetail, price)
  values(now(),'${img}','${title}','${info}','${infodetail}','${price}')`, (err) => {
    if (err) throw err;
    callback();
  })
}
/*상품 정보 가져오기*/
function getthumb(callback) {
  connection.query('SELECT * FROM product ORDER BY id', (err, rows, fields) => {
    if (err) throw err;
    callback(rows);
  })
}

function getpdById(id, callback) {
  connection.query(`select * from product where id=${id}`, (err, row) => {
    if (err) throw err;
    callback(row)
  })
}

/*수정페이지로 아이디 넘기기*/
function getpdById1(id, callback) {
  connection.query(`select * from product where id=${id}`, (err, row) => {
    if (err) throw err;
    callback(row)
  })
}

function updatepd(id, img, title, info, infodetail, price, callback) {
  connection.query(`update product set id='${id}',img='${img}',title='${title}',info='${info}',
  infodetail='${infodetail}',price='${price}' where id=${id}`, (err) => {
    if (err) throw err;
    callback();
  })
}

function deleteBypdt(id, callback) {
  connection.query(`delete from product where id=${id}`, (err) => {
    if (err) throw err;
    callback();
  })
}
module.exports = {
  insertbjoin,
  logincheck,
  insertMemo,
  getMemo,
  getMemoById,
  updateMemo,
  deleteById,
  insertPd,
  getthumb,
  getpdById,
  getpdById1,
  updatepd,
  deleteBypdt
}