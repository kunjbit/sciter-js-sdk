
newoption {
   trigger     = "windowsxp",
   description = "Will add Windows XP support"
}

newoption {
   trigger     = "device",
   value       = "DESKTOP|HANDHELD|IOT",
   description = "target device",
   default     = "DESKTOP",
   allowed = {
      { "DESKTOP",   "Desktop machine" },
      { "HANDHELD",  "Mobile device" },
      { "IOT",       "IoT device" }
   }
}

newoption {
   trigger     = "gtk",
   value       = "v3|v4",
   description = "GTK version",
   default     = "v3",
   allowed = {
      { "v3",  "GTK3" },
      { "v4",  "GTK4" }
   }
}

defines { "DEVICE=" .. _OPTIONS["device"] }
defines { "DEVICE_" .. _OPTIONS["device"] }

if os.getenv("VULKAN_SDK") then
  defines {"USE_VULKAN"}
  USE_VULKAN = true
  includedirs { "$(VULKAN_SDK)/include" }
  includedirs { os.getenv("VULKAN_SDK") .. "/include" }
end  

if( _TARGET_OS ~= "_macosx") then  -- we are not auto generating XCode solutions for a while
                                  -- structure of typical XCode is not trivial - requires manual inputs.

function osabbr() 
  return _TARGET_OS
end

-- function that setups target dir according to configuration
function settargetdir() 
  if _TARGET_OS == "macosx" then
    targetdir ("bin/" .. osabbr())
  elseif _TARGET_OS == "linux" then
    if _OPTIONS["gtk"] == "v4" then
      targetdir ("bin/" .. osabbr() ..".gtk4/%{cfg.platform}")
    else 
      targetdir ("bin/" .. osabbr() .."/%{cfg.platform}")
    end
  else
    targetdir ("bin/" .. osabbr() .."/%{cfg.platform}")
    filter "configurations:*Skia" 
      targetdir ("bin/" .. osabbr() .."/%{cfg.platform}skia")
  end
  filter {}
end

if _OPTIONS["windowsxp"] then 

  filter {"system:windows", "action:vs2015", "platforms:not arm64" }
    toolset "v140_xp"
  filter {"system:windows", "action:vs2017", "platforms:not arm64" }
    toolset "v141_xp"
  filter {}
end    


workspace "sciter.sdk"
  configurations { "Debug", "Release" }
  --platforms { "x32", "x64", "arm32", "arm64" } 

  cppdialect "C++17" 

  staticruntime "On"
  
  -- -- location "build"
  filter "system:windows"
    configurations { "DebugSkia", "ReleaseSkia" }
    location ("build/" .. osabbr())
    links { "shell32", "advapi32", "ole32", "oleaut32", "comdlg32" }
    platforms { "x32", "x64", "arm64" }
    systemversion "latest"
    
  filter "system:macosx"
    location ("build/" .. osabbr())
    links { "CoreFoundation.framework", "Cocoa.framework", "IOKit.framework" }
    platforms { "x64" }
      
  filter { "system:linux", "options:gtk=v3"}
    location("build/" .. osabbr() .. "/" .. string.lower(_OPTIONS["device"]))
    platforms { "x64", "arm32", "arm64" }
    defines { "_GNU_SOURCE" }
    buildoptions {
     "`pkg-config gtk+-3.0 --cflags`",      
     "-fPIC",
     "-Wno-unknown-pragmas",
     "-Wno-write-strings",
     "-ldl",
    }
    linkoptions { 
      "-fPIC",
      "-pthread",
    }

  filter { "system:linux", "options:gtk=v4"}
    location("build/" .. osabbr() .. "/" .. string.lower(_OPTIONS["device"]) .. ".gtk4")
    platforms { "x64", "arm32", "arm64" }
    defines { "_GNU_SOURCE" }
    buildoptions {
     "`pkg-config gtk4 --cflags`",      
     "-fPIC",
     "-Wno-unknown-pragmas",
     "-Wno-write-strings",
     "-ldl",
    }
    linkoptions { 
      "-fPIC",
      "-pthread",
    }


  filter {}

  includedirs { "include" }  

  flags { "MultiProcessorCompile" }

  filter "platforms:x32"
    architecture "x86"
  filter "platforms:x64"
    architecture "x86_64"  
  filter "platforms:arm64"
    architecture "ARM64"  
  filter "platforms:arm32"
    architecture "ARM"  


  filter {"platforms:x32", "system:windows"}
    defines { "WIN32" }
  filter {"platforms:x64", "system:windows"}
    defines { "WIN32","WIN64" }      
  filter {"platforms:arm64", "system:windows"}
    defines { "WIN32","WIN64", "ARM64" }      

  filter "configurations:Debug*"
    defines { "DEBUG", "_DEBUG" }
    symbols "On"

  filter "configurations:Release*"
    defines { "NDEBUG"}  
    optimize "Size"
    symbols "Off"
    flags { "LinkTimeOptimization" }

  filter {"system:windows"}
    defines { "_CRT_SECURE_NO_WARNINGS" } 
 
  filter {}

project "usciter"
  kind "WindowedApp"
  language "C++"

  dpiawareness "HighPerMonitor"

  files { "demos/usciter/usciter.cpp",
          "include/behaviors/behavior_drawing.cpp",
          "include/behaviors/behavior_video_generator.cpp",
          "include/behaviors/behavior_video_generator_full.cpp",
          "include/behaviors/behavior_video_generator_direct.cpp",
          "sqlite/*.h",
          "sqlite/*.cpp",
          "sqlite/sqlite-wrap.c",
          "include/behaviors/behavior_video_generator.cpp",
          "include/behaviors/behavior_video_generator_full.cpp",
          "include/behaviors/behavior_video_generator_direct.cpp",
        }

  settargetdir()

  filter "system:windows"
    --removeconfigurations { "*skia" }
    files {"include/sciter-*.h",
           "include/sciter-*.hpp",
           "include/aux-*.*",
           "include/sciter-win-main.cpp",
           "include/behaviors/behavior_native_textarea.cpp",
           "include/behaviors/behavior_camera_capture.cpp",
           "include/behaviors/behavior_tabs.cpp",
           "demos/usciter/win-res/usciter.rc",
           "demos/usciter/win-res/dpi-aware.manifest" }
    links { "shell32", "advapi32", "ole32", "oleaut32", "gdi32", "comdlg32" }
    --prebuildcommands { 
    --  "\"%{prj.location}..\\..\\bin\\".. osabbr() .. "\\packfolder.exe\" \"%{prj.location}..\\..\\demos\\usciter\\res\" \"%{prj.location}..\\..\\demos\\usciter\\resources.cpp\" -v \"resources\""
    --}

  filter "system:macosx"
    files {"include/sciter-osx-main.mm"}
    targetdir ("bin/" .. osabbr())
    
  filter { "system:linux", "options:gtk=v3" }
    files {"include/sciter-gtk-main.cpp"}
    buildoptions {
       "`pkg-config gtk+-3.0 --cflags`"
    }
    linkoptions { 
       "`pkg-config gtk+-3.0 --libs`",
       "`pkg-config fontconfig --libs`",
       "-fPIC",
       "-pthread",
       "-Wl,--no-undefined",
       "-ldl",
       "-no-pie"
    }

  filter { "system:linux", "options:gtk=v4" }
    files {"include/sciter-gtk-main.cpp"}
    buildoptions {
       "`pkg-config gtk4 --cflags`"
    }
    linkoptions { 
       "`pkg-config gtk4 --libs`",
       "`pkg-config fontconfig --libs`",
       "-fPIC",
       "-pthread",
       "-Wl,--no-undefined",
       "-ldl",
       "-no-pie"
    }

  filter {}


project "gsciter"
  kind "WindowedApp"
  language "C++"

  dpiawareness "HighPerMonitor"

  files { "demos/gsciter/gsciter.cpp" }

  settargetdir()

  filter "system:windows"
    --removeconfigurations { "*skia" }

    if USE_VULKAN then 
      externalincludedirs { "$(VULKAN_SDK)/include" }  
    end

    files {"include/sciter-*.h",
           "include/sciter-*.hpp",
           "include/aux-*.*",
           "include/sciter-win-main.cpp",
           "include/behaviors/behavior_video_generator_full.cpp",
           "demos/gsciter/win-res/gsciter.rc",
           "demos/gsciter/win-res/dpi-aware.manifest",
           "demos/gsciter/**.h",
           "demos/gsciter/**.cpp",
            }

    if USE_VULKAN then 
      files {"include/behaviors/behavior_vulkan.cpp"}
    end

    links { "shell32", "advapi32", "ole32", "oleaut32", "gdi32", "comdlg32" }
    --prebuildcommands { 
    --  "\"%{prj.location}..\\..\\bin\\".. osabbr() .. "\\packfolder.exe\" \"%{prj.location}..\\..\\demos\\gsciter\\res\" \"%{prj.location}..\\..\\demos\\usciter\\resources.cpp\" -v \"resources\""
    --}


  filter "system:macosx"
    files {"include/sciter-osx-main.mm"}
    targetdir ("bin/" .. osabbr())
    
  filter { "system:linux", "options:gtk=v3" }
    files {"include/sciter-gtk-main.cpp"}
    buildoptions {
       "`pkg-config gtk+-3.0 --cflags`"
    }
    linkoptions { 
       "`pkg-config gtk+-3.0 --libs`",
       "`pkg-config fontconfig --libs`",
       "-fPIC",
       "-pthread",
       "-Wl,--no-undefined",
       "-ldl",
       "-no-pie"
    }

  filter { "system:linux", "options:gtk=v4" }
    files {"include/sciter-gtk-main.cpp"}
    buildoptions {
       "`pkg-config gtk4 --cflags`"
    }
    linkoptions { 
       "`pkg-config gtk4 --libs`",
       "`pkg-config fontconfig --libs`",
       "-fPIC",
       "-pthread",
       "-Wl,--no-undefined",
       "-ldl",
       "-no-pie"
    }


  filter {}


project "inspector"
  kind "WindowedApp"
  language "C++"

  dpiawareness "HighPerMonitor"

  files { "demos/inspector/inspector.cpp" }

  settargetdir()

  filter "system:windows"
    removeconfigurations { "*skia" }
    files {"include/sciter-*.h",
           "include/sciter-*.hpp",
           "include/aux-*.*",
           "include/sciter-win-main.cpp",
           "demos/inspector/win-res/inspector.rc",
           "demos/inspector/win-res/dpi-aware.manifest" }
    --prebuildcommands { 
    --  "\"%{prj.location}..\\..\\bin\\".. osabbr() .. "\\packfolder.exe\" \"%{prj.location}..\\..\\demos\\inspector\\res\" \"%{prj.location}..\\..\\demos\\inspector\\resources.cpp\" -v \"resources\""
    --}

  filter "system:macosx"
    files {"include/sciter-osx-main.mm"}
    targetdir ("bin/" .. osabbr())

  filter { "system:linux", "options:gtk=v3" }
    files {"include/sciter-gtk-main.cpp"}
    buildoptions {
       "`pkg-config gtk+-3.0 --cflags`"
    }
    linkoptions { 
       "`pkg-config gtk+-3.0 --libs`",
       "`pkg-config fontconfig --libs`",
       "-fPIC",
       "-pthread",
       "-Wl,--no-undefined",
       "-ldl",
       "-no-pie"
    }

  filter { "system:linux", "options:gtk=v4" }
    files {"include/sciter-gtk-main.cpp"}
    buildoptions {
       "`pkg-config gtk4 --cflags`"
    }
    linkoptions { 
       "`pkg-config gtk4 --libs`",
       "`pkg-config fontconfig --libs`",
       "-fPIC",
       "-pthread",
       "-Wl,--no-undefined",
       "-ldl",
       "-no-pie"
    }

  filter {}

project "integration"
  kind "WindowedApp"
  language "C++"

  dpiawareness "HighPerMonitor"

  files { "demos/integration/frame.cpp" }

  settargetdir()

  filter "system:windows"
    removeconfigurations { "*skia" }
    files {"include/sciter-*.h",
           "include/sciter-*.hpp",
           "include/aux-*.*",
           "include/sciter-win-main.cpp",
           "demos/integration/win-res/integration.rc",
           "demos/integration/win-res/dpi-aware.manifest" }
    --prebuildcommands { 
    --  "\"%{prj.location}..\\..\\bin\\".. osabbr() .. "\\packfolder.exe\" \"%{prj.location}..\\..\\demos\\integration\\res\" \"%{prj.location}..\\..\\demos\\integration\\resources.cpp\" -v \"resources\""
    --}

  filter "system:macosx"
    files {"include/sciter-osx-main.mm"}
    targetdir ("bin/" .. osabbr())

  filter { "system:linux", "options:gtk=v3" }
    files {"include/sciter-gtk-main.cpp"}
    buildoptions {
       "`pkg-config gtk+-3.0 --cflags`"
    }
    linkoptions { 
       "`pkg-config gtk+-3.0 --libs`",
       "`pkg-config fontconfig --libs`",
       "-fPIC",
       "-pthread",
       "-Wl,--no-undefined",
       "-ldl",
    }

  filter { "system:linux", "options:gtk=v4" }
    files {"include/sciter-gtk-main.cpp"}
    buildoptions {
       "`pkg-config gtk4 --cflags`"
    }
    linkoptions { 
       "`pkg-config gtk4 --libs`",
       "`pkg-config fontconfig --libs`",
       "-fPIC",
       "-pthread",
       "-Wl,--no-undefined",
       "-ldl",
    }

  filter {}


if( _TARGET_OS == "windows") then 

  project "sciter-dx"
    kind "WindowedApp"
    language "C++"

    dpiawareness "HighPerMonitor"

    files { "demos/windows-directx/*.*" }

    files {"include/sciter-*.h",
           "include/sciter-*.hpp",
           "include/aux-*.*"}

    settargetdir()

    removeconfigurations { "*skia" }
    filter {}

  project "window-mixin"

    kind "WindowedApp"
    language "C++"

    dpiawareness "HighPerMonitor"

    files { "demos/window-mixin/*.h",
            "demos/window-mixin/*.cpp",
            "demos/window-mixin/*.rc",
            "demos/window-mixin/*.ico",
            "demos/window-mixin/dpi-aware.manifest",
            "demos/window-mixin/res/*.*" }

    files {"include/sciter-*.h",
           "include/sciter-*.hpp",
           "include/aux-*.*"}

    settargetdir()

  project "win32-bitmap"

    kind "WindowedApp"
    language "C++"

    dpiawareness "HighPerMonitor"

    defines "WINDOWLESS"

    removeconfigurations { "*Skia" }

    targetdir ("bin.lite/" .. osabbr() .."/%{cfg.platform}")

    files { "demos.lite/win32-bitmap/*.h",
            "demos.lite/win32-bitmap/*.cpp" }

    files {"include/sciter-*.h",
           "include/sciter-*.hpp",
           "include/aux-*.*"}

    filter {}

end

-- sciter extension library - SQLite
project "sciter-sqlite"

  kind "SharedLib"
  language "C++"

  targetprefix "" -- do not prepend it with "lib..."

  files { "sqlite/*.h",
          "sqlite/*.cpp",
          "sqlite/sqlite-wrap.c" }

  settargetdir()

  removeconfigurations { "*skia" }  

  filter "system:windows"
    files {"sqlite/sciter-sqlite.def" }
  filter {}

--end

-- sciter extension behavior library - native UI component
project "sciter-component"

  kind "SharedLib"
  language "C++"

  targetprefix "" -- do not prepend it with "lib..."

  files { "demos/sciter-component/*.h",
          "demos/sciter-component/*.cpp"}

  settargetdir()

  removeconfigurations { "*skia" }  

  filter "system:windows"
    files {"demos/sciter-component/exports.def" }
  filter {}

--end

-- sciter extension library - WebView
project "sciter-webview"

  kind "SharedLib"
  language "C++"

  targetprefix "" -- do not prepend it with "lib..."

  defines "SCITERWEBVIEW_EXPORTS"

  files { 
    "include/sciter-*.h",
    "include/sciter-*.hpp",
    "include/aux-*.*",
    "webview/behavior_webview.cpp"
   }

  settargetdir()

  --removeconfigurations { "*skia" }  

  filter "system:windows"
    files {
      "webview/webview/win/exports.def", 
      "webview/webview/win/dllmain.cpp", 
      "webview/webview/sciter_winwebview.cpp",
      "webview/webview/sciter_iewebview.cpp",
      "webview/webview/sciter_edgewebview.cpp",
    }

  filter "system:macosx"
    xcodebuildsettings { ["CLANG_ENABLE_OBJC_ARC"] = "YES" }

    files {
      "webview/webview/sciter_wkwebview.*", 
    } 
    links { "WebKit.framework",
            "AppKit.framework" }

  filter { "system:linux", "options:gtk=v3" } 
    files {
      "webview/webview/sciter_webkitgtk.*", 
    }
    buildoptions {
       "`pkg-config gtk+-3.0 --cflags`",
       "`pkg-config webkit2gtk-4.0 --cflags`"
    }
    linkoptions { 
       "`pkg-config gtk+-3.0 --libs`",
       "`pkg-config webkit2gtk-4.0 --libs`",
       "-fPIC",
       "-pthread",
       "-Wl,--no-undefined",
       "-ldl"
    }
  filter {}    

--end


project "glfw-opengl"
  --kind "ConsoleApp"
  kind "WindowedApp"
  language "C++"

  defines "WINDOWLESS"

  cppdialect "C++17" 

  removeconfigurations { "*Skia" }

  targetdir ("bin.lite/" .. osabbr() .."/%{cfg.platform}")

  dpiawareness "HighPerMonitor"

  filter "system:windows"
    prebuildcommands { 
      "\"%{prj.location}..\\..\\bin\\windows\\packfolder.exe\" \"%{prj.location}..\\..\\demos.lite\\facade\" \"%{prj.location}..\\..\\demos.lite\\facade-resources.cpp\" -v \"resources\""
    }
  filter {}

  -- ours:
  files { 
    "include/*.h", 
    "include/*.hpp",
    "demos.lite/sciter-glfw-opengl/*.h",
    "demos.lite/sciter-glfw-opengl/basic.cpp",
    "include/behaviors/behavior_drawing.cpp"
  }
  
    -- theirs, GLFW:
  includedirs { 
    "demos.lite/sciter-glfw-opengl",
    "demos.lite/glfw/include",
    "demos.lite/glfw/deps" }  

  files { 
    "demos.lite/glfw/src/context.c",
    "demos.lite/glfw/src/init.c",
    "demos.lite/glfw/src/input.c",
    "demos.lite/glfw/src/monitor.c",
    "demos.lite/glfw/src/vulkan.c",
    "demos.lite/glfw/src/window.c",
    "demos.lite/glfw/deps/glad.c",
  }

  filter "system:windows"
    entrypoint "mainCRTStartup"
    dpiawareness "HighPerMonitor"
    defines "_GLFW_WIN32"
    files {
      "demos.lite/glfw/src/win32_init.c",
      "demos.lite/glfw/src/win32_joystick.c",
      "demos.lite/glfw/src/win32_monitor.c",
      "demos.lite/glfw/src/win32_time.c",
      "demos.lite/glfw/src/win32_thread.c",
      "demos.lite/glfw/src/win32_window.c",
      "demos.lite/glfw/src/wgl_context.c",
      "demos.lite/glfw/src/egl_context.c",
      "demos.lite/glfw/src/osmesa_context.c",
    }
    links "shlwapi"
  filter "system:macosx"
    defines "_GLFW_COCOA"
    files {
      "demos.lite/glfw/src/cocoa_platform.h",
      "demos.lite/glfw/src/cocoa_joystick.h",
      "demos.lite/glfw/src/posix_thread.h",
      "demos.lite/glfw/src/nsgl_context.h", 
      "demos.lite/glfw/src/egl_context.h",
      "demos.lite/glfw/src/osmesa_context.h",
      "demos.lite/glfw/src/cocoa_init.m",
      "demos.lite/glfw/src/cocoa_joystick.m",
      "demos.lite/glfw/src/cocoa_monitor.m",
      "demos.lite/glfw/src/cocoa_window.m",
      "demos.lite/glfw/src/cocoa_time.c",
      "demos.lite/glfw/src/posix_thread.c",
      "demos.lite/glfw/src/nsgl_context.m",
      "demos.lite/glfw/src/egl_context.c",
      "demos.lite/glfw/src/osmesa_context.c",
    } 
    links { "CoreVideo.framework" }
    targetdir ("bin/" .. osabbr())   
  filter "system:linux"  
    linkoptions { 
      "-Wall", 
      "-pthread", "-lm", 
      "-lX11","-lXrandr","-lXinerama", "-lXcursor",
      "-lGL", "-lGLU", "-ldl" }
    defines "_GLFW_X11" -- or "_GLFW_WAYLAND" or "_GLFW_MIR"
    files {
      "demos.lite/glfw/src/xkb_unicode.c",
      "demos.lite/glfw/src/glx_context.c",
      "demos.lite/glfw/src/egl_context.c",
      "demos.lite/glfw/src/osmesa_context.c",
      "demos.lite/glfw/src/posix_thread.*",
      "demos.lite/glfw/src/posix_time.*",
      "demos.lite/glfw/src/linux_*.*",
      "demos.lite/glfw/src/x11_*.*",
    }
    
  filter {}

end
