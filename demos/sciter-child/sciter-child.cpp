// sciter-child.cpp : Defines the entry point for the application.
//

#include "framework.h"
#include "sciter-child.h"
#include "sciter-x.h"  // sciter headers

#define MAX_LOADSTRING 100

// Global Variables:
HINSTANCE hInst;                                // current instance
WCHAR szTitle[MAX_LOADSTRING];                  // The title bar text
WCHAR szWindowClass[MAX_LOADSTRING];            // the main window class name

HWND hWndSciter = NULL;

// Forward declarations of functions included in this code module:
ATOM                MyRegisterClass(HINSTANCE hInstance);
BOOL                InitInstance(HINSTANCE, int);
LRESULT CALLBACK    WndProc(HWND, UINT, WPARAM, LPARAM);
INT_PTR CALLBACK    About(HWND, UINT, WPARAM, LPARAM);

int APIENTRY wWinMain(_In_ HINSTANCE hInstance,
                     _In_opt_ HINSTANCE hPrevInstance,
                     _In_ LPWSTR    lpCmdLine,
                     _In_ int       nCmdShow)
{
    UNREFERENCED_PARAMETER(hPrevInstance);
    UNREFERENCED_PARAMETER(lpCmdLine);

    // TODO: Place code here.

    // Initialize global strings
    LoadStringW(hInstance, IDS_APP_TITLE, szTitle, MAX_LOADSTRING);
    LoadStringW(hInstance, IDC_SCITERCHILD, szWindowClass, MAX_LOADSTRING);
    MyRegisterClass(hInstance);

    // Perform application initialization:
    if (!InitInstance (hInstance, nCmdShow))
    {
        return FALSE;
    }

    HACCEL hAccelTable = LoadAccelerators(hInstance, MAKEINTRESOURCE(IDC_SCITERCHILD));

    MSG msg;

    // Main message loop:
    while (GetMessage(&msg, nullptr, 0, 0))
    {
        if (!TranslateAccelerator(msg.hwnd, hAccelTable, &msg))
        {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        }
    }

    return (int) msg.wParam;
}



//
//  FUNCTION: MyRegisterClass()
//
//  PURPOSE: Registers the window class.
//
ATOM MyRegisterClass(HINSTANCE hInstance)
{
    WNDCLASSEXW wcex;

    wcex.cbSize = sizeof(WNDCLASSEX);

    wcex.style          = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc    = WndProc;
    wcex.cbClsExtra     = 0;
    wcex.cbWndExtra     = 0;
    wcex.hInstance      = hInstance;
    wcex.hIcon          = LoadIcon(hInstance, MAKEINTRESOURCE(IDI_SCITERCHILD));
    wcex.hCursor        = LoadCursor(nullptr, IDC_ARROW);
    wcex.hbrBackground  = (HBRUSH)(COLOR_WINDOW+1);
    wcex.lpszMenuName   = MAKEINTRESOURCEW(IDC_SCITERCHILD);
    wcex.lpszClassName  = szWindowClass;
    wcex.hIconSm        = LoadIcon(wcex.hInstance, MAKEINTRESOURCE(IDI_SMALL));

    return RegisterClassExW(&wcex);
}

LRESULT sciter_on_load_data(LPSCN_LOAD_DATA pnm) {
  LPCBYTE pb = 0; UINT cb = 0;
  aux::wchars wu = aux::chars_of(pnm->uri);

  if (wu.like(WSTR("res:*"))) {
      wu.prune(4);

      WCHAR achURL[MAX_PATH + 1] = { 0 };
      wcsncpy_s(achURL, wu.start, MAX_PATH);

      LPWSTR pszName = achURL;

      // Separate extension if any
      LPWSTR pszExt = wcsrchr(pszName, '.'); if (pszExt) *pszExt++ = '\0';

      // Find specified resource and leave if failed. Note that we use extension
      // as the custom resource type specification or assume standard HTML resource
      // if no extension is specified

      HRSRC hrsrc = 0;
      bool  isHtml = false;
      if (pszExt == 0 || _wcsicmp(pszExt, L"HTML") == 0 || _wcsicmp(pszExt, L"HTM") == 0)
      {
        hrsrc = ::FindResourceW(hInst, pszName, MAKEINTRESOURCEW(23) /*RT_HTML*/);
        isHtml = true;
      }
      else
        hrsrc = ::FindResourceW(hInst, pszName, pszExt);

      if (!hrsrc)
        return LOAD_DISCARD; // resource not found here - proceed with the default loader

      // Load specified resource and check if ok

      HGLOBAL hgres = ::LoadResource(hInst, hrsrc);
      if (!hgres) return LOAD_DISCARD;

      // Retrieve resource data and check if ok

      pb = (PBYTE)::LockResource(hgres); if (!pb) return LOAD_DISCARD;
      cb = ::SizeofResource(hInst, hrsrc); if (!cb) return LOAD_DISCARD;

      // Report data ready

      ::SciterDataReady(pnm->hwnd, pnm->uri, pb, cb);

  }
  return LOAD_OK;
}


UINT STDCALL sciter_callback(LPSCITER_CALLBACK_NOTIFICATION pnm, LPVOID callbackParam)
{
  // Crack and call appropriate method

  // here are all notifiactions
  switch (pnm->code)
  {
    case SC_LOAD_DATA:          return sciter_on_load_data((LPSCN_LOAD_DATA)pnm);
  }
  return 0;
}

//
//   FUNCTION: InitInstance(HINSTANCE, int)
//
//   PURPOSE: Saves instance handle and creates main window
//
//   COMMENTS:
//
//        In this function, we save the instance handle in a global variable and
//        create and display the main program window.
//
BOOL InitInstance(HINSTANCE hInstance, int nCmdShow)
{
   OleInitialize(NULL);

   hInst = hInstance; // Store instance handle in our global variable

   HWND hWnd = CreateWindowW(szWindowClass, szTitle, WS_OVERLAPPEDWINDOW,
      CW_USEDEFAULT, 0, CW_USEDEFAULT, 0, nullptr, nullptr, hInstance, nullptr);

   if (!hWnd)
   {
      return FALSE;
   }

   RECT rc = { 0,0,100,100 };

   hWndSciter = SciterCreateWindow(SW_CHILD, &rc, NULL, NULL, hWnd);
   
   SciterSetCallback(hWndSciter, sciter_callback, NULL);

   SciterLoadFile(hWndSciter, L"res:default.htm");

   ShowWindow(hWndSciter, SW_SHOW);

   ShowWindow(hWnd, nCmdShow);
   UpdateWindow(hWnd);

   return TRUE;
}

//
//  FUNCTION: WndProc(HWND, UINT, WPARAM, LPARAM)
//
//  PURPOSE: Processes messages for the main window.
//
//  WM_COMMAND  - process the application menu
//  WM_PAINT    - Paint the main window
//  WM_DESTROY  - post a quit message and return
//
//
LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
    switch (message)
    {
    case WM_COMMAND:
        {
            int wmId = LOWORD(wParam);
            // Parse the menu selections:
            switch (wmId)
            {
            case IDM_ABOUT:
                DialogBox(hInst, MAKEINTRESOURCE(IDD_ABOUTBOX), hWnd, About);
                break;
            case IDM_EXIT:
                DestroyWindow(hWnd);
                break;
            default:
                return DefWindowProc(hWnd, message, wParam, lParam);
            }
        }
        break;
    case WM_PAINT:
        {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hWnd, &ps);
            // TODO: Add any drawing code that uses hdc here...
            EndPaint(hWnd, &ps);
        }
        break;
    
    case WM_DESTROY:
        PostQuitMessage(0);
        break;
    
    case WM_SIZE:
        if (hWndSciter) {
          RECT rc; GetClientRect(hWnd, &rc);
          MoveWindow(hWndSciter, rc.left, rc.top, rc.right - rc.left, rc.bottom - rc.top,TRUE);
        }
        break;
    default:
        return DefWindowProc(hWnd, message, wParam, lParam);
    }
    return 0;
}

// Message handler for about box.
INT_PTR CALLBACK About(HWND hDlg, UINT message, WPARAM wParam, LPARAM lParam)
{
    UNREFERENCED_PARAMETER(lParam);
    switch (message)
    {
    case WM_INITDIALOG:
        return (INT_PTR)TRUE;

    case WM_COMMAND:
        if (LOWORD(wParam) == IDOK || LOWORD(wParam) == IDCANCEL)
        {
            EndDialog(hDlg, LOWORD(wParam));
            return (INT_PTR)TRUE;
        }
        break;
    }
    return (INT_PTR)FALSE;
}
