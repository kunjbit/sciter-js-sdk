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
1) Build dll/dylib/so file with projects in folder 'build';
2) Put dll/dylib/so file into sciter application running folder;
3) Use \<webview\> and define in css: webview {behavior: webview library(sciter-webview)}

Internal Behavior: 
1) Copy all files in folder [source](https://gitlab.com/ArcRain/sciter-webview/-/tree/main/source) into sciter-js-sdk [include/behaviors](https://gitlab.com/sciter-engine/sciter-js-sdk/-/tree/main/include/behaviors)
2) Compile application project;
3) Use \<webview\> and define in css: webview {behavior: webview}

## Reference & Acknowledgment

[webview](https://github.com/webview/webview) - A tiny cross-platform webview library for C/C++/Go to build modern cross-platform GUIs.

## License

Code is distributed under BSD 3-Clause License.