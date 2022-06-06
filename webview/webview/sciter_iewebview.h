#ifndef _sciter_iewebview_h_
#define _sciter_iewebview_h_

#define WIN32_LEAN_AND_MEAN
#include <string>
#include <atlbase.h>
#include <atlwin.h>
#include <shlobj.h>
#include <shlwapi.h>
#include <mshtml.h>
#include <mshtmdid.h>
#include <exdispid.h>

#include "aux-cvt.h"

#include <comutil.h>
#pragma comment(lib, "comsuppw.lib")
#pragma comment(lib, "Shlwapi.lib")

#ifdef WINDOWS
#ifndef THIS_HINSTANCE
EXTERN_C IMAGE_DOS_HEADER __ImageBase;
#define THIS_HINSTANCE ((HINSTANCE)&__ImageBase)
#endif
#endif

#define WMU_NAVIGATION_CALL (WM_USER + 1)
#define WMU_JS_BRIDGE_CALL (WM_USER + 2)
#define WMU_DISPATCH_RUN (WM_USER + 3)

CComModule _Module;

namespace webview
{
    // ---------------------------------------------------------------------
    // RKEY, quick registry access
    // Code From https://www.codeproject.com/Articles/1040618/Happy-Registry-A-Quick-Wrapper-for-the-Win32-Datab
    class RKEY
    {
    private:
        HKEY k = 0;

    public:
        class VALUE
        {
        public:
            std::wstring name;
            std::vector<char> value; // For enums
            HKEY k = 0;
            mutable DWORD ty = 0;

            VALUE(const wchar_t *s, HKEY kk)
            {
                if (s)
                    name = s;
                k = kk;
            }

            bool operator=(const wchar_t *val)
            {
                ty = REG_SZ;
                return RegSetValueEx(k, name.c_str(), 0, REG_SZ,
                                     (BYTE *)val, (DWORD)(wcslen(val) * sizeof(wchar_t))) == ERROR_SUCCESS;
            }
            bool operator=(unsigned long val)
            {
                ty = REG_DWORD;
                return RegSetValueEx(k, name.c_str(), 0, REG_DWORD,
                                     (BYTE *)&val, sizeof(val)) == ERROR_SUCCESS;
            }
            bool operator=(unsigned long long val)
            {
                ty = REG_QWORD;
                return RegSetValueEx(k, name.c_str(), 0, REG_QWORD,
                                     (BYTE *)&val, sizeof(val)) == ERROR_SUCCESS;
            }

            template <typename T>
            operator T() const
            {
                T ch = 0;
                RegQueryValueEx(k, name.c_str(), 0, &ty, 0, &ch);
                std::vector<char> d(ch + 10);
                ch += 10;
                RegQueryValueEx(k, name.c_str(), 0, &ty, (LPBYTE)d.data(), &ch);
                T ret = 0;
                memcpy(&ret, d.data(), sizeof(T));
                return ret;
            }

            operator std::wstring() const
            {
                DWORD ch = 0;
                RegQueryValueEx(k, name.c_str(), 0, &ty, 0, &ch);
                std::vector<char> d(ch + 10);
                ch += 10;
                RegQueryValueEx(k, name.c_str(), 0, &ty, (LPBYTE)d.data(), &ch);
                return std::wstring((const wchar_t *)d.data());
            }

            bool Delete()
            {
                return (RegDeleteValue(k, name.c_str()) == ERROR_SUCCESS);
            }
        };

        RKEY()
        {
            k = 0;
        }

        RKEY(HKEY kk)
        {
            k = kk;
        }

        RKEY(const RKEY &k)
        {
            operator=(k);
        }
        void operator=(const RKEY &r)
        {
            Close();
            DuplicateHandle(GetCurrentProcess(), r.k, GetCurrentProcess(),
                            (LPHANDLE)&k, 0, false, DUPLICATE_SAME_ACCESS);
        }

        RKEY(RKEY &&k)
        {
            operator=(std::forward<RKEY>(k));
        }
        void operator=(RKEY &&r)
        {
            Close();
            k = r.k;
            r.k = 0;
        }

        void operator=(HKEY kk)
        {
            Close();
            k = kk;
        }

        RKEY(HKEY root, const wchar_t *subkey, DWORD acc = KEY_ALL_ACCESS)
        {
            Load(root, subkey, acc);
        }
        bool Load(HKEY root, const wchar_t *subkey, DWORD acc = KEY_ALL_ACCESS)
        {
            Close();
            return (RegCreateKeyEx(root, subkey, 0, 0, 0, acc, 0, &k, 0) == ERROR_SUCCESS);
        }
        bool Open(HKEY root, const wchar_t *subkey, DWORD acc = KEY_ALL_ACCESS)
        {
            Close();
            return (RegOpenKeyEx(root, subkey, 0, acc, &k) == ERROR_SUCCESS);
        }

        void Close()
        {
            if (k)
                RegCloseKey(k);
            k = 0;
        }

        ~RKEY()
        {
            Close();
        }

        bool Valid() const
        {
            if (k)
                return true;
            return false;
        }

        bool DeleteSingle(const wchar_t *sub)
        {
            return (RegDeleteKey(k, sub) == ERROR_SUCCESS);
        }

        bool Delete(const wchar_t *sub = 0)
        {
            return (RegDeleteTree(k, sub) == ERROR_SUCCESS);
        }

        bool Flush()
        {
            return (RegFlushKey(k) == ERROR_SUCCESS);
        }

        std::vector<std::wstring> EnumSubkeys() const
        {
            std::vector<std::wstring> data;
            for (int i = 0;; i++)
            {
                std::vector<wchar_t> n(300);
                DWORD sz = (DWORD)n.size();
                if (RegEnumKeyEx(k, i, n.data(), &sz, 0, 0, 0, 0) != ERROR_SUCCESS)
                    break;
                data.push_back(n.data());
            }
            return data;
        }

        std::vector<VALUE> EnumValues() const
        {
            std::vector<VALUE> data;
            for (int i = 0;; i++)
            {
                std::vector<wchar_t> n(300);
                DWORD sz = (DWORD)n.size();
                DWORD ay = 0;
                RegEnumValue(k, i, n.data(), &sz, 0, 0, 0, &ay);
                std::vector<char> v(ay);
                DWORD ty = 0;
                sz = (DWORD)n.size();
                if (RegEnumValue(k, i, n.data(), &sz, 0, &ty, (LPBYTE)v.data(), &ay) != ERROR_SUCCESS)
                    break;

                VALUE x(n.data(), k);
                x.ty = ty;
                x.value = v;
                data.push_back(x);
            }
            return data;
        }

        VALUE operator[](const wchar_t *v) const
        {
            VALUE kv(v, k);
            return kv;
        }

        operator HKEY()
        {
            return k;
        }
    };

    class webbrowser2_com_handler : public IDocHostUIHandler, public IDispatch
    {
    public:
        webbrowser2_com_handler(IWebBrowser2 *webbrowser, HWND wnd)
            : m_webbrowser2(webbrowser), m_engineWnd(wnd){};
        virtual ~webbrowser2_com_handler()
        {
            m_webbrowser2 = nullptr;
        }

        void setInitJS(const std::string &js)
        {
            m_injectedJS.push_back(js);
        }

        void eval(const std::string &js)
        {
            std::wstring strJS(aux::utf2w(js.c_str()));
            CComPtr<IDispatch> pDispatch, pSrcDispatch;
            m_webbrowser2->get_Document(&pDispatch);
            if (nullptr == pDispatch)
            {
                return;
            }
            CComPtr<IHTMLDocument2> pDoc2;
            pDispatch->QueryInterface(IID_IHTMLDocument2, (void **)&pDoc2);
            if (nullptr == pDoc2)
            {
                return;
            }
            pDoc2->get_Script(&pSrcDispatch);

            CComBSTR bstrEval("eval");
            DISPID dispid = 0;
            BSTR props[1] = { bstrEval };
            if (S_OK != pSrcDispatch->GetIDsOfNames(IID_NULL, props, 1, LOCALE_SYSTEM_DEFAULT, &dispid))
            {
                return;
            }
            DISPPARAMS params;
            _variant_t arg(js.c_str());
            _variant_t result;
            EXCEPINFO excepInfo;
            UINT nArgErr = (UINT)-1;
            params.cArgs = 1;
            params.cNamedArgs = 0;
            params.rgvarg = &arg;
            pSrcDispatch->Invoke(dispid, IID_NULL, 0, DISPATCH_METHOD, &params, &result, &excepInfo, &nArgErr);
        }

        STDMETHODIMP_(ULONG)
        AddRef() { return 1; }
        STDMETHODIMP_(ULONG)
        Release() { return 1; }
        STDMETHODIMP QueryInterface(REFIID riid, LPVOID *ppv)
        {
            if ((riid == IID_IDispatch) || (riid == IID_IUnknown))
            {
                (*ppv) = static_cast<IDispatch *>(this);
                return S_OK;
            }
            else if (riid == IID_IDocHostUIHandler)
            {
                (*ppv) = static_cast<IDocHostUIHandler *>(this);
                return S_OK;
            }
            else
            {
                return E_NOINTERFACE;
            }
        }

        // IDocHostUIHandler Method
        STDMETHODIMP ShowContextMenu(
            /* [in] */ DWORD dwID,
            /* [in] */ POINT *ppt,
            /* [in] */ IUnknown *pcmdtReserved,
            /* [in] */ IDispatch *pdispReserved)
        {
            return m_spDefaultDocHostUIHandler->ShowContextMenu(dwID, ppt, pcmdtReserved, pdispReserved);
        }

        STDMETHODIMP GetHostInfo(
            /* [out][in] */ DOCHOSTUIINFO *pInfo)
        {
            m_spDefaultDocHostUIHandler->GetHostInfo(pInfo);
            pInfo->dwFlags = pInfo->dwFlags | DOCHOSTUIFLAG_NO3DBORDER | DOCHOSTUIFLAG_DPI_AWARE;
            return S_OK;
        }

        STDMETHODIMP ShowUI(
            /* [in] */ DWORD dwID,
            /* [in] */ IOleInPlaceActiveObject *pActiveObject,
            /* [in] */ IOleCommandTarget *pCommandTarget,
            /* [in] */ IOleInPlaceFrame *pFrame,
            /* [in] */ IOleInPlaceUIWindow *pDoc)
        {
            return m_spDefaultDocHostUIHandler->ShowUI(dwID, pActiveObject, pCommandTarget, pFrame, pDoc);
        }

        STDMETHODIMP HideUI(void) { return m_spDefaultDocHostUIHandler->HideUI(); }

        STDMETHODIMP UpdateUI(void) { return m_spDefaultDocHostUIHandler->UpdateUI(); }

        STDMETHODIMP EnableModeless(
            /* [in] */ BOOL fEnable)
        {
            return m_spDefaultDocHostUIHandler->EnableModeless(fEnable);
        }

        STDMETHODIMP OnDocWindowActivate(
            /* [in] */ BOOL fActivate)
        {
            return m_spDefaultDocHostUIHandler->OnDocWindowActivate(fActivate);
        }

        STDMETHODIMP OnFrameWindowActivate(
            /* [in] */ BOOL fActivate)
        {
            return m_spDefaultDocHostUIHandler->OnFrameWindowActivate(fActivate);
            ;
        }

        STDMETHODIMP ResizeBorder(
            /* [in] */ LPCRECT prcBorder,
            /* [in] */ IOleInPlaceUIWindow *pUIWindow,
            /* [in] */ BOOL fRameWindow)
        {
            return m_spDefaultDocHostUIHandler->ResizeBorder(prcBorder, pUIWindow, fRameWindow);
        }

        STDMETHODIMP TranslateAccelerator(
            /* [in] */ LPMSG lpMsg,
            /* [in] */ const GUID *pguidCmdGroup,
            /* [in] */ DWORD nCmdID)
        {
            return m_spDefaultDocHostUIHandler->TranslateAccelerator(lpMsg, pguidCmdGroup, nCmdID);
        }

        STDMETHODIMP GetOptionKeyPath(
            /* [out] */ LPOLESTR *pchKey,
            /* [in] */ DWORD dw)
        {
            return m_spDefaultDocHostUIHandler->GetOptionKeyPath(pchKey, dw);
        }

        STDMETHODIMP GetDropTarget(
            /* [in] */ IDropTarget *pDropTarget,
            /* [out] */ IDropTarget **ppDropTarget)
        {
            return m_spDefaultDocHostUIHandler->GetDropTarget(pDropTarget, ppDropTarget);
        }

        STDMETHODIMP GetExternal(
            /* [out] */ IDispatch **ppDispatch)
        {
            *ppDispatch = this;
            return S_OK;
        }

        STDMETHODIMP TranslateUrl(
            /* [in] */ DWORD dwTranslate,
            /* [in] */ OLECHAR *pchURLIn,
            /* [out] */ OLECHAR **ppchURLOut)
        {
            return m_spDefaultDocHostUIHandler->TranslateUrl(dwTranslate, pchURLIn, ppchURLOut);
        }

        STDMETHODIMP FilterDataObject(
            /* [in] */ IDataObject *pDO,
            /* [out] */ IDataObject **ppDORet)
        {
            return m_spDefaultDocHostUIHandler->FilterDataObject(pDO, ppDORet);
        }

        // Implement IDispatch Functions
        STDMETHODIMP GetTypeInfoCount(UINT *pctinfo)
        {
            *pctinfo = 0;
            return S_OK;
        }

        STDMETHODIMP GetTypeInfo(UINT iTInfo, LCID lcid,
                                 ITypeInfo **ppTInfo)
        {
            return E_FAIL;
        }

        STDMETHODIMP GetIDsOfNames(REFIID riid,
                                   LPOLESTR *rgszNames, UINT cNames, LCID lcid, DISPID *rgDispId)
        {
            if (cNames == 0 || rgszNames == NULL || rgszNames[0] == NULL || rgDispId == NULL)
            {
                return E_INVALIDARG;
            }
            if (lstrcmp(rgszNames[0], L"invoke") == 0)
            {
                *rgDispId = 12300;
                return S_OK;
            }
            return E_INVALIDARG;
        }

        STDMETHODIMP Invoke(DISPID dispIdMember,
                            REFIID riid, LCID lcid, WORD wFlags, DISPPARAMS *Params,
                            VARIANT *pVarResult, EXCEPINFO *pExcepInfo, UINT *puArgErr)
        {
            std::string strParam;
            if (DISPID_BEFORENAVIGATE2 == dispIdMember)
            {
                if (Params->cArgs >= 6)
                {
                    VARIANT val = *Params->rgvarg[5].pvarVal;
                    if (NULL != val.bstrVal) {
                        strParam = aux::w2utf(val.bstrVal);
                    }
                }
                SendMessage(m_engineWnd, WMU_NAVIGATION_CALL, DISPID_BEFORENAVIGATE2, (LPARAM)strParam.c_str());
            }
            else if (DISPID_NAVIGATECOMPLETE2 == dispIdMember)
            {
                SendMessage(m_engineWnd, WMU_NAVIGATION_CALL, DISPID_NAVIGATECOMPLETE2, 0);
            }
            else if (DISPID_NAVIGATEERROR == dispIdMember)
            {
                SendMessage(m_engineWnd, WMU_NAVIGATION_CALL, DISPID_NAVIGATEERROR, 0);
            }
            else if (DISPID_TITLECHANGE == dispIdMember)
            {
                if (Params->cArgs == 1)
                {
                    VARIANT val = Params->rgvarg[0];
                    if (NULL != val.bstrVal) {
                        strParam = aux::w2utf(val.bstrVal);
                    }
                    SendMessage(m_engineWnd, WMU_NAVIGATION_CALL, DISPID_TITLECHANGE, (LPARAM)strParam.c_str());
                }
            }
            else if (DISPID_BEFORESCRIPTEXECUTE == dispIdMember)
            {
                injectExternal();
            }
            else if (12300 == dispIdMember)
            {
                if (Params->cArgs == 1)
                {
                    VARIANT val = Params->rgvarg[0];
                    if (NULL != val.bstrVal) {
                        strParam = aux::w2utf(val.bstrVal);
                    }
                    SendMessage(m_engineWnd, WMU_JS_BRIDGE_CALL, 0, (LPARAM)strParam.c_str());
                }
            }
            return S_OK;
        }

        void injectExternal()
        {
            CComPtr<IDispatch> pDispatch;
            m_webbrowser2->get_Document(&pDispatch);
            if (nullptr == pDispatch)
            {
                return;
            }
            CComPtr<IHTMLDocument2> pDoc2;
            pDispatch->QueryInterface(IID_IHTMLDocument2, (void **)&pDoc2);
            if (nullptr == pDoc2)
            {
                return;
            }
            // Request default handler from MSHTML client site
            CComPtr<IOleObject> spOleObject;
            if (SUCCEEDED(pDoc2.QueryInterface(&spOleObject)))
            {
                CComPtr<IOleClientSite> spClientSite;
                HRESULT hr = spOleObject->GetClientSite(&spClientSite);
                if (SUCCEEDED(hr) && spClientSite)
                {
                    // Save pointer for delegation to default
                    m_spDefaultDocHostUIHandler = spClientSite;
                }
            }
            CComPtr<ICustomDoc> pCustomDoc;
            pDoc2->QueryInterface(IID_ICustomDoc, (void **)&pCustomDoc);
            if (nullptr != pCustomDoc)
            {
                pCustomDoc->SetUIHandler(this);
            }

            CComBSTR tagName;
            CComPtr<IHTMLElement> pInsertElem, pElement;
            CComPtr<IHTMLElementCollection> pCollection;
            pDoc2->get_all(&pCollection);
            LONG num = 0;
            pCollection->get_length(&num);
            CComPtr<IDispatch> pDisp;
            for (int i = 0; i < num; i++)
            {
                _variant_t idx = i;
                pCollection->item(idx, idx, &pDisp);
                pElement = nullptr;
                pDisp.QueryInterface(&pElement);
                pDisp = nullptr;
                pElement->get_tagName(&tagName);
                if (!_wcsicmp(L"head", tagName))
                {
                    pInsertElem = pElement;
                    break;
                }
                else if (!_wcsicmp(L"body", tagName))
                {
                    pInsertElem = pElement;
                    break;
                }
            }

            CComBSTR pos = "beforeEnd", jsHTML;
            for (std::vector<std::string>::iterator iter = m_injectedJS.begin(), iterEnd = m_injectedJS.end();
                 iter != iterEnd; iter++)
            {
                eval(*iter);
                continue;
                _bstr_t strJS = iter->c_str();
                pElement = nullptr;
                _bstr_t bstrScript = "script", bstrType = "text/javascript";
                pDoc2->createElement(bstrScript, &pElement);
                CComPtr<IHTMLScriptElement> pScriptElem;
                pElement->QueryInterface(IID_IHTMLScriptElement, (void **)&pScriptElem);
                pScriptElem->put_type(bstrType);
                pScriptElem->put_text(strJS);
                pElement->get_outerHTML(&jsHTML);
                pInsertElem->insertAdjacentHTML(pos, jsHTML);
            }
        }

    private:
        std::vector<std::string> m_injectedJS;
        CComPtr<IWebBrowser2> m_webbrowser2;
        CComPtr<IDocHostUIHandler> m_spDefaultDocHostUIHandler;
        HWND m_engineWnd;
    };

    class SciterIEWebView : public CWindowImpl<SciterIEWebView>
    {
    public:
        // Optionally specify name of the new Windows class
        DECLARE_WND_CLASS(_T("SciterIEWebView"))

        BEGIN_MSG_MAP(SciterIEWebView)
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
            _variant_t strUrl = url.c_str();
            _variant_t flags(navNoHistory);
            m_webbrowser2->Navigate2(&strUrl, &flags, nullptr, nullptr, nullptr);
        }

        void set_html(const std::string &html)
        {
            CComPtr<IDispatch> pDisp;
            m_webbrowser2->get_Document(&pDisp);
            if (nullptr == pDisp)
            {
                return;
            }

            _bstr_t strHTML = html.c_str();

            size_t size = strHTML.length();
            size_t k = size;
            size = (size + 1) * sizeof(wchar_t);
            HGLOBAL hHTMLText = GlobalAlloc(GPTR, size);
            wcscpy_s((wchar_t *)hHTMLText, size, strHTML.copy(false));
            CComPtr<IStream> pStream;
            HRESULT hr = CreateStreamOnHGlobal(hHTMLText, TRUE, &pStream);
            if (S_OK == hr)
            {
                CComPtr<IPersistStreamInit> pPersistStreamInit;
                pDisp.QueryInterface(&pPersistStreamInit);
                pPersistStreamInit->InitNew();
                pPersistStreamInit->Load(pStream);
            }
        }

        void reload()
        {
            VARIANT flags;
            flags.vt = VT_I4;
            flags.intVal = REFRESH_COMPLETELY;
            m_webbrowser2->Refresh2(&flags);
        }

        void go_back()
        {
            m_webbrowser2->GoBack();
        }

        void go_forward()
        {
            m_webbrowser2->GoForward();
        }

        void stop()
        {
            m_webbrowser2->Stop();
        }

        void init(const std::string &js)
        {
            m_handler->setInitJS(js);
        }

        void eval(const std::string &js)
        {
            m_handler->eval(js);
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

        CComPtr<IWebBrowser2> m_webbrowser2;
        navigation_callback_t m_navigationCallback;
        msg_callback_t m_msgCallback;

    protected:
        LRESULT OnCreate(UINT /*nMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/,
                         BOOL & /*bHandled*/)
        {
            // Browser Emulation
            std::vector<wchar_t> fn(1000);
            GetModuleFileName(0, fn.data(), 1000);
            PathStripPath(fn.data());
            RKEY k(HKEY_CURRENT_USER, L"SOFTWARE\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE_BROWSER_EMULATION");
            k[fn.data()] = 11000UL; // Use IE 11

            ShowWindow(SW_SHOW);
            UpdateWindow();
            SetFocus();

            m_browser.Create(m_hWnd, 0, 0, WS_CHILD | WS_CLIPCHILDREN);
            m_browser.CreateControl(OLESTR("shell.Explorer.2"));
            m_browser.QueryControl(&m_webbrowser2);
            m_browser.ShowWindow(SW_SHOW);
            m_handler = new webbrowser2_com_handler(m_webbrowser2, m_hWnd);

            CComPtr<IConnectionPointContainer> spConnectionPointContainer;
            CComPtr<IConnectionPoint> spConnectionPointBrowserEvents;
            m_webbrowser2->QueryInterface(IID_IConnectionPointContainer, (void **)&spConnectionPointContainer);
            spConnectionPointContainer->FindConnectionPoint(DIID_DWebBrowserEvents2, &spConnectionPointBrowserEvents);
            CComPtr<IUnknown> pUnk;
            m_handler->QueryInterface(IID_IUnknown, (void **)&pUnk);
            spConnectionPointBrowserEvents->Advise(pUnk, &m_dwCookie);

            return 0;
        }

        LRESULT OnDestroy(UINT /*nMsg*/, WPARAM /*wParam*/, LPARAM /*lParam*/,
                          BOOL & /*bHandled*/)
        {
            CComPtr<IConnectionPointContainer> spConnectionPointContainer;
            CComPtr<IConnectionPoint> spConnectionPointBrowserEvents;
            m_webbrowser2->QueryInterface(IID_IConnectionPointContainer, (void **)&spConnectionPointContainer);
            spConnectionPointContainer->FindConnectionPoint(DIID_DWebBrowserEvents2, &spConnectionPointBrowserEvents);
            spConnectionPointBrowserEvents->Unadvise(m_dwCookie);

            m_webbrowser2 = nullptr;
            m_browser.DestroyWindow();
            delete m_handler;
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
            UINT width = LOWORD(lParam);
            UINT height = HIWORD(lParam);
            m_browser.ResizeClient(width, height);
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

        CAxWindow m_browser;
        webbrowser2_com_handler *m_handler;
        DWORD m_dwCookie;
    };

} // webview

#endif //_sciter_iewebview_h_