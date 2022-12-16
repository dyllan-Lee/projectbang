const {
  json
} = require('body-parser');
// const {
//   Domain
// } = require('domain');
const express = require('express');
const router = express.Router();

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./../db.js');

router.get('/', (req, res) => {
  res.render('main');
});

router.get('/main', (req, res) => {
  res.render('main');
});
router.get('/noticeinfo', (req, res) => {
  res.render('noticeinfo');
});
router.get('/footer', (req, res) => {
  res.render('footer');
});
// router.post('/writememo', (req, res, next) => {
//   let param = JSON.parse(JSON.stringify(req.body));
//   let cont = param['content'];
//   let title = param['title'];
//   let writer = param['writer'];
//   console.log('내용 : ' + cont);
//   console.log('제목 : ' + title);
//   console.log('작성자 : ' + writer);
//   res.render('notice.ejs', {
//     'memo': param
//   });

// })

router.get('/join', (req, res) => {
  res.render('join');
})
// router.get('/pdinfo', (req, res) => {
//   res.render('pdinfo');
// })
// router.get('/notice', (req, res) => {
//   res.render('notice');
// })
router.get('/login', (req, res) => {
  res.render('login');
})
router.get('/ntcwrite', (req, res) => {
  res.render('ntcwrite');
})
router.get('/pdinfodetail', (req, res) => {
  res.render('pdinfodetail');
})
/* db 연결*/
router.post('/bjoin', (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let name = param['name'];
  let userid = param['userid'];
  let pwd = param['pwd'];
  let mail = param['mail'];
  let num = param['num'];
  db.insertbjoin(name, mail, num, userid, pwd, () => {
    res.redirect("/");
  })
  // res.render('sub1.ejs', {
  //   'memo': param
  // });
  // next(title);
})

router.post('/loginE', (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let id = param['userid'];
  let pwd = param['pwd'];
  db.logincheck(id, pwd, (result) => {
    // res.redirect('/');
    if (result.length > 0) {
      res.redirect('/');
    } else {
      res.send(`<script>alert("로그인 정보가 일치하지 않습니다.");
      document.location.href="/login";</script>`)
    }
  })
});

router.post('/writememo', (req, res, next) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let cont = param['cont'];
  let title = param['title'];
  db.insertMemo(cont, title, () => {
    res.redirect("/notice")
  })
})
router.get('/notice', (req, res) => {
  db.getMemo((rows) => {
    res.render('notice', {
      rows: rows
    });
  })
  // res.render('sub1');
});

/*게시판 들어가기*/
router.get('/noticeinfoM', (req, res) => {
  let id = req.query.id;
  db.getMemoById(id, (row) => {
    res.render('noticeinfoM', {
      row: row[0]
    })
  })
})

/*수정하기*/

/*수정페이지 넘어가기*/
router.get('/writememoM', (req, res) => {
  let id = req.query.id;
  db.getMemoById(id, (row) => {
    res.render('noticeEdit', {
      row: row[0]
    })
  })
})


/*수정내용 표시하기*/
router.post('/writememoS', (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let cont = param['cont'];
  let title = param['title'];
  let id = param['id'];
  db.updateMemo(cont, title, id, () => {
    res.redirect('/notice');
  })
})

/* 삭제하기 */

router.get('/deleteM', (req, res) => {
  let id = req.query.id;
  console.log(id);
  db.deleteById(id, () => {
    res.redirect('/notice')
  })
})


/* pdinfo img */

/* setting */
// try {
//   fs.readFileSync('../public/uploads'); //폴더가 있으면 사용
// } catch (err) {
//   console.log('can`t find folder');
//   fs.mkdirSync('../public/uploads'); //폴더가 없으면 생성
// }
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'public/uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); //파일의 확장자
      done(null, path.basename(file.originalname, ext) + Date.now() + ext); //파일명 + 날짜 + 확장자명
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 10
  }
});

/* 상품작성 페이지  */

router.get('/pdinfowrite', (req, res) => {
  res.render('pdinfowrite');
})

router.post('/pdQ', upload.single('img'), (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let img = 'uploads/' + req.file.filename;
  let title = param['title'];
  let info = param['info'];
  let infodetail = param['infodetail'];
  let price = param['price'];
  db.insertPd(img, title, info, infodetail, price, () => {
    res.redirect('/');
  });
})
/* pdinfo 페이지에 제품 불러오기*/
router.get('/pdinfo', (req, res) => {
  // res.sendFile(path.join(__dirname, '../', 'views', 'sub1.html'));
  db.getthumb((rows) => {
    res.render('pdinfo', {
      rows: rows
    });
  })
  // res.render('sub1');
});

/*pdinfo 페이지 상세정보 들어가기*/
router.get('/pdinfoM', (req, res) => {
  let id = req.query.id;
  db.getpdById(id, (row) => {
    res.render('pdinfodetail', {
      row: row[0]
    })
  })
})



/*pdinfo 상세페이지 수정*/
/*수정 페이지로 가기*/
router.get('/pdinfore', (req, res) => {
  let id = req.query.id;
  console.log(id);
  db.getpdById1(id, (row) => {
    res.render('pdinfore', {
      row: row[0]
    })
  })
})


/* 수정시 넘어가는 데이터*/
router.post('/pdQS', upload.single('img'), (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let id = param['id'];
  let img = 'uploads/' + req.file.filename;
  let title = param['title'];
  let info = param['info'];
  let infodetail = param['infodetail'];
  let price = param['price'];
  db.updatepd(id, img, title, info, infodetail, price, () => {
    res.redirect('/pdinfo');
  })
})


/* 제품 정보 삭제하기 */

router.get('/pdDelete', (req, res) => {
  let id = req.query.id;
  console.log(id);
  db.deleteBypdt(id, () => {
    res.redirect('/pdinfo')
  })
})
module.exports = router;