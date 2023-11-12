---
sidebar_position: 6
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Conditional blocks

## @supports rule

The @supports CSS at-rule lets you specify CSS declarations that depend on Sciter's support for CSS properties. 

```css
@supports (<supports-condition>) {
  /* If the condition is true, use the CSS in this block. */
}
```

A _<supports-condition\>_ declaration in Sciter may accept only property/value declaration:

```css
@supports (transform-origin: 5% 5%) {
   /*... rules if Sciter supports transform-origin ... */
}
```

## @if/@else rule

The @if CSS at-rule lets you specify CSS declarations that depend on _only load time values_ of media variables. 

```css
@if (<media-expression>) {
  /* If the condition is true, use the CSS in this block. */
}
```
```css
@if (<media-expression>) {
  /* If the condition is true, use the CSS in this block. */
} 
@else {
  /* Otherwise use the CSS in this block. */
}
```

A _<media-expression\>_ here is [Sciter's media expression](media-const-mixin#media-queries).


`@if` is used for media variables that are not changing at run-time. @if/@else has semantic of `#if ... #else ... #endif`in C/C++ preprocessor - compile time (load time in Sciter) conditional sections:

```css
@if (Windows or MacOS) {
  html { background:white; }
} 
@else {
  html { background:black; }
}
```

Use `@if` blocks for [conditions](media-const-mixin#built-in-media-variables) that never change at runtime and `@media` blocks for conditions that may change at run-time, e.g.  `desktop` media variable will never change but `high-contrast` may change when user will switch to high contrast theme.