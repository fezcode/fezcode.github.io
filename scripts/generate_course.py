import json
import os

course_data = {
  "title": "JavaScript & Node.js Masterclass: Zero to Hero",
  "description": "The definitive guide to modern JavaScript, from V8 internals to server-side Node.js architecture.",
  "modules": [
    {
      "id": "module-1",
      "title": "Module 1: The Foundations",
      "lessons": [
        {
          "id": "history-evolution",
          "title": "History & Evolution",
          "content": "# The Origins of JavaScript\n\nJavaScript is one of the most misunderstood languages in history. Created in just **10 days** in May 1995 by **Brendan Eich** while working at Netscape, it was originally named *Mocha*, then *LiveScript*.\n\nIt was renamed to **JavaScript** as a marketing tactic to piggyback on the popularity of Java at the time, despite having almost nothing to do with Java. As the saying goes:\n\n> \"Java is to JavaScript as Car is to Carpet.\"\n\n## The ECMA Era\nTo ensure the language didn't remain a proprietary Netscape technology, it was submitted to **ECMA International** for standardization. This gave birth to **ECMAScript**.\n\n### Key Versions\n* **ES1 (1997):** The first standard.\n* **ES3 (1999):** Added regex, try/catch. The baseline for nearly a decade.\n* **ES5 (2009):** The 'modern' baseline. Strict mode, JSON support, `forEach`, `map`, `filter`.\n* **ES6 / ES2015 (2015):** The Revolution. Classes, Modules, Arrow Functions, Promises, Let/Const. This version changed everything.\n\n## How JS Engines Work\nJavaScript is a high-level, interpreted (JIT compiled) language. The most famous engine is **V8** (Chrome, Node.js), but there's also **SpiderMonkey** (Firefox) and **JavaScriptCore** (Safari).\n\n1. **Parser:** Reads code, checks syntax.\n2. **AST (Abstract Syntax Tree):** Converts code into a tree structure.\n3. **Interpreter:** Converts AST to Bytecode.\n4. **Profiler:** Monitors code execution to find 'hot' code.\n5. **JIT Compiler:** Compiles hot bytecode into highly optimized Machine Code.\n\nThis is why modern JS is incredibly fast.",
          "quiz": [
            {
              "question": "Who created JavaScript?",
              "options": ["Bill Gates", "Brendan Eich", "Linus Torvalds", "James Gosling"],
              "answer": 1
            },
            {
              "question": "Which version introduced classes and arrow functions?",
              "options": ["ES3", "ES5", "ES6 (ES2015)", "ES2020"],
              "answer": 2
            },
            {
              "question": "What is the name of the JS engine in Chrome and Node.js?",
              "options": ["SpiderMonkey", "V8", "Chakra", "Rhino"],
              "answer": 1
            },
            {
              "type": "fill-in-the-blanks",
              "question": "Complete the acronym: JIT stands for Just-In-[BLANK].",
              "text": "JIT stands for Just-In-[BLANK].",
              "answer": "Time"
            }
          ]
        },
        {
          "id": "variables-scope",
          "title": "Variables: let, const, var",
          "content": "# Variable Declaration\n\nIn the old days, we only had `var`. It was function-scoped and had a weird behavior called *hoisting* where declarations moved to the top.\n\nIn modern JavaScript (ES6+), we have `let` and `const`. You should **always** prefer these.\n\n## The `const` Keyword\nUse `const` by default. It signals that the identifier will not be reassigned.\n\n```javascript\nconst pi = 3.14159;\npi = 3; // TypeError: Assignment to constant variable.\n```\n\n**Important:** `const` does not mean *immutable*. If the value is an object or array, you can still modify its contents.\n\n```javascript\nconst user = { name: 'Fez' };\nuser.name = 'Ahmed'; // This is allowed!\n// user = {}; // This would be an error.\n```\n\n## The `let` Keyword\nUse `let` only when you know the variable needs to be reassigned (like a counter or result variable).\n\n```javascript\nlet score = 0;\nscore += 10;\n```\n\n## The `var` Keyword\nAvoid `var`. It has no block scope, only function scope. This leads to bugs.\n\n```javascript\nif (true) {\n  var x = 5;\n}\nconsole.log(x); // 5 - Leaked out of the if block!\n\nif (true) {\n  let y = 10;\n}\nconsole.log(y); // ReferenceError: y is not defined - Correct behavior.\n```",
          "quiz": [
            {
              "question": "Which keyword has block scope?",
              "options": ["var", "let", "function", "global"],
              "answer": 1
            },
            {
              "question": "Can you modify properties of an object declared with const?",
              "options": ["Yes", "No", "Only in strict mode", "Only if the object is frozen"],
              "answer": 0
            },
            {
              "question": "What happens if you reassign a const variable?",
              "options": ["It works silently", "It throws a SyntaxError", "It throws a TypeError", "It resets to undefined"],
              "answer": 2
            },
            {
              "type": "code-writing",
              "question": "Declare a variable 'x' with value 10 using let.",
              "starterCode": "// Declare x here",
              "testCase": "x === 10"
            }
          ]
        },
        {
          "id": "data-types",
          "title": "Data Types & Primitives",
          "content": "# Data Types\n\nJavaScript is a **dynamically typed** language. You don't declare types; values have types.\n\nThere are 8 standard data types. 7 are **Primitive**, and 1 is **Reference**.\n\n## The 7 Primitives\nPrimitives are immutable and passed by value.\n\n1. **Number**: Floats, integers. Max safe integer is 2^53 - 1.\n   ```javascript\n   let n = 123;\n   let f = 12.345;\n   ```\n2. **BigInt**: For integers larger than 2^53 - 1. Append `n` to the end.\n   ```javascript\n   const huge = 1234567890123456789012345678901234567890n;\n   ```\n3. **String**: Sequence of characters.\n   ```javascript\n   let s = \"Hello\";\n   let t = 'World';\n   let template = `Hello ${t}`\n   ```\n4. **Boolean**: `true` or `false`.\n5. **Null**: Represents \"intentionally empty\". It is a bug that `typeof null === 'object'`.\n6. **Undefined**: Represents \"value not assigned\". Variables declared but not set are `undefined`.\n7. **Symbol**: Unique identifiers, often used for object keys to avoid collision.\n\n## The Reference Type: Object\nObjects are collections of key-value pairs. Arrays, Functions, Dates, Regexs are all Objects.\n\n```javascript\nconst person ={\n  name: 'Fez',\n  age: 99\n};\n```\n\n## typeof Operator\nUse `typeof` to check a value's type.\n\n```javascript\ntypeof undefined // \"undefined\"\ntypeof 0 // \"number\"\ntypeof 10n // \"bigint\"\ntypeof true // \"boolean\"\ntypeof \"foo\" // \"string\"\ntypeof Symbol(\"id\") // \"symbol\"\ntypeof Math // \"object\"\ntypeof null // \"object\" (Official bug)\ntypeof alert // \"function\"\n```",
          "quiz": [
            {
              "question": "Which of these is NOT a primitive type?",
              "options": ["String", "Boolean", "Object", "Symbol"],
              "answer": 2
            },
            {
              "question": "What is the result of typeof null?",
              "options": ["\"null\"", "\"undefined\"", "\"object\"", "\"number\""],
              "answer": 2
            },
             {
              "question": "How do you create a BigInt?",
              "options": ["BigInt(10)", "10n", "Both of the above", "None of the above"],
              "answer": 2
            },
            {
              "type": "matching",
              "question": "Match the value to its type",
              "pairs": [
                {"left": "42", "right": "Number"},
                {"left": "'42'", "right": "String"},
                {"left": "true", "right": "Boolean"},
                {"left": "undefined", "right": "Undefined"}
              ]
            }
          ]
        },
        {
          "id": "type-conversion",
          "title": "Type Coercion & Conversion",
          "content": "# Type Conversion\n\nJS is notorious for its implicit type conversion (coercion). This is when the engine automatically converts one type to another to make an operation work.\n\n## String Conversion\nHappens when binary `+` is used with a string.\n\n```javascript\nString(123) // \"123\"\n123 + \"\" // \"123\"\n\"1\" + 2 // \"12\"\n```\n\n## Numeric Conversion\nHappens in math operations (except `+` with string).\n\n```javascript\nNumber(\"123\") // 123\n+\"123\" // 123 (Unary plus)\n\"6\" / \"2\" // 3\n\"6\" - \"2\" // 4\ntrue + 1 // 2 (true becomes 1)\nfalse + 1 // 1 (false becomes 0)\nundefined + 1 // NaN\nnull + 1 // 1 (null becomes 0)\n```\n\n## Boolean Conversion\nHappens in logical operations or `if` checks.\n\n**Falsy values** (Evaluate to false):\n* `false`\n* `0`, `-0`, `0n`\n* `null`, `undefined`, `NaN`\n* Empty strings (`\"\"` or `''`)\n\n**Truthy values**:\n* Everything else.\n* `[]` (Empty array is true!)\n* `{}` (Empty object is true!)\n* `\"0\"` (Non-empty string is true!)\n\n## The `==` vs `===` Debate\n* `==` (Loose equality): Performs type coercion before comparing.\n* `===` (Strict equality): Checks value AND type. No coercion.\n\n**ALWAYS USE `===`** (unless you have a very specific reason not to).\n\n```javascript\n0 == false // true (scary)\n0 === false // false (safe)\n\"\" == false // true (scary)\n\"\" === false // false (safe)\n```",
          "quiz": [
            {
              "question": "What is the result of \"5\" - 1?",
              "options": ["\"51\"", "4", "NaN", "TypeError"],
              "answer": 1
            },
            {
              "question": "What is the result of \"5\" + 1?",
              "options": ["\"51\"", "6", "NaN", "TypeError"],
              "answer": 0
            },
            {
              "question": "Is an empty array [] truthy or falsy?",
              "options": ["Truthy", "Falsy"],
              "answer": 0
            },
            {
              "type": "fill-in-the-blanks",
              "question": "Strict equality operator is [BLANK] and loose equality is [BLANK].",
              "text": "Strict: [BLANK], Loose: [BLANK]",
              "answer": "===" 
            }
          ]
        }
      ]
    },
    {
      "id": "module-2",
      "title": "Module 2: Advanced Scope & Closures",
      "lessons": [
        {
          "id": "hoisting-tdz",
          "title": "Hoisting & The Temporal Dead Zone",
          "content": "# Hoisting Deep Dive\n\nHoisting is JavaScript's default behavior of moving declarations to the top. However, it works differently for `var`, `function`, `let`, and `const`.\n\n## Function Hoisting\nFully hoisted. You can call them before definition.\n\n```javascript\nsayHi(); // \"Hi\"\n\nfunction sayHi() {\n  console.log(\"Hi\");\n}\n```\n\n## Var Hoisting\nThe **declaration** is hoisted, but the **initialization** is not. The value is `undefined`.\n\n```javascript\nconsole.log(a); // undefined\nvar a = 5;\n```\n\n## Let/Const and the TDZ\nVariables declared with `let` and `const` are technically hoisted, but they are placed in a **Temporal Dead Zone (TDZ)**. Accessing them before the declaration throws a `ReferenceError`.\n\n```javascript\nconsole.log(b); // ReferenceError: Cannot access 'b' before initialization\nlet b = 10;\n```\n\nThis is a safety feature to prevent bugs caused by using variables before they exist.",
          "quiz": [
            {
              "question": "What is the value of a 'var' variable before its declaration line?",
              "options": ["null", "undefined", "ReferenceError", "0"],
              "answer": 1
            },
            {
              "question": "What happens if you access a 'let' variable before declaration?",
              "options": ["undefined", "null", "ReferenceError", "It works normally"],
              "answer": 2
            }
          ]
        },
        {
          "id": "closures-advanced",
          "title": "Advanced Closures & Memory",
          "content": "# Advanced Closures\n\nA closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created, at function creation time.\n\n## Practical Example: Data Hiding\nYou can use closures to emulate private methods.\n\n```javascript\nconst makeCounter = function() {\n  let privateCounter = 0;\n  \n  function changeBy(val) {\n    privateCounter += val;\n  }\n  \n  return {\n    increment: function() {\n      changeBy(1);\n    },\n    decrement: function() {\n      changeBy(-1);\n    },\n    value: function() {\n      return privateCounter;\n    }\n  };\n};\n\nconst counter1 = makeCounter();\nconst counter2 = makeCounter();\n\ncounter1.increment();\nconsole.log(counter1.value()); // 1\nconsole.log(counter2.value()); // 0 (State is independent)\n```\n\n## The Loop Problem\nA classic interview question.\n\n```javascript\n// BAD\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Output: 3, 3, 3 (Because var has function scope)\n\n// GOOD (Using let)\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}\n// Output: 0, 1, 2 (let has block scope, creating a new binding each iteration)\n```",
          "quiz": [
            {
              "type": "code-writing",
              "question": "Create a function 'secret' that returns a function which returns the string 'hidden'.",
              "starterCode": "function secret() {\n}",
              "testCase": "secret()() === 'hidden'"
            },
            {
              "question": "Does each instance of a closure share the same scope variables?",
              "options": ["Yes, always", "No, they have independent environments", "Only if declared with var", "Only in strict mode"],
              "answer": 1
            }
          ]
        }
      ]
    },
    {
      "id": "module-3",
      "title": "Module 3: Objects & Prototypes Deep Dive",
      "lessons": [
        {
          "id": "this-keyword",
          "title": "Mastering 'this'",
          "content": "# The 'this' Keyword\n\n`this` is determined by **how a function is called**. It is not determined by where it is written (except for arrow functions).\n\n## The 4 Rules\n1.  **Default Binding**: Standalone function call. `this` is Global (or `undefined` in strict mode).\n2.  **Implicit Binding**: Called as a method `obj.func()`. `this` is `obj`.\n3.  **Explicit Binding**: Using `.call()`, `.apply()`, or `.bind()`.\n4.  **New Binding**: Using `new Constructor()`. `this` is the new object.\n\n## Call, Apply, Bind\n*   `call(thisArg, arg1, arg2)`: Invokes immediately.\n*   `apply(thisArg, [args])`: Invokes immediately, takes array.\n*   `bind(thisArg)`: Returns a **new function** with `this` permanently bound.\n\n```javascript\nfunction greet() {\n  console.log(this.name);\n}\n\nconst user = { name: \"Fez\" };\ngreet.call(user); // \"Fez\"\n```\n\n## Arrow Functions\nArrow functions ignore the rules above. They inherit `this` from the surrounding lexical scope at the time of definition.\n\n```javascript\nconst obj = {\n  name: \"Fez\",\n  sayLater: function() {\n    setTimeout(() => {\n      console.log(this.name); // Works because arrow function captures 'this' from sayLater\n    }, 100);\n  }\n};\n```",
          "quiz": [
            {
              "type": "matching",
              "question": "Match the binding type to its syntax",
              "pairs": [
                {"left": "Implicit", "right": "obj.method()"},
                {"left": "Explicit", "right": "func.call(obj)"},
                {"left": "New", "right": "new Func()"},
                {"left": "Lexical", "right": "() => {}"}
              ]
            },
            {
              "question": "What does .bind() return?",
              "options": ["The result of the function", "A new bound function", "undefined", "The object passed in"],
              "answer": 1
            }
          ]
        },
        {
          "id": "prototypal-inheritance",
          "title": "Prototypal Inheritance Under the Hood",
          "content": "# Prototypal Inheritance\n\nJavaScript objects are linked. When you look up a property, the engine traverses the **Prototype Chain**.\n\n## __proto__ vs prototype\n*   `__proto__`: The actual object that an instance points to. (Deprecated but supported). Use `Object.getPrototypeOf()`.\n*   `prototype`: The object that will be assigned as the `__proto__` of instances created by this Constructor Function.\n\n```javascript\nfunction Dog(name) {\n  this.name = name;\n}\n\nDog.prototype.bark = function() {\n  console.log(\"Woof\");\n};\n\nconst d = new Dog(\"Rex\");\n// d.__proto__ === Dog.prototype\nd.bark();\n```\n\n## Object.create()\nThe cleanest way to link objects.\n\n```javascript\nconst parent = { a: 1 };\nconst child = Object.create(parent);\nchild.b = 2;\n\nconsole.log(child.a); // 1 (Found on prototype)\n```\n\n## Prototype Pollution\nBe careful when merging objects or handling JSON. If an attacker can modify `__proto__`, they can affect all objects in the application.",
          "quiz": [
            {
              "question": "What property exists on constructor functions to define shared methods?",
              "options": ["__proto__", "prototype", "methods", "constructor"],
              "answer": 1
            },
            {
              "type": "code-writing",
              "question": "Use Object.create to create an object 'child' with prototype 'parent'.",
              "starterCode": "const parent = {x: 1};\nconst child = ",
              "testCase": "Object.getPrototypeOf(child) === parent"
            }
          ]
        }
      ]
    },
    {
      "id": "module-4",
      "title": "Module 4: Async Mastery & The Event Loop",
      "lessons": [
        {
          "id": "event-loop",
          "title": "The Event Loop",
          "content": "# The Event Loop\n\nJavaScript is single-threaded, yet it can handle millions of requests. How? The **Event Loop**.\n\n## The Stack\nWhere synchronous code runs. LIFO (Last In, First Out).\n\n## The Heap\nMemory allocation happens here.\n\n## The Queue\nWhere async callbacks wait to be processed.\n\n## The Loop\nThe Event Loop simply checks: \"Is the Stack empty? If yes, take the first thing from the Queue and push it to the Stack.\"\n\n## Macro vs Micro Tasks\nNot all queues are equal.\n1.  **Macrotasks**: `setTimeout`, `setInterval`, `setImmediate`, I/O.\n2.  **Microtasks**: `Promise.then`, `process.nextTick`, `MutationObserver`.\n\n**Microtasks have priority.** The event loop will empty the ENTIRE microtask queue before moving to the next macrotask.\n\n```javascript\nconsole.log(1);\n\nsetTimeout(() => console.log(2), 0); // Macrotask\n\nPromise.resolve().then(() => console.log(3)); // Microtask\n\nconsole.log(4);\n\n// Order: 1, 4, 3, 2\n```",
          "quiz": [
            {
              "question": "Which runs first?",
              "options": ["Macrotasks (setTimeout)", "Microtasks (Promises)", "They run in parallel", "Random order"],
              "answer": 1
            },
            {
              "type": "fill-in-the-blanks",
              "question": "The Event Loop checks if the [BLANK] is empty.",
              "text": "Checks if [BLANK] is empty.",
              "answer": "stack"
            }
          ]
        },
        {
          "id": "async-await-patterns",
          "title": "Async Patterns: Serial vs Parallel",
          "content": "# Async Patterns\n\n## Serial Execution\nWaiting for one to finish before starting the next.\n\n```javascript\nasync function serial() {\n  const a = await taskA();\n  const b = await taskB(); // Waits for A to finish\n  return a + b;\n}\n```\n\n## Parallel Execution\nStarting both, then waiting for results. Much faster if tasks are independent.\n\n```javascript\nasync function parallel() {\n  const promiseA = taskA(); // Starts immediately\n  const promiseB = taskB(); // Starts immediately\n  \n  const a = await promiseA;\n  const b = await promiseB;\n  return a + b;\n}\n```\n\n## Promise.all()\nFails if ANY promise fails.\n\n```javascript\nconst [user, posts] = await Promise.all([\n  fetchUser(),\n  fetchPosts()\n]);\n```\n\n## Promise.allSettled()\nWaits for all to finish, regardless of success/failure.\n\n```javascript\nconst results = await Promise.allSettled([p1, p2]);\n```",
          "quiz": [
            {
              "question": "What happens if one promise in Promise.all() rejects?",
              "options": ["It ignores it", "The whole call rejects immediately", "It waits for others then rejects", "It returns null"],
              "answer": 1
            },
            {
              "type": "matching",
              "question": "Match the Promise method",
              "pairs": [
                {"left": "Promise.all", "right": "Fail Fast"},
                {"left": "Promise.allSettled", "right": "Wait for All"},
                {"left": "Promise.race", "right": "First One Wins"}
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "module-5",
      "title": "Module 5: ES6+ Modern Features",
      "lessons": [
        {
          "id": "generators-iterators",
          "title": "Generators & Iterators",
          "content": "# Generators\n\nFunctions that can be paused and resumed. Denoted by `function*`.\n\n```javascript\nfunction* idMaker() {\n  let index = 0;\n  while(true)\n    yield index++;\n}\n\nconst gen = idMaker();\nconsole.log(gen.next().value); // 0\nconsole.log(gen.next().value); // 1\n```\n\n## yield\nThe `yield` keyword pauses execution and returns a value.\n\n## Iterables\nObjects that implement the `Symbol.iterator` method. Arrays, Strings, Sets, Maps are built-in iterables. You can make custom objects iterable.\n\n```javascript\nconst myIterable = {\n  *[Symbol.iterator]() {\n    yield 1;\n    yield 2;\n    yield 3;\n  }\n};\n\nfor (let value of myIterable) {\n  console.log(value); \n}\n```",
          "quiz": [
            {
              "question": "Which keyword pauses a generator?",
              "options": ["stop", "pause", "yield", "await"],
              "answer": 2
            },
            {
              "question": "What symbol makes an object iterable?",
              "options": ["Symbol.iterator", "Symbol.loop", "Symbol.iterable", "Symbol.next"],
              "answer": 0
            }
          ]
        },
        {
          "id": "proxy-reflect",
          "title": "Proxy & Reflect",
          "content": "# Proxy\n\nThe `Proxy` object enables you to create a proxy for another object, which can intercept and redefine fundamental operations for that object.\n\nCommon traps: `get`, `set`, `has`, `deleteProperty`.\n\n```javascript\nconst target = {\n  message1: \"hello\",\n  message2: \"everyone\"\n};\n\nconst handler = {\n  get: function(target, prop, receiver) {\n    if (prop === \"secret\") return \"access denied\";\n    return Reflect.get(...arguments);\n  }\n};\n\nconst proxy = new Proxy(target, handler);\nconsole.log(proxy.message1); // \"hello\"\nconsole.log(proxy.secret); // \"access denied\"\n```\n\n## Reflect\n`Reflect` is a built-in object that provides methods for interceptable JavaScript operations. It makes forwarding operations from the Proxy handler to the target object easier and cleaner.\n\nUses:\n* Validation\n* Data Binding (Vue 3 uses Proxies)\n* Logging/Profiling",
          "quiz": [
            {
              "question": "What does a Proxy allow you to do?",
              "options": ["Speed up code", "Intercept object operations", "Create private variables", "Create to C++"],
              "answer": 1
            },
            {
              "type": "fill-in-the-blanks",
              "question": "The [BLANK] trap intercepts property access.",
              "text": "The [BLANK] trap.",
              "answer": "get"
            }
          ]
        }
      ]
    },
    {
      "id": "module-6",
      "title": "Module 6: Node.js Internals & Performance",
      "lessons": [
        {
          "id": "streams-buffers",
          "title": "Streams & Buffers",
          "content": "# Streams\n\nHandling large data efficiently. Instead of reading a 1GB file into memory, you read it in chunks.\n\n4 Types of Streams:\n1.  **Readable**: Source of data (fs.createReadStream).\n2.  **Writable**: Destination (fs.createWriteStream).\n3.  **Duplex**: Both (Sockets).\n4.  **Transform**: Modify data as it passes (zlib.createGzip).\n\n## Buffers\nNode.js implementation of binary data. Since JS historically didn't handle binary well, Buffers were introduced. They are fixed-length arrays of bytes.\n\n```javascript\nconst buf = Buffer.from('Hello');\nconsole.log(buf); // <Buffer 48 65 6c 6c 6f>\n```\n\n## Piping\nConnect a read stream to a write stream.\n\n```javascript\nreadStream.pipe(gzip).pipe(writeStream);\n```",
          "quiz": [
            {
              "question": "Which stream type is used for modifying data on the fly?",
              "options": ["Readable", "Writable", "Transform", "Duplex"],
              "answer": 2
            },
            {
              "question": "Buffers store what kind of data?",
              "options": ["String", "Object", "Binary", "JSON"],
              "answer": 2
            }
          ]
        },
        {
          "id": "clustering-workers",
          "title": "Clustering & Worker Threads",
          "content": "# Scaling Node.js\n\nNode is single-threaded. On a 16-core CPU, 15 cores sit idle if you run a single instance.\n\n## Cluster Module\nFork the process. Creates multiple instances of the app (Workers) that share the same server port. The OS balances the load.\n\n```javascript\nimport cluster from 'cluster';\nimport os from 'os';\n\nif (cluster.isPrimary) {\n  const cpus = os.cpus().length;\n  for (let i = 0; i < cpus; i++) {\n    cluster.fork();\n  }\n} else {\n  // Worker code\n}\n```\n\n## Worker Threads\nFor CPU-intensive tasks (image processing, crypto). Unlike Cluster (processes), these share memory and are lighter weight threads within the same process.\n\nUse `Worker Threads` for CPU work. Use `Cluster` for scaling HTTP throughput.",
          "quiz": [
            {
              "question": "Which module allows you to utilize multiple CPU cores for an HTTP server?",
              "options": ["fs", "worker_threads", "cluster", "crypto"],
              "answer": 2
            },
            {
              "type": "matching",
              "question": "Match the tool to the use case",
              "pairs": [
                {"left": "Cluster", "right": "Scale HTTP Server"},
                {"left": "Worker Threads", "right": "CPU Heavy Task"},
                {"left": "Event Loop", "right": "I/O Tasks"}
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "module-final",
      "title": "Final Assessment",
      "lessons": [
        {
          "id": "final-exam",
          "title": "Masterclass Final Exam",
          "content": "# Final Assessment\n\nCongratulations on reaching the end of the course. This final exam will test your knowledge across all modules.\n\n**Requirements:**\n1. Pass all questions.\n2. Prove your mastery.\n\nGood luck, developer.",
          "quiz": [
            {
              "question": "What is the output of: console.log(typeof NaN)?",
              "options": ["NaN", "undefined", "number", "object"],
              "answer": 2
            },
            {
              "question": "Which of these is NOT a reserved word in JS?",
              "options": ["interface", "throws", "program", "undefined"],
              "answer": 3
            },
            {
              "type": "code-writing",
              "question": "Write a function 'isEven' that returns true if a number is even.",
              "starterCode": "function isEven(n) {\n}",
              "testCase": "isEven(2) === true && isEven(3) === false"
            },
            {
              "type": "matching",
              "question": "Match the method to its action",
              "pairs": [
                {"left": "map", "right": "Transform"},
                {"left": "filter", "right": "Select"},
                {"left": "reduce", "right": "Accumulate"},
                {"left": "forEach", "right": "Iterate"}
              ]
            },
            {
              "type": "fill-in-the-blanks",
              "question": "The method to turn a JSON string into an object is JSON.[BLANK]().",
              "text": "JSON.[BLANK]()",
              "answer": "parse"
            },
            {
              "question": "In the event loop, which queue is processed first?",
              "options": ["Macrotask Queue", "Microtask Queue", "Callback Queue", "Render Queue"],
              "answer": 1
            },
            {
              "type": "code-writing",
              "question": "Create a generator function 'count' that yields 1, then 2.",
              "starterCode": "function* count() {\n}",
              "testCase": "const gen = count(); gen.next().value === 1 && gen.next().value === 2"
            }
          ]
        }
      ]
    }
  ]
}

# Ensure directory exists
os.makedirs('public/apps/js-masterclass', exist_ok=True)

# Write valid JSON
with open('public/apps/js-masterclass/course.json', 'w') as f:
    json.dump(course_data, f, indent=2)

print("course.json generated successfully")
