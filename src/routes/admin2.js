// 講義路由模組化方式二
// 透過express去使用Router的物件
// 程式:去管理,設定路由

// require運作方式與php的include不同，require進來後就把這個東西放在記憶體裡面，
// 當我重複require的時候，判斷是否已載入，把已經載入的模組的參照，丟過去，所以會是相同的物件，因此不會占用到多個記憶體
// 只是因為在不同的js檔裡面，所以scope不同，所以要各自宣告const
// 所有東西都可以動態設定自己的方法，但盡量不要這樣使用，怕蓋掉原先的方法 
//在index.js設定express.weichieh，可以在admin2.js使用這個方法
const express = require('express'); 
const router = express.Router();

router.get('/admin2/:p1?/:p2?', (req, res)=>{
    res.json({
        weichieh: express.weichieh,
        params: req.params,
        url: req.url, //看自己現在的url: "/admin2/1616/512"
        baseUrl: req.baseUrl, //看url前面那段多加的路徑: "/admin3" (因為在index.js有多加admin3路徑)
    });
});

module.exports = router;