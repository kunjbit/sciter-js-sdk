# Sciter WebView
A Sciter WebView is a Sciter behavior component. It can be used to incorporate web content seamlessly into your Sciter app's UI.

The goal is to implement `<webview>` controller (as Sciter's behavior) so Sciter will be able to load and interact with arbitrary web pages.

## Demos
![Sciter WebView](https://sciter.com/wp-content/uploads/2022/04/sciter-webview.png)

## Features
* Windows - use WebView2 
* macOS - use WKWebView
* Linux - use WebKitGTK2
* Supports two-way JavaScript bindings (to call JavaScript from SciterJS and to call SciterJS from JavaScript).
* Supports alert, confirm and prompt dialogs
* Supports navigation load, go back, go forward, reload, stop

## Platforms
* Windows - i32, i64 and arm64
* macOS - i64 and arm64
* Linux - i64

## Usage
External Behavior: 
1. Build dll/dylib/so file with projects in folder 'build';
2. Put dll/dylib/so file into sciter application running folder;
3. Use \<webview\> and define in css: webview {behavior: webview library(sciter-webview)}

Internal Behavior: 
1. Copy all files in folder [source](https://gitlab.com/ArcRain/sciter-webview/-/tree/main/source) into sciter-js-sdk [include/behaviors](https://gitlab.com/sciter-engine/sciter-js-sdk/-/tree/main/include/behaviors)
2. Compile application project;
3. Use \<webview\> and define in css: webview {behavior: webview}

## JS API

### Methods

#### element.webview.loadUrl

```JS
  element.webview.loadUrl(url:string);
```
navigates to URL

#### element.webview.loadHtml

```JS
  element.webview.loadHtml(html:string);
```
loads the HTML

#### element.webview.reload

```JS
  element.webview.reload();
```
re-loads last loaded document.

#### element.webview.goBack

```JS
  element.webview.goBack();
```
navigates backward.

#### element.webview.goForward

```JS
  element.webview.goForward();
```
navigates forward.

#### element.webview.evaluateJavaScript

```JS
  element.webview.evaluateJavaScript(jssrc:string);
```
evaluates _jssrc_ in context of loaded document.

### Properties

#### element.webview.currentSrc

```JS
  const url = element.webview.currentSrc;
```
read-only, string, reports current URL of loaded document

#### element.webview.src

```JS
  const url = element.webview.src;
```
read-write, string, URL to navigate

### Events

#### "webview-ready"

```JS
  element.on("webview-ready", function() {...});
```
WebView is initialized and ready to accept method calls.

#### "webview-unavailable"

```JS
  element.on("webview-unavailable", function() {...});
```
WebView is failed to initialize. System rejected webview creation for some reason.

#### "webview-will-navigate"

```JS
  element.on("webview-will-navigate", function(evt) { const url = evt.data; ...});
```

WebView will navigate to the _url_.

#### "webview-did-navigate"

```JS
  element.on("webview-did-navigate", function() {...});
```

WebView navigated to requested URL successfully.

#### "webview-navigate-failure"

```JS
  element.on("webview-navigate-failure", function() {...});
```

WebView failed to navigate to requested URL for some reasons.

#### "webview-title-change"

```JS
  element.on("webview-title-change", function(evt) { const title = evt.data; ...});
```
WebView receives new document with the _title_.

## Reference & Acknowledgment

[webview](https://github.com/webview/webview) - A tiny cross-platform webview library for C/C++/Go to build modern cross-platform GUIs.

## License

Code is distributed under BSD 3-Clause License.