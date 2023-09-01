---
title: JS
sidebar_position: 4
---

# JavaScript

JavaScript in Sciter is a superset of [ES2020](https://mbeaudru.github.io/modern-js-cheatsheet/) specification. 

Here is the list of extra features added to JS core by Sciter:

## Predefined constants:

* `__FILE__` - url of current file that is being compiled; 
* `__DIR__` - folder part of the `__FILE__`, always ends with `/` ;
* `__FUNC__` - function name being compiled if available, otherwise one of `<anonymous>`, `<eval>`,  `<script>` or `<module>`;
* `__LINE__` - line number in source file;

## Data Persitence:

Built-in (JS runtime integrated) persistence, see [Storage](../Storage).   

## Reactive and Components support:

* Built-in [JSX](../Reactor/JSX) support, on native parser level. Do not need any preprocessors for JSX literals;
* Integrated [Reactive Components](../Reactor) support. Note this covers as ReactJS as WebComponent support in one unified mechanism;
* Native [Signals](../Reactor/signals) support. [Signals are reactive primitives for managing application state](https://preactjs.com/guide/v10/signals/).





