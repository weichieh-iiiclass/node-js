const db = require(__dirname + '/../modules/mysql2-connect')

/* 靜態的方法不能用this!!!!!!!!!! this表示instance */

// CRUD
class Product {

    // `sid`, `author`, `bookname`, `category_sid`, `book_id`, `publish_date`, `pages`, `price`, `isbn`, `on_sale`, `introduction` 
    constructor(data){
        // data: Object
        let defaultData = {
            sid: null,
            author: "",
            bookname: "",
            category_sid: 0,
            book_id: "",
            publish_date: "",
            pages: "",
            price: "",
            isbn: "",
            on_sale: "",
            introduction: "",
            images: "[]"
        };

        //合併物件:data設定會蓋掉default
        this.data = {...defaultData, ...data} 
    }


    // 儲存：新增(sid=null) 或 修改
    async save(){
        if(! this.data.sid){
            // sid=null時，表示是新建的資料
            let sql = "INSERT INTO `products` SET ?";
            let [result] = await db.query(sql, [this.data]);
            if(result.insertId){
                this.data.sid = result.insertId;
                return this.data;
            } else {
                return false; //新增失敗
            }
        
        } else {
            // sid有值，表示是做更新
            const o = {...this.data};
            delete o.sid;

            let sql = "UPDATE `products` SET ? WHERE `sid`=?";
            let [result] = await db.query(sql, [o, this.data.sid]);
            if(result.changedRows){
                return this.data;
            } else {
                return false; //沒有修改
            }

        }
        
    }

    static async getRows(params={}){
        let perPage = params.perPage || 5; //每頁有幾筆
        let page = params.page || 1; //查看第幾頁
        let cate = parseInt(params.cate) || 0; //分類編號
        let keyword = params.keyword || ''; //搜尋產品名稱或者作者姓名
        let orderBy = params.orderBy || ''; //排序

        let where = 'WHERE 1';
        if(cate){
            where += ' AND category_sid=' + cate;//記得空格AND( AND)
        }
        if(keyword){
            let k2 = db.escape('%' + keyword + '%');
            where += ` AND (author LIKE ${k2} OR bookname LIKE ${k2})`;
        }

        let orderStr = '';
        switch(orderBy){
            case 'price':
            case 'price-asc':
                orderStr = 'ORDER BY `price` ASC';
                break;
            case 'price-desc':
                orderStr = 'ORDER BY `price` DESC';
                break;
            case 'pages':
            case 'pages-asc':
                orderStr = 'ORDER BY `pages` ASC';
                break;
            case 'pages-desc':
                orderStr = 'ORDER BY `pages` DESC';
                break;
        }

        let t_sql = `SELECT COUNT(1) num FROM \`products\` ${where}`;
        let [r1] = await db.query(t_sql);
        let total = r1[0]['num'];
        
        let r2, totalPages=0;
        if(total){
            totalPages = Math.ceil(total/perPage);
            let r_sql = `SELECT * FROM \`products\` ${where} ${orderStr} LIMIT ${(page-1)*perPage}, ${perPage}`; //sql裡面有`要做跳脫
            [r2] = await db.query(r_sql);
        }
        
        return {
            total,
            perPage,
            page,
            params,
            data: r2
        }

    }
    // 不會用到這個功能 
    static async getItems(params={}){
        let results = await Product.getRows(params);
        if(results.data && results.data.length){
            results.data = results.data.map(el=> new Product(el));

        }
        return results;
    }

    // 讀取單筆：拿到obj
    static async getRow(sid){
        if(!sid) return null;
        let sql = "SELECT * FROM `products` WHERE `sid`=?";
        let [r] = await db.query(sql, [sid]);
        if(!r || !r.length){
            return null;
        }
        return r[0];
    }
    // 拿到Product類型的物件
    static async getItem(sid){
        let row = await Product.getRow(sid); //拿到obj
        return new Product( row );
    }

    // 刪除
    async remove(){
        if(! this.data.sid) return false;
        let sql = "DELETE FROM `products` WHERE `sid`=?";
        let [r] = await db.query(sql, [this.data.sid]);
        if(r.affectedRows){
            this.data.sid = null;
            return true;
        } else {
            return false;
        }
    }
    
}

module.exports = Product