// ====================================================================
//
// This implementation uses webkit2gtk backend. It requires gtk+3.0 and
// webkit2gtk-4.0 libraries. Proper compiler flags can be retrieved via:
//
//   pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.0
//
// ====================================================================
//
#include <JavaScriptCore/JavaScript.h>
#include <gtk/gtk.h>
#include <webkit2/webkit2.h>
#include "sciter_webkitgtk.h"

namespace webview
{

    sciter_webkitgtk::sciter_webkitgtk(bool debug /*= false*/, void *parent /*= nullptr*/)
    {
        // Initialize webview widget
        if (nullptr != parent)
        {
            m_window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
            gtk_window_set_decorated(GTK_WINDOW(m_window), false);
            gtk_layout_put(GTK_LAYOUT(parent), GTK_WIDGET(m_window), 0, 0);
        }
        else
        {
            m_window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
            gtk_window_set_default_size(GTK_WINDOW(m_window), 800, 600);
            gtk_window_set_position(GTK_WINDOW(m_window), GTK_WIN_POS_CENTER);
            g_signal_connect(G_OBJECT(m_window), "delete_event",
                             G_CALLBACK(+[](GtkWidget *self, GdkEvent *event, gpointer arg)
                                        {
                                            auto *w = static_cast<sciter_webkitgtk *>(arg);
                                            delete w;
                                            return true;
                                        }),
                             this);
        }
        m_debugtools = debug;
    }

    sciter_webkitgtk::~sciter_webkitgtk()
    {
        gtk_widget_destroy(GTK_WIDGET(m_webview));
        m_webview = nullptr;
        gtk_widget_destroy(GTK_WIDGET(m_window));
        m_window = nullptr;
    }

    void sciter_webkitgtk::load_engine(const completion_fn_t &completion)
    {
        m_webview = webkit_web_view_new();
        gtk_container_add(GTK_CONTAINER(m_window), GTK_WIDGET(m_webview));

        WebKitUserContentManager *manager =
            webkit_web_view_get_user_content_manager(WEBKIT_WEB_VIEW(m_webview));
        g_signal_connect(manager, "script-message-received::external",
                         G_CALLBACK(+[](WebKitUserContentManager *,
                                        WebKitJavascriptResult *r, gpointer arg)
                                    {
                                        auto *w = static_cast<sciter_webkitgtk *>(arg);
#if WEBKIT_MAJOR_VERSION >= 2 && WEBKIT_MINOR_VERSION >= 22
                                        JSCValue *value =
                                            webkit_javascript_result_get_js_value(r);
                                        char *s = jsc_value_to_string(value);
#else
                                 JSGlobalContextRef ctx =
                                     webkit_javascript_result_get_global_context(r);
                                 JSValueRef value = webkit_javascript_result_get_value(r);
                                 JSStringRef js = JSValueToStringCopy(ctx, value, NULL);
                                 size_t n = JSStringGetMaximumUTF8CStringSize(js);
                                 char *s = g_new(char, n);
                                 JSStringGetUTF8CString(js, s, n);
                                 JSStringRelease(js);
#endif
                                        w->m_msgCallback(s);
                                        g_free(s);
                                    }),
                         this);
        g_signal_connect(m_webview, "load-changed",
                         G_CALLBACK(+[](WebKitWebView *web_view,
                                        WebKitLoadEvent load_event,
                                        gpointer user_data)
                                    {
                                        auto *w = static_cast<sciter_webkitgtk *>(user_data);
                                        if (nullptr == w->m_navigationCallback)
                                        {
                                            return;
                                        }
                                        switch (load_event)
                                        {
                                        case WEBKIT_LOAD_STARTED:
                                        {
                                            /* New load, we have now a provisional URI */
                                            const char *provisional_uri = webkit_web_view_get_uri(web_view);
                                            /* Here we could start a spinner or update the
                                             * location bar with the provisional URI */
                                            w->m_isNaviError = false;
                                            w->m_navigationCallback(navigation_event::will_navigate, provisional_uri);
                                        }
                                        break;
                                        case WEBKIT_LOAD_FINISHED:
                                            /* Load finished, we can now stop the spinner */
                                            if (!w->m_isNaviError)
                                            {
                                                w->m_navigationCallback(navigation_event::did_navigate, "");
                                            }
                                            break;
                                        }
                                    }),
                         this);
        g_signal_connect(m_webview, "load-failed",
                         G_CALLBACK(+[](WebKitWebView *web_view,
                                        WebKitLoadEvent load_event,
                                        gchar *failing_uri,
                                        gpointer error,
                                        gpointer user_data)
                                    {
                                        auto *w = static_cast<sciter_webkitgtk *>(user_data);
                                        if (nullptr == w->m_navigationCallback)
                                        {
                                            return false;
                                        }
                                        w->m_isNaviError = true;
                                        w->m_navigationCallback(navigation_event::navigate_failure, "");
                                        return false;
                                    }),
                         this);
        g_signal_connect(m_webview, "create",
                         G_CALLBACK(+[](WebKitWebView *web_view,
                                        WebKitNavigationAction *navigation_action,
                                        gpointer user_data)
                                    {
                                        auto *w = static_cast<sciter_webkitgtk *>(user_data);
                                        const char* allow = w->m_allowWindowOpen.c_str();
                                        if (0 == strcmp("false", allow)) {
                                            return GTK_WIDGET(nullptr);
                                        }
                                        else if (0 == strcmp("popup", allow)) {
                                            sciter_webkitgtk *webview = new sciter_webkitgtk(w->m_debugtools);
                                            WebKitURIRequest *request = webkit_navigation_action_get_request(navigation_action);
                                            std::string url = webkit_uri_request_get_uri(request);
                                            webview->load_engine([=](bool)
                                                                { webview->navigate(url); });
                                            webview->set_allowWindowOpen(w->m_allowWindowOpen);
                                            return GTK_WIDGET(webview->m_webview);
                                        }
                                        else {
                                            WebKitURIRequest *request = webkit_navigation_action_get_request(navigation_action);
                                            std::string url = webkit_uri_request_get_uri(request);
                                            w->navigate(url);
                                            return GTK_WIDGET(nullptr);
                                        }
                                    }),
                         this);
        g_signal_connect(m_webview, "close",
                         G_CALLBACK(+[](WebKitWebView *web_view,
                                        gpointer user_data)
                                    {
                                        auto *w = static_cast<sciter_webkitgtk *>(user_data);
                                        if (nullptr == w->m_navigationCallback)
                                        {
                                            gtk_window_close(GTK_WINDOW(w->m_window));
                                        }
                                    }),
                         this);
        g_signal_connect(m_webview, "notify::title",
                         G_CALLBACK(+[](WebKitWebView *web_view, gchar *title, gpointer user_data)
                                    {
                                        auto *w = static_cast<sciter_webkitgtk *>(user_data);
                                        const char *strTitle = webkit_web_view_get_title(web_view);
                                        if (nullptr != w->m_navigationCallback)
                                        {
                                            w->m_navigationCallback(navigation_event::title_did_change, strTitle);
                                        }
                                        else
                                        {
                                            gtk_window_set_title(GTK_WINDOW(w->m_window), strTitle);
                                        }
                                    }),
                         this);

        webkit_user_content_manager_register_script_message_handler(manager, "external");
        init("{window.external={invoke:(s)=>{window.webkit.messageHandlers.external.postMessage(s)}}}");

        WebKitSettings *settings = webkit_web_view_get_settings(WEBKIT_WEB_VIEW(m_webview));
        webkit_settings_set_javascript_can_access_clipboard(settings, true);
        webkit_settings_set_enable_developer_extras(settings, m_debugtools);

        gtk_widget_grab_focus(GTK_WIDGET(m_webview));
        gtk_widget_show_all(GTK_WIDGET(m_window));
        completion_fn_t *handler = new completion_fn_t(completion);
        dispatch([=]
                 {
            (*handler)(true);
            delete handler; });
    }

    void sciter_webkitgtk::navigate(const std::string &url)
    {
        webkit_web_view_load_uri(WEBKIT_WEB_VIEW(m_webview), url.c_str());
    }

    void sciter_webkitgtk::reload()
    {
        webkit_web_view_reload(WEBKIT_WEB_VIEW(m_webview));
    }

    void sciter_webkitgtk::go_back()
    {
        webkit_web_view_go_back(WEBKIT_WEB_VIEW(m_webview));
    }

    void sciter_webkitgtk::go_forward()
    {
        webkit_web_view_go_forward(WEBKIT_WEB_VIEW(m_webview));
    }

    void sciter_webkitgtk::stop()
    {
        webkit_web_view_stop_loading(WEBKIT_WEB_VIEW(m_webview));
    }

    void *sciter_webkitgtk::window()
    {
        return m_window;
    }

    void sciter_webkitgtk::set_size(int width, int height, int hints)
    {
        gtk_widget_set_size_request(GTK_WIDGET(m_webview), width, height);
    }

    void sciter_webkitgtk::init(const std::string &js)
    {
        WebKitUserContentManager *manager = webkit_web_view_get_user_content_manager(WEBKIT_WEB_VIEW(m_webview));
        webkit_user_content_manager_add_script(manager, webkit_user_script_new(js.c_str(), WEBKIT_USER_CONTENT_INJECT_TOP_FRAME, WEBKIT_USER_SCRIPT_INJECT_AT_DOCUMENT_START, NULL, NULL));
    }

    void sciter_webkitgtk::eval(const std::string &js)
    {
        webkit_web_view_run_javascript(WEBKIT_WEB_VIEW(m_webview), js.c_str(), NULL, NULL, NULL);
    }

    void sciter_webkitgtk::set_html(const std::string &html)
    {
        webkit_web_view_load_html(WEBKIT_WEB_VIEW(m_webview), html.c_str(), NULL);
    }

    void sciter_webkitgtk::dispatch(dispatch_fn_t f)
    {
        g_idle_add_full(G_PRIORITY_DEFAULT, (GSourceFunc)([](void *f) -> int
                                                          {
                      (*static_cast<dispatch_fn_t *>(f))();
                      return G_SOURCE_REMOVE; }),
                        new std::function<void()>(f),
                        [](void *f)
                        { delete static_cast<dispatch_fn_t *>(f); });
    }

    void sciter_webkitgtk::set_navigation_callback(const navigation_callback_t &cb)
    {
        m_navigationCallback = cb;
    }

    void sciter_webkitgtk::set_msg_callback(const msg_callback_t &cb)
    {
        m_msgCallback = cb;
    }

    void sciter_webkitgtk::set_allowWindowOpen(const std::string &val)
    {
        m_allowWindowOpen = val;
    }

    std::string sciter_webkitgtk::currentSrc()
    {
        return webkit_web_view_get_uri(WEBKIT_WEB_VIEW(m_webview));
    }

}
