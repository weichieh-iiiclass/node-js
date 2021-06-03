const express = require('express');
const db = require(__dirname + '/../modules/mysql2-connect');

const router = express.Router();

router.get('/list', async(req, res)=>{
    let t_sql = "SELECT COUNT(1) num FROM `address_book` "; //不使用''和``
    // count(1) 給2,3都可以
    let[r1] = await db.query(t_sql);
    res.json(r1);
});

module.exports = router;