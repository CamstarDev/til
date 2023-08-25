//basic

//static check
const message = "";
message();

const user = {
  name: "Daniel",
  age: 26,
};

user.location;

const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
  // unreachable
}

function greet(name: string): number {
  console.log("Hello, " + name.toUpperCase() + "!!");
  return 10;
}

const names = ["Alice", "Bob", "Eve"];
names.forEach(function (s) {
  console.log(s.toUpperCase());
});

// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });

function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });

function printName1(obj: { first: string; last?: string }) {
  // Error - might crash if 'obj.last' wasn't provided!
  console.log(obj.last.toUpperCase());
  //   'obj.last' is possibly 'undefined'.
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // A safe alternative using modern JavaScript syntax:
  console.log(obj.last?.toUpperCase());
}

//union type
function printId(id: number | string) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id);
  }
}

function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log("Hello, " + x.join(" and "));
  } else {
    // Here: 'x' is 'string'
    console.log("Welcome lone traveler " + x);
  }
}

// Return type is inferred as number[] | string
//have common method
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}

//type alias
// A type alias is exactly that - a name for any type. The syntax for a type alias is

type Point = {
  x: number;
  y: number;
};

// Exactly the same as the earlier example
function printCoord1(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });

// interface declaration is another way to name an object type:
interface Point1 {
  x: number;
  y: number;
}

function printCoord2(pt: Point1) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
type ID = number | string;

type Window = {
  title: string;
};

type Window = {
  ts: TypeScriptAPI;
};
// the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.

// Error: Duplicate identifier 'Window'.

//type assertions
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;

//use the angle-bracket syntax (except if the code is in a .tsx file),
const myCanvas1 = <HTMLCanvasElement>document.getElementById("main_canvas");

//impossible
const x = "hello" as number;

// But by combining literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "center");
printText("a number", "left1");

function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}

//combine with non-literal types
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");

const obj = { counter: 0 };
if (true) {
  obj.counter = 1;
}
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);

function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}

//function type expression
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);

//call signatures
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = "default description";

doSomething(myFunc);

//generic

function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);

function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): Output[] {
  return arr.map(func);
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));

//   a length property that’s a number. We constrain the type parameter to that type by writing an extends clause:
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);

//optional parameter
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK

interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});

type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}

type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};

//core type manipulation

function identity<Type>(arg: Type): Type {
  return arg;
}

let output = identity<string>("myString");
let output1 = identity("myString");

//log the length of arg
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length);
  //   Property 'length' does not exist on type 'Type'.
  return arg;
}

function loggingIdentity1<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}

function loggingIdentity2<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length); // Array has a .length, so no more error
  return arg;
}

let myIdentity: <Input>(arg: Input) => Input = identity;
let myIdentity1: { <Type>(arg: Type): Type } = identity; // 这个对象被解释为一个函数 <T>(arg:T):T
myIdentity<string>("aaa");
myIdentity1<string>("aaaa");

//move the generic to an interface
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

const myIdentity2: GenericIdentityFn<string> = (a: string) => a;

//generic class
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};

//generic constrain
interface Lengthwise {
  length: number;
}

function loggingIdentity3<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}

loggingIdentity3({ length: 10, value: 3 });

//declare a type parameter that is constrained by another type parameter
// we’d like to get a property from an object given its name. We’d like to ensure
//that we’re not accidentally grabbing a property that does not exist on the obj, so we’ll place a constraint between the two types:

function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

interface ObjectOperation<Type>{
    <Tkey extends keyof Type>(obj:Type,key:Tkey):any
}


const getValue: ObjectOperation<{ a: 1, b: 2, c: 3, d: 4}> = (obj,key) => obj[key]

let x1 = { a: 1, b: 2, c: 3, d: 4};

getProperty(x1, "a");
getProperty(x1, "m");



type Point2 = { x: number; y: number };
type P = keyof Point2;  // 

const value1 :P = "x" ;


type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];
type I1 = Person["age" | "name"];

type I2 = Person[keyof Person];
type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];


const MyArray = [
    { name: "Alice", age: 15 },
    { name: "Bob", age: 23 },
    { name: "Eve", age: 38 },
  ];
   //使用number获取对象数组的类型
  type Person4 = typeof MyArray[number];

//   type Person4 = {
//     name: string;
//     age: number;
// }