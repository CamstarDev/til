interface userInfo {
  name: string;
  age: number;
  gender?: string;
}

type keyOfvalue = keyof userInfo;
function getValue<T extends Object, K extends keyof T>(o: T, key: K): T[K] {
  return o[key];
}
const obj1 = { name: "张三", age: 18 };
const values = getValue(obj1, "name");


//必需的键
type RequiredKeys<T, K = keyof T> = K extends keyof T
  ? T extends Required<Pick<T, K>>
    ? K
    : never
  : never;
type Result<T> = RequiredKeys<T>;

function RequiredKey(T: Result<userInfo>){
  console.log(T)
}

const keys = RequiredKey("age");
