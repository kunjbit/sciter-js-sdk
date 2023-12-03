#ifndef _sciter_webkitgtk_h_
#define _sciter_webkitgtk_h_

#include <functional>
#include <string>

#include "webview_callbacks.h"

namespace webview
{

    class sciter_webkitgtk
    {
    public:
        sciter_webkitgtk(bool debug = false, void *parent = nullptr);
        ~sciter_webkitgtk();

        void load_engine(const completion_fn_t &completion);
        bool set_parent_window(void* newparent) {
          return false;
        }

        void navigate(const std::string &url);
        void reload();
        void go_back();
        void go_forward();
        void stop();

        void *window();
        void set_size(int width, int height, int hints);

        void init(const std::string &js);
        void eval(const std::string &js);
        void set_html(const std::string& html);
        void dispatch(dispatch_fn_t f);

        void set_navigation_callback(const navigation_callback_t &cb);
        void set_msg_callback(const msg_callback_t &cb);
        void set_allowWindowOpen(const std::string& val);
        std::string currentSrc();

        void *m_window = nullptr;
        void *m_webview = nullptr;
        void *m_controller = nullptr;
        void *m_webviewDelegate = nullptr;
        navigation_callback_t m_navigationCallback;
        msg_callback_t m_msgCallback;
        std::string m_allowWindowOpen = "nopopup";


        bool m_isNaviError = false;
        bool m_debugtools = false;
    };

}

#endif //_sciter_webkitgtk_h_
