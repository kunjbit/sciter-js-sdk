---
sidebar_position: 3
title: Supported Input Elements
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# HTML inputs and UI elements

Input elements are ordinary DOM elements with attached so called native behaviors - controllers that handle their look and feel. 


## Inputs

| tag and type | behavior | purpose |
| ------------ | -------- | ------- | 
| `<input type=text>` | [behavior:edit](../behaviors/behavior-edit) | single line input
| `<input type=password>` | [behavior:password](../behaviors/behavior-password) | single line password input
| `<input type=integer>` | [behavior:integer](../behaviors/behavior-integer) | integer numeric input
| `<input type=decimal>` | [behavior:decimal](../behaviors/behavior-decimal) | decimal numeric input
| `<input type=number>` | [behavior:number](../behaviors/behavior-decimal) | either integer or decimal input
| `<input type=button>` | [behavior:button](../behaviors/behavior-button) | button 
| `<input type=radio>` | [behavior:radio](../behaviors/behavior-radio) | radio button 
| `<input type=checkbox>` | [behavior:check](../behaviors/behavior-check) | checkbox button 
| `<input type=hslider>` | [behavior:slider](../behaviors/behavior-slider) | horizontal slider 
| `<input type=vslider>` | [behavior:slider](../behaviors/behavior-slider) | vertical slider 
| `<input type=hscrollbar>` | [behavior:scrollbar](../behaviors/behavior-scrollbar) | horizontal standalone scrollbar 
| `<input type=vscrollbar>` | [behavior:scrollbar](../behaviors/behavior-scrollbar) | vertical standalone scrollbar
| `<input type=calendar>` | [behavior:calendar](../behaviors/behavior-calendar) | standalone calendar input - day selector
| `<input type=date>` | [behavior:date](../behaviors/behavior-date) | date input
| `<input type=time>` | [behavior:time](../behaviors/behavior-time) | time input
| `<input type=masked>` | [behavior:masked-edit](../behaviors/behavior-masked-edit) | masked text input

:::info
All `<input type=...>` elements have `<widget type=...>` display:block counterparts.
:::  

## Buttons

| tag and type | behavior | purpose |
| ------------ | -------- | ------- | 
| `<button>` | [behavior:button](../behaviors/behavior-button) | button
| `<button type=submit>` | [behavior:button](../behaviors/behavior-button) | submit button in a form 
| `<button type=reset>` | [behavior:button](../behaviors/behavior-button) | reset button in a form 
| `<button type=radio>` | [behavior:radio](../behaviors/behavior-radio) | radio button combined with a label
| `<button type=checkbox>` | [behavior:check](../behaviors/behavior-check) | checkbox button combined with a label 
| `<button type=menu>` | behavior:button popup-menu | button with child `<menu>` element, show the menu on click 
| `<button type=toggle>` | [behavior:check](../behaviors/behavior-check) | check button styled as a toggle

:::note
Buttons may also appear in `<toolbar>` element where they have distinct toolbar look.
:::

## Selects

| tag and type | behavior | purpose |
| ------------ | -------- | ------- | 
| `<select>` | [behavior:select-dropdown](../behaviors/behavior-select-dropdown) | select with dropdown list
| `<select type=dropdown>` | [behavior:select-dropdown](../behaviors/behavior-select-dropdown) | explicit declaration of select with dropdown list
| `<select type=list>` | [behavior:select](../behaviors/behavior-select) | inplace list, single select, multiple select, multiple select with checkmarks 
| `<select type=tree>` | [behavior:tree](../behaviors/behavior-select) | hierarchical `<option>` tree selector: single and multiple options 
| `<select type=switch>` | [behavior:select](../behaviors/behavior-select) | one-of-many selector bar  

## Text editors

| tag and type | behavior | purpose |
| ------------ | -------- | ------- | 
| `<textarea>` | [behavior:textarea](../behaviors/behavior-textarea) | Multiline text area for small texts
| `<htmlarea>` | [behavior:richtext](../behaviors/behavior-textarea) | WYSIWYG HTML editor
| `<plaintext>` | [behavior:plaintext](../behaviors/behavior-plaintext) | Multiline plain text editor optimized for relatively large texts. Supports phrasing markup in text lines. 

## Output elements

| tag and type | behavior | purpose |
| ------------ | -------- | ------- | 
| `<progress>` | [behavior:progress](../behaviors/behavior-progress) | progress output
| `<meter>` | [behavior:progress](../behaviors/behavior-progress) | static progress output
| `<output>` | [behavior:output](../behaviors/behavior-output) | value output
| `<video>` | [behavior:video](../behaviors/behavior-video) | video output
| `<lottie>` | [behavior:lottie](../behaviors/behavior-lottie) | lottie animations output


## Container elements

| tag and type | behavior | purpose |
| ------------ | -------- | ------- | 
| `<frame>` | [behavior:frame](../behaviors/behavior-frame) | frame, container of loadable documents
| `<frame type=pager>` | [behavior:pager](../behaviors/behavior-pager) | print preview frame
| `<frameset>` | [behavior:frame-set](../behaviors/behavior-frame-set) | container with splitter separated sections
| `<form>` | [behavior:form](../behaviors/behavior-form) | container of input elements, multi-value aggregate
| `<details>` | [behavior:details](../behaviors/behavior-details) | collapsible container

## Menus

| tag and type | behavior | purpose |
| ------------ | -------- | ------- | 
| { menu bar} | [behavior:menu-bar](../behaviors/behavior-frame) | menu bar (no predefined element by default)
| `<menu.context>` | [behavior:menu](../behaviors/behavior-menu) | context menu
| `<menu.popup>` | [behavior:menu](../behaviors/behavior-menu) | generic popup menu
