function getValue(o, key) {
    return o[key];
}
var obj1 = { name: "张三", age: 18 };
var values = getValue(obj1, "name");
function RequiredKey(T) {
    console.log(T);
}
var keys = RequiredKey("age");
