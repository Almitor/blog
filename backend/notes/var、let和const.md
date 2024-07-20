## var

**函数作用域**：使用 `var` 声明的变量在函数内部是局部变量，在函数外部是全局变量。

**全局对象属性**：在全局作用域中声明的 `var` 变量会成为全局对象（如 `window` 对象）的属性。

``` javascript
function testVar() {
  var x = 1;
  if (true) {
    var x = 2; // 在函数内定义，则在整个函数内都有效
    console.log(x); // 2
  }
  console.log(x); // 2
}
console.log(x);	// ReferenceError: x is not defined
testVar();
```

**变量提升**：`var` 声明的变量会被提升到其作用域的顶部，但初始化不会被提升。这意味着变量可以在声明之前使用，但值为 `undefined`。

```javascript
console.log(a); // undefined
var a = 1;
```

**允许重复声明**：在同一作用域内，可以多次声明同一个变量，后面的声明会覆盖前面的声明。

```javascript
var c = 1;
var c = 2;
console.log(c); // 2
```



## let

用于声明变量

**块作用域**：使用 `let` 声明的变量在块作用域内有效，如在 `{}` 内部。

**无全局对象属性**：在全局作用域中声明的 `let` 变量不会成为全局对象的属性。

```javascript
function testLet() {
  let y = 1;
  if (true) {
    let y = 2; // 旨在当前块作用域有效
    console.log(y); // 2
  }
  console.log(y); // 1
}
testLet();
```

**暂时性死区**：`let` 声明的变量也**会被提升**，但在声明之前访问会导致 `ReferenceError`。

``` javascript
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 1;
```

**不允许重复声明**：在同一作用域内，不可以多次声明同一个变量，否则会导致 `SyntaxError`。

```javascript
let d = 1;
let d = 2; // SyntaxError: Identifier 'd' has already been declared
```



## const

用于声明常量

**块作用域**：与 `let` 一样，使用 `const` 声明的变量在块作用域内有效。

**暂时性死区**：与 `let` 一样，`const` 声明的变量在声明之前不能访问，否则会导致 `ReferenceError`。

**不允许重复声明**：与 `let` 一样，`const` 在同一作用域内不能重复声明，否则会导致 `SyntaxError`。

**不可重新赋值**：`const` 声明的变量不能重新赋值。尝试重新赋值会导致 `TypeError`。

``` javascript
const d = 1;
d = 2; // TypeError: Assignment to constant variable.
```

**对象和数组的可变性**：虽然 `const` 声明的变量不能重新赋值，但对象和数组的内容是可变的。这意味着**可以修改**对象的属性或数组的元素。

```javascript
const obj = { name: 'Alice' };
obj.name = 'Bob'; // 允许修改对象的属性

const arr = [1, 2, 3];
arr.push(4); // 允许修改数组的元素

console.log(obj); // { name: 'Bob' }
console.log(arr); // [1, 2, 3, 4]
```



