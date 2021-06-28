require("dotenv").config(); // 連環境參數
const port = process.env.PORT || 3000;
const express = require("express"); // 連express
const session = require("express-session");
const MysqlStore = require("express-mysql-session")(session);
// const MysqlStore = require('express-mysql-session')(session); //require進來的同時直接呼叫
const db = require(__dirname + "/modules/mysql2-connect"); //和express無關
// const sessionStore = new MysqlStore({}, db); //用new建立這個類別
const sessionStore = new MysqlStore({}, db);
const cors = require("cors");

express.weichieh = "嗨嗨";

// const multer = require('multer');
// const upload = multer({dest:'tmp_uploads/'}); //設定暫存的資料夾
// const {v4: uuidv4} = require('uuid'); //把v4改名為uuidv4
const upload = require(__dirname + "/modules/upload-img");

const fs = require("fs");

const app = express();

app.set("view engine", "ejs");

// 從哪裡連過來就允許哪一台，允許傳送cookie
const corsOptions = {
  credentials: true,
  origin: function (origin, cb) {
    cb(null, true);
  },
};
app.use(cors(corsOptions));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "lgheuifunldaoiewaifebwfoweafewd", //加密cookie
    // store: sessionStore,
    store: sessionStore,
    cookie: {
      maxAge: 1200000,
    },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 靜態內容通常放前面
app.use(express.static(__dirname + "/../public")); //前面省略根目錄

// 全域的middleware，會用到session
app.use((req, res, next) => {
  res.locals.admin = req.session.admin || {};
  next(); //不加的話會pending
});

//---------- 定義路由開始 (路由一定是/開頭)----------
app.get("/", (req, res) => {
  res.render("home", { name: "Jessica" });
});

app.get("/json-test", (req, res) => {
  const d = require(__dirname + "/../data/sales");
  res.render("json-test", { sales: d });
});

app.get("/try-qs", (req, res) => {
  res.json(req.query);
});

// 搭配form01.html
app.post("/try-post", (req, res) => {
  res.json(req.body);
});

// 路徑一樣，方法不同 get post
app.get("/try-post-form", (req, res) => {
  res.render("try-post-form");
});
app.post("/try-post-form", (req, res) => {
  res.render("try-post-form", req.body);
});

// 在原本的/try-upload路由新增一個get
app.get("/try-upload", (req, res) => {
  res.render("try-upload");
});

// 上傳的欄位名稱叫avatar，single最多一次上傳一個檔案
app.post("/try-upload", upload.single("avatar"), async (req, res) => {
  console.log(req.file);
  res.json({
    filename: req.file && req.file.filename,
    body: req.body,
  });
});

// 上傳的欄位名稱叫photo，array最多一次上傳6個檔案
app.post("/try-uploads", upload.array("photo", 6), (req, res) => {
  console.log(req.files);
  res.json({
    file: req.files,
    body: req.body,
  });
});

app.get("/pending", (req, res) => {});

// action id是代稱(類似變數名稱)
app.get("/my-params1/:action?/:id?", (req, res) => {
  res.json(req.params);
});

// i: case ignore,-?:選擇性的
app.get(/\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
  let u = req.url.slice(3); //去除/m/
  u = u.split("?")[0]; //去除query string ?後面的東西
  u = u.replace(/-/g, ""); //去除global的-
  res.send(`<h2>${u}</h2>`);
});

// app.use(require(__dirname + '/routes/admin2')); //簡寫成一行但可讀性差
const admin2 = require(__dirname + "/routes/admin2");
app.use("/admin3", admin2);
app.use(admin2);

app.get("/try-sess", (req, res) => {
  req.session.my_var = req.session.my_var || 0;
  req.session.my_var++;
  res.json({
    my_var: req.session.my_var,
    session: req.session,
  });
});

app.get("/login", (req, res) => {
  if (req.session.admin) {
    //如果admin不是undefined，已登入
    res.redirect("/");
  } else {
    res.render("login");
  }
});
app.post("/login", (req, res) => {
  const accounts = {
    wei: {
      nickname: "小倢",
      pw: "wei",
    },
    sun: {
      nickname: "晴晴",
      pw: "sun",
    },
  };
  const output = {
    success: false,
    code: 0, //除錯方便追蹤
    error: "帳號或密碼錯誤",
    body: req.body, //除錯檢查
  };

  if (req.body && req.body.account && accounts[req.body.account]) {
    output.code = 100;
    const item = accounts[req.body.account];
    if (req.body.password && req.body.password === item.pw) {
      req.session.admin = {
        account: req.body.account,
        ...item, //copy,nickname&password都會進來
      };
      output.success = true;
      output.error = "";
      output.code = 200;
    }
  }

  res.json(output);
});
app.get("/logout", (req, res) => {
  delete req.session.admin;
  res.redirect("/"); //轉向頁面，後面不該出現res.send,end,render等
});

const moment = require("moment-timezone");
app.get("/try-moment", (req, res) => {
  const fm = "YYYY-MM-DD HH:mm:ss";
  const m1 = moment(new Date());
  const m2 = moment("2021-03-15");

  res.json({
    t1: m1.format(fm), //沒指定時區，會使用local時區
    t1a: m1.tz("Europe/London").format(fm),
    t2: m2.format(fm),
    t2a: m2.tz("Europe/London").format(fm),
  });
});

app.get("/try-db", (req, res) => {
  db.query("SELECT * FROM `address_book` LIMIT 5") //是一個promise物件
    .then(([r]) => {
      res.json(r);
    })
    .catch((error) => {
      res.send(error);
    });
});

// 連結是/address-book/list
app.use("/address-book", require(__dirname + "/routes/address-book"));

//404路由定義，要放在所有路由的後面，避免蓋到其他的設定
app.use((req, res) => {
  res.type("text/html");
  res.status(404);
  res.send("404 - 找不到網頁");
});
// -------------- ------ 定義路由結束----------------- ---
app.listen(port, () => {
  console.log(`server started ${port}`);
});
