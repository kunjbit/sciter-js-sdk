#ifndef _sciter_edgewebview_h_
#define _sciter_edgewebview_h_

#define WIN32_LEAN_AND_MEAN
#include <atlbase.h>
#include <atlwin.h>
#include <shlobj.h>
#include <shlwapi.h>
#include <exdispid.h>
#include <windows.h>
#include <winrt/Windows.Foundation.h>

#include "win\include\WebView2EnvironmentOptions.h"
#ifdef _M_ARM64
#pragma comment(lib, "..\\..\\webview\\webview\\win\\arm64\\WebView2LoaderStatic.lib")
#elif defined(_WIN64)
#pragma comment(lib, "..\\..\\webview\\webview\\win\\x64\\WebView2LoaderStatic.lib")
#else
#pragma comment(lib, "..\\..\\webview\\webview\\win\\x86\\WebView2LoaderStatic.lib")
#endif

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "Shlwapi.lib")
#pragma comment(lib, "windowsapp")
#pragma comment(lib, "shell32.lib")

namespace webview
{

#define WMU_NAVIGATION_CALL (WM_USER + 1)
#define WMU_JS_BRIDGE_CALL (WM_USER + 2)
#define WMU_DISPATCH_RUN (WM_USER + 3)

    class webview2_com_handler
        : public ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler,
          public ICoreWebView2CreateCoreWebView2ControllerCompletedHandler,
          public ICoreWebView2WebMessageReceivedEventHandler,
          public ICoreWebView2PermissionRequestedEventHandler,
          public ICoreWebView2NavigationStartingEventHandler,
          public ICoreWebView2NavigationCompletedEventHandler,
          public ICoreWebView2DocumentTitleChangedEventHandler
    {
        using webview2_com_handler_cb_t =
            std::function<void(ICoreWebView2Controller *)>;

    public:
        webview2_com_handler(HWND hWnd, webview2_com_handler_cb_t cb)
            : m_hWnd(hWnd), m_cb(cb) {}
        virtual ~webview2_com_handler()
        {
            m_hWnd = NULL;
        }
        STDMETHODIMP_(ULONG)
        AddRef() { return 1; }
        STDMETHODIMP_(ULONG)
        Release() { return 1; }
        STDMETHODIMP QueryInterface(REFIID riid, LPVOID *ppv)
        {
            return S_OK;
        }
        STDMETHODIMP Invoke(HRESULT res, ICoreWebView2Environment *env)
        {
            env->CreateCoreWebView2Controller(m_hWnd, this);
            return S_OK;
        }
        STDMETHODIMP Invoke(HRESULT res, ICoreWebView2Controller *controller)
        {
            ICoreWebView2 *webview = nullptr;
            EventRegistrationToken token;
            if (S_OK == controller->get_CoreWebView2(&webview))
            {
                webview->add_WebMessageReceived(this, &token);
                webview->add_PermissionRequested(this, &token);
                webview->add_NavigationStarting(this, &token);
                webview->add_NavigationCompleted(this, &token);
                webview->add_DocumentTitleChanged(this, &token);
                webview->Release();
            }
            m_cb(controller);
            return S_OK;
        }
        STDMETHODIMP Invoke(ICoreWebView2 *sender, ICoreWebView2WebMessageReceivedEventArgs *args)
        {
            LPWSTR message = nullptr;
            if (S_OK == args->TryGetWebMessageAsString(&message))
            {
                std::string strMsg = winrt::to_string(message);
                SendMessage(m_hWnd, WMU_JS_BRIDGE_CALL, 0, (LPARAM)strMsg.c_str());
                sender->PostWebMessageAsString(message);
                ::CoTaskMemFree(message);
            }
            return S_OK;
        }
        STDMETHODIMP Invoke(ICoreWebView2 *sender, ICoreWebView2PermissionRequestedEventArgs *args)
        {
            COREWEBVIEW2_PERMISSION_KIND kind;
            args->get_PermissionKind(&kind);
            if (kind == COREWEBVIEW2_PERMISSION_KIND_CLIPBOARD_READ)
            {
                args->put_State(COREWEBVIEW2_PERMISSION_STATE_ALLOW);
            }
            return S_OK;
        }

        STDMETHODIMP Invoke(ICoreWebView2 *sender, ICoreWebView2NavigationStartingEventArgs *args)
        {
            LPWSTR uri = nullptr;
            if (S_OK == args->get_Uri(&uri))
            {
                std::string strUrl = winrt::to_string(uri);
                SendMessage(m_hWnd, WMU_NAVIGATION_CALL, DISPID_BEFORENAVIGATE2, (LPARAM)strUrl.c_str());
                ::CoTaskMemFree(uri);
            }
            return S_OK;
        }

        STDMETHODIMP Invoke(ICoreWebView2 *sender, ICoreWebView2NavigationCompletedEventArgs *args)
        {
            BOOL success = FALSE;
            args->get_IsSuccess(&success);
            if (success)
            {
                SendMessage(m_hWnd, WMU_NAVIGATION_CALL, DISPID_NAVIGATECOMPLETE2, 0);
            }
            else
            {
                SendMessage(m_hWnd, WMU_NAVIGATION_CALL, DISPID_NAVIGATEERROR, 0);
            }
            return S_OK;
        }

        STDMETHODIMP Invoke(ICoreWebView2* sender, IUnknown* args)
        {
            LPWSTR title = nullptr;
            if (S_OK == sender->get_DocumentTitle(&title)) {
                std::string strTitle = winrt::to_string(title);
                SendMessage(m_hWnd, WMU_NAVIGATION_CALL, DISPID_TITLECHANGE, (LPARAM)strTitle.c_str());
                ::CoTaskMemFree(title);
            }
            return S_OK;
        }

    private:
        HWND m_hWnd;
        webview2_com_handler_cb_t m_cb;
    };

    class SciterEdgeWebView : public CWindowImpl<SciterEdgeWebView>
    {
    public:
        // Optionally specify name of the new Windows class
        DECLARE_WND_CLASS(_T("SciterWebView"))

        BEGIN_MSG_MAP(SciterEdgeWebView)
            MESSAGE_HANDLER(WM_CREATE, OnCreate)
            MESSAGE_HANDLER(WM_DESTROY, OnDestroy)
            MESSAGE_HANDLER(WM_SIZE, OnSize)
            MESSAGE_HANDLER(WM_ERASEBKGND, OnEraseBKG)
            MESSAGE_HANDLER(WMU_NAVIGATION_CALL, OnNavigationCall)
            MESSAGE_HANDLER(WMU_JS_BRIDGE_CALL, OnJsBridgeCall)
            MESSAGE_HANDLER(WMU_DISPATCH_RUN, OnDispatchRun)
        END_MSG_MAP()

        void navigate(const std::string &url)
        {
            auto wurl = winrt::to_hstring(url);
            m_webview->Navigate(wurl.c_str());
        }

        void set_html(const std::string &html)
        {
            auto whtml = winrt::to_hstring(html);
            m_webview->NavigateToString(whtml.c_str());
        }

        void reload()
        {
            m_webview->Reload();
        }

        void go_back()
        {
            m_webview->GoBack();
        }

        void go_forward()
        {
            m_webview->GoForward();
        }

        void stop()
        {
            m_webview->Stop();
        }

        void init(const std::string &js)
        {
            auto wjs = winrt::to_hstring(js);
            m_webview->AddScriptToExecuteOnDocumentCreated(wjs.c_str(), nullptr);
        }

        void eval(const std::string &js)
        {
            auto wjs = winrt::to_hstring(js);
            m_webview->ExecuteScript(wjs.c_str(), nullptr);
        }

        void dispatch(std::function<void()> f)
        {
            PostMessage(WMU_DISPATCH_RUN, 0, (LPARAM) new dispatch_fn_t(f));
        }

        void set_navigation_callback(const navigation_callback_t &cb)
        {
            m_navigationCallback = cb;
        }

        void set_msg_callback(const msg_callback_t &cb)
        {
            m_msgCallback = cb;
        }

        ICoreWebView2 *m_webview = nullptr;
        ICoreWebView2Controller *m_controller = nullptr;
        navigation_callback_t m_navigationCallback;
        msg_callback_t m_msgCallback;

    protected:
        LRESULT OnCreate(UINT /*nMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/,
                         BOOL & /*bHandled*/)
        {
            ShowWindow(SW_SHOW);
            UpdateWindow();
            SetFocus();

            std::atomic_flag flag = ATOMIC_FLAG_INIT;
            flag.test_and_set();

            wchar_t currentExePath[MAX_PATH];
            GetModuleFileNameW(NULL, currentExePath, MAX_PATH);
            wchar_t *currentExeName = PathFindFileNameW(currentExePath);

            wchar_t dataPath[MAX_PATH];
            if (!SUCCEEDED(SHGetFolderPathW(NULL, CSIDL_APPDATA, NULL, 0, dataPath)))
            {
                return false;
            }
            wchar_t userDataFolder[MAX_PATH];
            PathCombineW(userDataFolder, dataPath, currentExeName);

            m_webview2_handler = new webview2_com_handler(
                m_hWnd, [&](ICoreWebView2Controller *controller)
                {
                    m_controller = controller;
                    m_controller->AddRef();
                    m_controller->get_CoreWebView2(&m_webview);
                    flag.clear(); });
            HRESULT res = CreateCoreWebView2EnvironmentWithOptions(nullptr, userDataFolder, nullptr, m_webview2_handler);
            if (res != S_OK)
            {
                delete m_webview2_handler;
                m_webview2_handler = nullptr;
                return -1;
            }
            MSG msg = {};
            while (flag.test_and_set() && GetMessage(&msg, NULL, 0, 0))
            {
                TranslateMessage(&msg);
                DispatchMessage(&msg);
            }
            init("{window.external={invoke:(s)=>{window.chrome.webview.postMessage(s)}}}");
            return 0;
        }

        LRESULT OnDestroy(UINT /*nMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/,
                          BOOL & /*bHandled*/)
        {
            if (nullptr != m_controller)
            {
                m_controller->Release();
                m_controller = nullptr;
            }
            if (nullptr != m_webview)
            {
                m_webview->Release();
                m_webview = nullptr;
            }
            if (nullptr != m_webview2_handler)
            {
                delete m_webview2_handler;
                m_webview2_handler = nullptr;
            }
            return 1;
        }

        LRESULT OnEraseBKG(UINT /*nMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/,
                           BOOL &bHandled)
        {
            bHandled = TRUE;
            return 1;
        }

        LRESULT OnSize(UINT /*nMsg*/, WPARAM /*wParam*/, LPARAM lParam,
                       BOOL & /*bHandled*/)
        {
            LONG width = LOWORD(lParam);
            LONG height = HIWORD(lParam);
            RECT rc = {0, 0, width, height};
            m_controller->put_Bounds(rc);
            return 1;
        }

        LRESULT OnNavigationCall(UINT /*nMsg*/, WPARAM wParam, LPARAM lParam,
                                 BOOL &bHandled)
        {
            bHandled = TRUE;
            if (DISPID_BEFORENAVIGATE2 == wParam)
            {
                const std::string url = (const char *)lParam;
                m_navigationCallback("navigationStarting", url);
            }
            else if (DISPID_NAVIGATECOMPLETE2 == wParam)
            {
                m_navigationCallback("navigationCompleted", "0");
            }
            else if (DISPID_NAVIGATEERROR == wParam)
            {
                m_navigationCallback("navigationCompleted", "-1");
            }
            else if (DISPID_TITLECHANGE == wParam)
            {
                const std::string title = (const char*)lParam;
                m_navigationCallback("documentTitleChanged", title);
            }
            return 0;
        }

        LRESULT OnJsBridgeCall(UINT /*nMsg*/, WPARAM /*wParam*/, LPARAM lParam,
                               BOOL &bHandled)
        {
            bHandled = TRUE;
            const std::string str = (const char *)lParam;
            m_msgCallback(str);
            return 0;
        }

        LRESULT OnDispatchRun(UINT /*nMsg*/, WPARAM /*wParam*/, LPARAM lParam,
                              BOOL &bHandled)
        {
            bHandled = TRUE;
            dispatch_fn_t *fn = (dispatch_fn_t *)(lParam);
            (*fn)();
            delete fn;
            return 0;
        }

        webview2_com_handler *m_webview2_handler = nullptr;
    };

} // webview

#endif //_sciter_edgewebview_h_