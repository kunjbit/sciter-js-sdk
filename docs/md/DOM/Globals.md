---
sidebar_position: 0
title: Globals
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Global variables and methods


## Console

### console.log()

```js
console.log(...)
```

Prints log message to either application configured debug output stream or to inspector's log view. 

```js
console.log("format", ...)
```

Prints log message using C-style [printf conventions](https://en.cppreference.com/w/cpp/io/c/fprintf).

### console.warn()
### console.error()

Same as `console.log()` but prints messages using different meta type. 

### console.reportException(err,isPromise)

Unhandled exceptions handler, all not handled exceptions go here. This function can be overriden to implement custom handler:

```js
console.reportException = function(err,isPromise) {
   Window.this.modal(<alert>{err.toString()}</alert>);
   return "";
}
```


## Timers and intervals

### setTimeout()

```js
setTimeout(func:function,milliseconds:int): timerId
```

Calls the _func_ after _milliseconds_ timeout.

The function returns timer id value that can be used with `clearTimeout()`

### clearTimeout()

```js
clearTimeout(timerId)
```

The function cancels previously created timer.

tip:::
Sciter provides also element [timers](Element#timer) that can work as timeouts and intervals:
```js
  document.timer(500ms, ()=>{ ... });
```
In some cases they are more flexible as they also support auto cancelling to implement effective call throttling.
:::

### setInterval()

```js
setInterval(func,milliseconds): intId
```

Calls the _func_ periodically with _milliseconds_ interval. Retuns interval ID.

### clearInterval()

```js
 clearInterval(intId)
```

Stops interval by its _intId_.

### requestAnimationFrame()

```js
requestAnimationFrame(func): animId
```

Schedules _func_ to be executed at next paint event (<= 16ms - 60 FPS usually).

The function gets executed once, so for periodic calls it needs to be called inside that _func_ again.

### cancelAnimationFrame(a)

```js
cancelAnimationFrame(animId)
```

## HTTP client

### fetch()

```js
fetch(url:string | Request [, options:object]): Response
```
see [Fetch](../JS.runtime/Fetch)

## Sciter specific

### printf()

```js
printf(format:string, ...):string
```
  
This function does formatting of arguments using C-style [printf conventions](https://en.cppreference.com/w/cpp/io/c/fprintf).
  
Returns formatted string.

In Sciter list of standard formatting types is extended by these two: 

+ `%v` - takes argument and prints it as `JSON.stringify(arg)`;
+ `%V` - takes argument and prints it as `JSON.stringify(arg, null, "  ")`;

### scanf()

```js
scanf(format:string, input: string) : [...]
```

Takes *input* string and parses it according the *format* specification using C-style [scanf conventions](https://en.cppreference.com/w/c/io/fscanf). 

Returns list (array) of successfully parsed values.

### evalModule()

```js
evalModule(text:string [,url:string]):object
```
  
"module" version of JS stock `eval()` function - evaluates the text as a module body.
  
If the _url_ is provided it is used as a base URL for resolving relative paths in `import ... from "relpath"` statements inside.

The function returns module's exported data as an object.

### loadScript()

```js
loadScript(url:string);
```
Loads and executes JavaScript at url synchronously.

That's an equivalent of 
```js
document.append(<script src=url />);
```
but without physical DOM update.

### loadScriptModule()

```js
loadScriptModule(url:string): object
```
Loads and executes JavaScript module at url synchronously. Returns modules export object.

That's an equivalent of 
```js
document.append(<script src=url />);
```
but without physical DOM update.
  

## global properties

### globalThis

object, global namespace, aliased as `window` for compatibility with browsers.

### devicePixelRatio

float, number of physical screen pixels in logical CSS px (dip).
