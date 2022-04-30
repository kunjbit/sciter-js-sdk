#include "pch.h"

#include <time.h>   
#include <cmath>

using namespace sciter;

// our component
struct analog_clock : public sciter::event_handler {
  HELEMENT self = nullptr;
  tm       timeinfo;
  // ctor
  analog_clock() {}
  virtual ~analog_clock() {}

  virtual bool subscription(HELEMENT he, UINT& event_groups)
  {
    event_groups = HANDLE_DRAW   // it does drawing
                 | HANDLE_TIMER; // and handles timer
    return true;
  }

  virtual void attached(HELEMENT he)
  {
    self = he;
    time_t rawtime;
    time(&rawtime);
    timeinfo = *localtime(&rawtime);
    //start();
  }
  virtual void detached(HELEMENT he) {
    stop();
    asset_release();
  }

  virtual bool handle_timer(HELEMENT he, TIMER_PARAMS& params)
  {
    time_t rawtime;
    time(&rawtime);
    timeinfo = *localtime(&rawtime);
    dom::element(he).refresh(); // refresh element's area
    return true; // keep ticking
  }

  virtual bool handle_draw(HELEMENT he, DRAW_PARAMS& params)
  {
    if (params.cmd != DRAW_CONTENT) return false; // drawing only content layer

    const float PI = 3.141592653f;

    float w = float(params.area.right - params.area.left);
    float h = float(params.area.bottom - params.area.top);

    float scale = w < h ? w / 300.0f : h / 300.0f;

    sciter::graphics gfx(params.gfx);
    gfx.state_save();

    gfx.translate(params.area.left + w / 2.0f, params.area.top + h / 2.0f);
    gfx.scale(scale, scale);
    gfx.rotate(-PI / 2);
    gfx.line_color(0);
    gfx.line_width(8.f);
    gfx.line_cap(SCITER_LINE_CAP_ROUND);

    // Hour marks
    gfx.state_save();
    gfx.line_color(gcolor(0x32, 0x5F, 0xA2));
    for (int i = 0; i < 12; ++i) {
      gfx.rotate(PI / 6);
      gfx.line(137.f, 0, 144.f, 0);
    }
    gfx.state_restore();

    // Minute marks
    gfx.state_save();
    gfx.line_width(3.f);
    gfx.line_color(gcolor(0xA5, 0x2A, 0x2A));
    for (int i = 0; i < 60; ++i) {
      if (i % 5 != 0)
        gfx.line(143, 0, 146, 0);
      gfx.rotate(PI / 30.f);
    }
    gfx.state_restore();

    int sec = timeinfo.tm_sec;
    int min = timeinfo.tm_min;
    int hr = timeinfo.tm_hour;
    hr = hr >= 12 ? hr - 12 : hr;

    // draw Hours
    gfx.state_save();
    gfx.rotate(hr*(PI / 6) + (PI / 360)*min + (PI / 21600)*sec);
    gfx.line_width(14);
    gfx.line_color(gcolor(0x32, 0x5F, 0xA2));
    gfx.line(-20, 0, 70, 0);
    gfx.state_restore();

    // draw Minutes
    gfx.state_save();
    gfx.rotate((PI / 30)*min + (PI / 1800)*sec);
    gfx.line_width(10);
    gfx.line_color(gcolor(0x32, 0x5F, 0xA2));
    gfx.line(-28, 0, 100, 0);
    gfx.state_restore();

    // draw seconds
    gfx.state_save();
    gfx.rotate(sec * PI / 30);
    gfx.line_color(gcolor(0xD4, 0, 0));
    gfx.fill_color(gcolor(0xD4, 0, 0));
    gfx.line_width(6);
    gfx.line(-30, 0, 83, 0);
    gfx.ellipse(0, 0, 10, 10);

    gfx.fill_color(0);
    gfx.ellipse(95, 0, 10, 10);
    gfx.state_restore();

    gfx.state_restore();

    char buffer[16] = { 0 };
    sprintf(buffer, "%02d:%02d", timeinfo.tm_hour, timeinfo.tm_min);

    //sciter::text text(aux::chars_of(buffer), he);
    sciter::text text = sciter::text::create_with_style(aux::a2w(buffer), he, const_wchars("font-size:24pt;color:brown"));
    gfx.draw_text(text, params.area.left + w / 2.0f, params.area.top + h / 4.0f, 5);

    return false;

  }

  bool start() {
    dom::element(self).start_timer(1000, this);
    return true;
  }

  bool stop() {
    dom::element(self).stop_timer(this);
    return true;
  }

  SOM_PASSPORT_BEGIN_EX(clock, analog_clock)
    SOM_FUNCS(
      SOM_FUNC(stop),
      SOM_FUNC(start)
    )
  SOM_PASSPORT_END
};

/** The SciterBehaviorFactory of this module */

SBOOL SCAPI ThisBehaviorFactory(LPCSTR name, HELEMENT he, LPElementEventProc* elProc, LPVOID* elTag) {

  if (aux::chars_of(name) != const_chars("clock")) 
    return FALSE; // this factory creates only clock behavior

  analog_clock* pc = new analog_clock();
  pc->asset_add_ref(); // will be freed and destroyed in detach
  *elProc = pc->element_proc;
  *elTag = pc;
  return TRUE;
}

extern "C" {
  
/** SciterBehaviorFactoryInit is the only exported function that Sciter runtime will call to initialize Sciter component extension library.
  * \param psapi[in] \b ISciterAPI*, instance of Sciter API interface provided by Sciter runtime to the library.
  * \param pfactory[out] \b SciterBehaviorFactory**, instance of behavior factory that will create behaviors of this library.
  * \return TRUE on success.
  **/

#ifndef WINDOWS
  __attribute__((visibility("default")))
#endif
  SBOOL SCAPI SciterBehaviorFactoryInit(ISciterAPI* psapi, SciterBehaviorFactory** pfactory)
  {
    _SAPI(psapi); // set reference to Sciter API provided by host application including scapp(quark)
    *pfactory = ThisBehaviorFactory;
    return TRUE;
  }

}
