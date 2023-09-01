---
sidebar_position: 1
title: Window
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Window representation in HTML

Sciter window is a host of HTML document loaded in it.

This HTML defines content of the window in full. Root `<html>` element of a window has special meaning - its `window-XXX` attributes define look and feel of the window.

## Window Root Attributes

Window specific attributes - defined on root `<html>` element loaded into the window.

| Attribute | Description |
| --------- | ----------- |
| `window-frame` | string, defines window type: "default","standard","solid","solid-with-shadow", "extended", "transparent" 
| `window-icon`  | Window icon URL
| `window-title` | Window title
| `window-width` | initial width of the window, CSS length units
| `window-height`| initial height of the window, CSS length units
| `window-min-width` | minimal width of the window, CSS length units
| `window-min-height`| minimal height of the window, CSS length units
| `window-max-width` | maximal width of the window, CSS length units
| `window-max-height`| maximal height of the window, CSS length units
| `window-resizable`  | _true_,_false_,`<length>` i.e. `10px` counted from window frame inwards
| `window-minimizable` | _true_ or _false_
| `window-maximizable` | _true_ or _false_
| `window-alignment` | `1..9` - align the window relative to desktop, `-1..-9` - align the window relative to parent window;
| `window-blurbehind` | blur behind effect configuration, see [`window.blurBehind`](../DOM/Window#blurbehind).
| `window-corners` | string: default, not-round, round, round-small - define window corner roudness on supported OS (e.g. Win11) .
| `window-state` | shown, minimized, maximized, full-screen, hidden - initial state of HTML window
| `lang` | ISO 639-1 value, define dictionary for spellcheck, Date...
| `disable-debug` | do not connect to inspector


## Window Related Attributes

These attributes may appear on other elements inside root `<html>` to give those elements window chrome roles:

| Attribute  | Description |
| ---------  | ----------- |
| `role="window-caption"` | Allow to drag the window through this element
| `role="window-minimize"` | Instructs the element to behave as window minimize button
| `role="window-maximize"` | Instructs the element to behave as window maximize button
| `role="window-close"` | Instructs the element to behave as window close button
| `role="window-icon"` | Instructs the element to behave as window icon - on Windows it shows window menu on click on it.

Example, `<caption` element here:

```html
  <header>
    <button role="window-icon" />
    <caption role="window-caption">My Window</caption>
    <button role="window-minimize" />
    <button role="window-maximize" />
  </header>
```
behaves as a window caption allowing the user to drag-and-move the window.
