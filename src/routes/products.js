// 講義路由模組化方式二

const express = require("express");

const Product = require(__dirname + "/../models/Product")

const router = express.Router();


/*

商品API：
§ 1. 列表
§ 2. 篩選(包含關鍵字搜尋)
§ 3. 單項商品

*/


// 取得所有商品 + 篩選?
router.get("/", async(req, res) => {
  res.json([req.baseUrl, req.url ])
});

// 商品CRUD測試(放前面)
router.get("/save", async(req, res) => {
    // 新增p1
    const p1 = new Product({
        author: 'abc44',
        bookname: '測試資料44',
    });
    const obj1 = await p1.save();

    // 修改p2
    const p2 = await Product.getItem(23);
    p2.data.author = '星星星44';
    const obj2 = await p2.save();

    // 刪除p3, remove直接寫在下面
    const p3 = await Product.getItem(21);

    // 回傳url、(obj1=p1新增結果)、(obj2=p2修改結果)、(await p3.remove()=p3刪除結果)
    res.json([req.baseUrl, req.url, obj1, obj2, await p3.remove() ]);
});

// 商品篩選、排序、搜尋關鍵字測試
router.get("/all", async(req, res) => {
    // res.json(await Product.getRows({cate:3})); //類別篩選
    // res.json(await Product.getRows({keyword:'林'})); //關鍵字搜尋
    res.json(await Product.getRows({keyword:'林', orderBy:'price-asc'})); //關鍵字搜尋+排序
});

// 取得單項商品(放後面)
router.get("/:sid", async(req, res) => {
    res.json([req.baseUrl, req.url ])
});


module.exports = router;
