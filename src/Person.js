// 類別名稱 第一個字大寫，屬性不需要宣告
class Person {
    constructor(name='Noname', age=18) {
        // instance 實體實例
        this.name = name;
        this.age = age;
    }

    toString() { //我們覆蓋了原先內建的的toString()
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

module.exports = Person;

// const p1 = new Person;
// const p2 = new Person('Flora',27);


// console.log(p1);
// console.log('' + p1);
// console.log(p2);
// console.log('' + p2);
// console.log(JSON.stringify(p2));
