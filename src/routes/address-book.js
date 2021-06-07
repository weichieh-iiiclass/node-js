const express = require('express');
const moment = require('moment-timezone');
const db = require(__dirname + '/../modules/mysql2-connect');
const upload = require(__dirname + '/../modules/upload-img');

const router = express.Router();

// 把功能獨立出來成一個function，為了一個顯示頁面，另一個使用api
// 遇到有res的地方需要改寫成output, 且api不需要response
const getListData = async(req)=>{
    let output = {
        success: false,
        error: '',
        totalRows: 0, 
        totalPages: 0, 
        page: 0, 
        rows: [],
    }

    let page = req.query.page || 1;
    page = parseInt(page) || 1;
    
    let t_sql = "SELECT COUNT(1) num FROM `address_book` "; //不使用''和``
    let[r1] = await db.query(t_sql);
    const perPage = 5;
    const totalRows = r1[0].num; //資料表總筆數
    
    const totalPages = Math.ceil( totalRows/perPage);

    let rows = []; //某分頁的資料預設為空
    if(totalRows > 0){
        if(page < 1){
            // return res.redirect('?page=1'); 
            output.error = 'page值太小'; 
            return output;
        }
        if(page > totalPages){
            // return res.redirect('?page=' + totalPages);
            output.error = 'page值太大';
            return output;

        } 
        const sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(page-1)*perPage}, ${perPage} `;
        [rows] = await db.query(sql); //不能使用let不然會變成{}內的變數
        rows.forEach(el=>{
            el.birthday = moment(el.birthday).format('YYYY-MM-DD');
        });
    }
    if(! output.error){
        output = {
            success: true,
            error: '',
            totalRows, 
            totalPages, 
            page, 
            rows,
        };
    }
    return output;
    
}

// 頁面1: 顯示頁面，以網站規劃給桌機版網站使用
router.get('/list', async(req, res)=>{
    const output = await getListData(req);

    if(output.error){ //有錯誤的話就頁面轉向，把後面的querystring弄掉跳回第一頁
        return res.redirect(req.baseUrl + req.url.split('?')[0]);
    }
    res.render('address-book/list', output);
});

router.get('/list2', (req, res)=>{
    res.render('address-book/list2');
});

// 頁面2: api我們只要資料，我們不轉向，以網站規劃給手機版app使用
router.get('/api/list', async(req, res)=>{
    res.json(await getListData(req));
});

// add //add2:fetch
router.get('/add', async(req, res)=>{
    res.render('address-book/add2');
});

// 作法一: 傳統的insert into
// router.post('/add', async(req, res)=>{
//     // res.json(req.body);
//     const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())";

//     const [results] = await db.query(sql,[
//         req.body.name,
//         req.body.email,
//         req.body.mobile,
//         req.body.birthday,
//         req.body.address,
//     ]);
//     res.json({
//         body: req.body,
//         results
//     });
// });

// 作法2: 較簡易偷懶
// fetch寫法, 加middleware
router.post('/add', upload.none(), async(req, res)=>{
    // TODO: 輸入的資料檢查
    let output = {
        success: false,
        error: '',
        insertId: 0,
    };
    const data = {
        ...req.body,
        created_at: new Date()
    }
    const sql = "INSERT INTO `address_book` SET ?"; //node mysql2的簡易寫法
    const [results] = await db.query(sql,[data]);

    if (results.affectedRows===1){
        output.success = true;
        output.insertId = results.insertId;
    } else {
        output.error = '資料新增失敗';
    }

    output = {...output, body: req.body };
    res.json(output);
});

// 點擊del，會連到del/:sid執行刪除再回來
router.get('/del/:sid', async(req, res)=>{
    // res.json([req.get('Referer'),req.headers]); //測試查看referer
    const sql = "DELETE FROM `address_book` WHERE sid=?";
    await db.query(sql, [req.params.sid]);

    if(req.get('Referer')){
        res.redirect(req.get('Referer'));
    } else {
        res.redirect('/address-book/list');

    }
});

router.get('/edit/:sid', async(req, res)=>{
    const sql = "SELECT * FROM address_book WHERE sid=?";
    const [rs] = await db.query(sql, [req.params.sid]);
    if(! rs.length){ //如果沒有找到資料就跳轉到列表頁
        return res.redirect('/address-book/list');
    } 
    rs[0].birthday = moment(rs[0].birthday).format('YYYY-MM-DD');
    res.render('address-book/edit', rs[0]);
    // res.json( rs[0]);
});

router.post('/edit/:sid', upload.none(), async(req, res)=>{
    let output = {
        success: false,
        type: 'danger',
        error: '',
        results: {},
    }
    const sql = "UPDATE `address_book` SET ? WHERE sid=?";
    //塞兩個問號的資料進去進去
    const [results] = await db.query(sql, [req.body, req.params.sid]); 
    output.results = results;
    // affect影響而已 change資料有變動
    if(results.affectedRows && results.changedRows){
        output.success = true;
        output.type = 'success';
    } else if(results.affectedRows){
        output.error = '資料沒有修改';
        output.type = 'warning';
    } else {
        output.error = '資料輸出發生錯誤';
    }
    res.json(output);
});

router.get('/escape', async(req, res)=>{
    const str = "ab'c";
    res.send(db.escape(str)); //做單引號的跳脫，同時用單引號包住str
});

module.exports = router;

// function裡面使用到return是為了避免重複使用到res.的方法，所以使用return結束function
// 結束cb func,後面不執行
// /開頭是變更路徑,?是改變querystring

// res.json({totalRows, totalPages, page, rows}); 
// 因為promise只能回傳一個值?
// 所以包成物件{},如果包成array[]會只有值沒有欄位名稱

// php都只有生頁面出來
// 專題大部分都會寫成api，原則上不會用到ejs，因為會用到react是前端的框架
// 網站有手機桌機板，個別寫要寫三套，所以手機的app會從網站上面要資料，使用api的方式去要
// 我要取資料的功能寫成一個function

// app是主程式
// router是路由模組化

// 當初SQL的設定如果created_at有設定current_timestamp()作為default value這邊就不用JS寫入時間的數值了