#include "sciter_wkwebview.h"

#import <AppKit/AppKit.h>
#import <WebKit/WebKit.h>

@interface SciterWKWebViewDelegate : NSObject <WKUIDelegate, WKNavigationDelegate, WKScriptMessageHandler>

@property (nonatomic, assign) webview::sciter_wkwebview* webEngine;

@end

@implementation SciterWKWebViewDelegate

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
    if ([keyPath isEqualToString:@"title"]) {
        WKWebView* webview = (__bridge WKWebView*)(self.webEngine->m_webview);
        if (object == webview) {
            NSString* title = [change objectForKey:NSKeyValueChangeNewKey];
            self.webEngine->m_navigationCallback("documentTitleChanged", title.UTF8String);
        }
    }
    // ???? [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
}

- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(null_unspecified WKNavigation *)navigation {
    self.webEngine->m_navigationCallback("navigationStarting", webView.URL.absoluteString.UTF8String);
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(null_unspecified WKNavigation *)navigation withError:(nonnull NSError *)error {
    self.webEngine->m_navigationCallback("navigationCompleted", "-1");
}

- (void)webView:(WKWebView *)webView didCommitNavigation:(null_unspecified WKNavigation *)navigation {
    //Do nothing
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(null_unspecified WKNavigation *)navigation {
    self.webEngine->m_navigationCallback("navigationCompleted", "0");
}

- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    self.webEngine->m_navigationCallback("navigationCompleted", "-1");
}

- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(nonnull NSString *)message initiatedByFrame:(nonnull WKFrameInfo *)frame completionHandler:(nonnull void (^)())completionHandler {
    NSAlert* alert = [[NSAlert alloc] init];
    alert.messageText = message;
    [alert runModal];
    completionHandler();
}

- (void)webView:(WKWebView *)webView runJavaScriptConfirmPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(BOOL))completionHandler {
    NSAlert* alert = [[NSAlert alloc] init];
    alert.messageText = message;
    [alert addButtonWithTitle:@"Confirm"];
    [alert addButtonWithTitle:@"Cancel"];
    NSModalResponse resp = [alert runModal];
    completionHandler(resp == NSAlertFirstButtonReturn);
}

- (void)webView:(WKWebView *)webView runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt defaultText:(NSString *)defaultText initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(NSString * _Nullable))completionHandler {
    NSTextField* field = [[NSTextField alloc] initWithFrame:CGRectMake(0, 0, 200, 24)];
    NSAlert* alert = [[NSAlert alloc] init];
    alert.informativeText = prompt;
    alert.messageText = defaultText;
    alert.accessoryView = field;
    [alert addButtonWithTitle:@"Confirm"];
    [alert addButtonWithTitle:@"Cancel"];
    NSModalResponse resp = [alert runModal];
    completionHandler(resp == NSAlertFirstButtonReturn ? field.stringValue : nullptr);
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    NSString* body = message.body;
    self.webEngine->m_msgCallback(body.UTF8String);
}

@end

namespace webview
{

    sciter_wkwebview::sciter_wkwebview(bool debug /*= false*/, void *parent /*= nullptr*/) {
        NSView* nsParentView = (__bridge NSView*)parent;

        WKWebViewConfiguration* config = [[WKWebViewConfiguration alloc] init];
        WKUserContentController* controller = config.userContentController;
        if (debug) {
            [config.preferences setValue:[NSNumber numberWithBool:debug] forKey:@"developerExtrasEnabled"];
        }
        [config.preferences setValue:[NSNumber numberWithBool:true] forKey:@"fullScreenEnabled"];
        [config.preferences setValue:[NSNumber numberWithBool:true] forKey:@"javaScriptCanAccessClipboard"];
        [config.preferences setValue:[NSNumber numberWithBool:true] forKey:@"DOMPasteAllowed"];
        config.preferences.javaScriptEnabled = YES;

        SciterWKWebViewDelegate* wkDelegate = [[SciterWKWebViewDelegate alloc] init];
        wkDelegate.webEngine = this;
        m_webviewDelegate = (__bridge void*)wkDelegate;

        [controller addScriptMessageHandler:wkDelegate name:@"external"];
    
        WKWebView* webview = [[WKWebView alloc] initWithFrame:nsParentView.bounds configuration:config];
        webview.navigationDelegate = wkDelegate;
        webview.UIDelegate = wkDelegate;
        [webview addObserver:wkDelegate forKeyPath:@"title" options:NSKeyValueObservingOptionNew context:nil];
        [nsParentView addSubview:webview];
        
        m_controller = (__bridge void*)controller;
        m_webview = (__bridge void*)webview;
        m_window = m_webview;

        init("{window.external={invoke:(s)=>{window.webkit.messageHandlers.external.postMessage(s)}}}");
    }

    sciter_wkwebview::~sciter_wkwebview() {
        SciterWKWebViewDelegate* webviewDelegate = (__bridge_transfer SciterWKWebViewDelegate*)m_webviewDelegate;
        WKWebView* webview = (__bridge WKWebView*)m_webview;
        [webview removeObserver:webviewDelegate forKeyPath:@"title"];
        webview.navigationDelegate = nil;
        webview.UIDelegate = nil;
        webviewDelegate = nil;
        m_controller = nullptr;
        m_webview = nullptr;
    }

    void sciter_wkwebview::navigate(const std::string &url) {
        WKWebView* webview = (__bridge WKWebView*)m_webview;
        NSString* strUrl = [NSString stringWithUTF8String:url.c_str()];
        [webview loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:strUrl]]];
    }

    void sciter_wkwebview::reload() {
        WKWebView* webview = (__bridge WKWebView*)m_webview;
        [webview reload];
    }

    void sciter_wkwebview::go_back() {
        WKWebView* webview = (__bridge WKWebView*)m_webview;
        [webview goBack];
    }

    void sciter_wkwebview::go_forward() {
        WKWebView* webview = (__bridge WKWebView*)m_webview;
        [webview goForward];
    }

    void sciter_wkwebview::stop() {
        WKWebView* webview = (__bridge WKWebView*)m_webview;
        [webview stopLoading];
    }

    void* sciter_wkwebview::window() {
        return m_window;
    }

    void sciter_wkwebview::set_size(int width, int height, int hints) {
        //Do nothing with autoresizingMask has been set to auo;
    }

    void sciter_wkwebview::init(const std::string &js) {
        NSString* strJS = [NSString stringWithUTF8String:js.c_str()];
        WKUserScript* userScript = [[WKUserScript alloc] initWithSource:strJS injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
        WKUserContentController* userCtrl = (__bridge WKUserContentController*)m_controller;
        [userCtrl addUserScript:userScript];
    }

    void sciter_wkwebview::eval(const std::string &js) {
        NSString* strJS = [NSString stringWithUTF8String:js.c_str()];
        WKWebView* webview = (__bridge WKWebView*)m_webview;
        [webview evaluateJavaScript:strJS completionHandler:nil];
    }
    
    void sciter_wkwebview::set_html(const std::string& html) {
        WKWebView* webview = (__bridge WKWebView*)m_webview;
        NSString* strHtmlContent = [NSString stringWithUTF8String:html.c_str()];
        [webview loadHTMLString:strHtmlContent baseURL:NSBundle.mainBundle.bundleURL];
    }

    void sciter_wkwebview::dispatch(std::function<void()> f) {
        dispatch_async(dispatch_get_main_queue(), ^{
            f();
        });
    }

    void sciter_wkwebview::set_navigation_callback(const navigation_callback_t &cb) {
        m_navigationCallback = cb;
    }

    void sciter_wkwebview::set_msg_callback(const msg_callback_t& cb) {
        m_msgCallback = cb;
    }

}
