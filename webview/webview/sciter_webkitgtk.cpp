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

//#define WEBKITVIEW_USE_WINDOW_CONTAINER

namespace webview
{
    sciter_webkitgtk::sciter_webkitgtk(bool debug /*= false*/, void *parent /*= nullptr*/)
    {
        // Initialize webview widget
        m_webview = webkit_web_view_new();
    #ifdef WEBKITVIEW_USE_WINDOW_CONTAINER
        m_window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
        gtk_window_set_decorated(GTK_WINDOW(m_window), false);
    #else
        m_window = m_webview;
    #endif

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
                                        switch (load_event)
                                        {
                                        case WEBKIT_LOAD_STARTED:
                                        {
                                            /* New load, we have now a provisional URI */
                                            const char *provisional_uri = webkit_web_view_get_uri(web_view);
                                            /* Here we could start a spinner or update the
                                             * location bar with the provisional URI */
                                            w->m_isNaviError = false;
                                            w->m_navigationCallback("navigationStarting", provisional_uri);
                                        }
                                        break;
                                        case WEBKIT_LOAD_FINISHED:
                                            /* Load finished, we can now stop the spinner */
                                            if (!w->m_isNaviError) {
                                                w->m_navigationCallback("navigationCompleted", "0");
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
                                        w->m_isNaviError = true;
                                        w->m_navigationCallback("navigationCompleted", "-1");
                                        return false;
                                    }),
                         this);
        g_signal_connect(m_webview, "notify::title",
                         G_CALLBACK(+[](WebKitWebView *web_view, gchar* title, gpointer user_data) {
                             auto *w = static_cast<sciter_webkitgtk *>(user_data);
                             const char* strTitle = webkit_web_view_get_title(web_view);
                             w->m_navigationCallback("documentTitleChanged", strTitle);
                         }),
                         this);

        webkit_user_content_manager_register_script_message_handler(manager, "external");
        init("{window.external={invoke:(s)=>{window.webkit.messageHandlers.external.postMessage(s)}}}");

#ifdef WEBKITVIEW_USE_WINDOW_CONTAINER
        gtk_container_add(GTK_CONTAINER(m_window), GTK_WIDGET(m_webview));
#endif
        gtk_layout_put(GTK_LAYOUT(parent), GTK_WIDGET(m_window), 0, 0);

        WebKitSettings *settings = webkit_web_view_get_settings(WEBKIT_WEB_VIEW(m_webview));
        webkit_settings_set_javascript_can_access_clipboard(settings, true);
        if (debug)
        {
            webkit_settings_set_enable_write_console_messages_to_stdout(settings, true);
            webkit_settings_set_enable_developer_extras(settings, true);
        }

        gtk_widget_show_all(GTK_WIDGET(m_window));
        gtk_widget_grab_focus(GTK_WIDGET(m_webview));
    }


    sciter_webkitgtk::~sciter_webkitgtk() {
        gtk_widget_destroy(GTK_WIDGET(m_webview));
        m_webview = nullptr;
#ifdef WEBKITVIEW_USE_WINDOW_CONTAINER
        gtk_widget_destroy(GTK_WIDGET(m_window));
#endif
        m_window = nullptr;
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
        // gtk_widget_set_size_request(GTK_WIDGET(m_webview), width, height);
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
        g_idle_add_full(G_PRIORITY_HIGH_IDLE, (GSourceFunc)([](void *f) -> int
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

}
