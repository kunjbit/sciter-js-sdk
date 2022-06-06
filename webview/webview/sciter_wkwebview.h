#ifndef _sciter_wkwebview_h_
#define _sciter_wkwebview_h_

#include <functional>
#include <string>

namespace webview
{
    using dispatch_fn_t = std::function<void()>;
    using navigation_callback_t = std::function<int(const char* evt, const std::string&)>;
    using msg_callback_t = std::function<void(const std::string &)>;

    class sciter_wkwebview
    {
    public:
        sciter_wkwebview(bool debug = false, void *parent = nullptr);
        ~sciter_wkwebview();

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
        void set_msg_callback(const msg_callback_t& cb);
        
        void* m_window = nullptr;
        void* m_webview = nullptr;
        void* m_controller = nullptr;
        void* m_webviewDelegate = nullptr;
        navigation_callback_t m_navigationCallback;
        msg_callback_t m_msgCallback;
    };

}

#endif //_sciter_wkwebview_h_
