// 參考: https://ithelp.ithome.com.tw/articles/10219933
// JavaScript 除了原生型別 number、string、boolean、null、undefined 之外，幾乎都是物件，物件具有屬性 (properties) 與方法 (methods) 可以操作，使用『物件』來做程式設計模式稱為『物件導向程式設計』。

// 建構新物件，需要定義物件的規格:類別 (class) & 屬性 (Properties)
// 宣告類別(Classes)時，類別名稱第一個字大寫，屬性 (Properties)則不需要宣告
// 類別Classes的語法有兩種：類別敘述(class expressions)和類別宣告(class declarations)。
// 參考: https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Classes

//使用：類別宣告(class declaration)
class Person {
    constructor(name='Noname', age=18) {
        // instance 實體實例
        this.name = name;
        this.age = age;
    }

    toString() { //定義此物件的方法(Method)，我們覆蓋了原先內建的的toString()
        const{name, age} = this; //把this.name和this.age設定給它
        return JSON.stringify({name, age})
    }
     toJSON() {
        return{
            name: this.name,
            age: this.age,
            from: 'toJSON',
        };
     }
}

module.exports = Person; //匯出模組(類別)，為了要給別的程式使用，必須加上這行
// export給require02.js使用
// module.exports 或 exports 。
// 它們是一個特別的object，可以將 javascript裡任何型別的宣告，變成一個模組，供其他的應用程式或模組使用。
// 參考: https://ithelp.ithome.com.tw/articles/10185083

// const p1 = new Person;
// const p2 = new Person('Flora',27);


// console.log(p1);
// console.log('' + p1);
// console.log(p2);
// console.log('' + p2);
// console.log(JSON.stringify(p2));
