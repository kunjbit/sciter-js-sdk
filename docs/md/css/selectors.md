---
sidebar_position: 2
title: Selectors
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# CSS Selectors

Selectors supported by Sciter 

## CSS 2.1 and CSS 3 selectors

| Pattern                     | Represents                                                                                                                         | Description                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| \*                          | any element                                                                                                                        | [Universal selector](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#universal-selector)                     |
| E                           | an element of type E                                                                                                               | [Type selector](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#type-selectors)                              |
| E\[foo]                     | an E element with a "foo" attribute                                                                                                | [Attribute selectors](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#attribute-selectors)                   |
| E\[foo="bar"]               | an E element whose "foo" attribute value is exactly equal to "bar"                                                                 | [Attribute selectors](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#attribute-selectors)                   |
| E\[foo\~="bar"]             | an E element whose "foo" attribute value is a list of whitespace-separated values, one of which is exactly equal to "bar"          | [Attribute selectors](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#attribute-selectors)                   |
| E\[foo^="bar"]              | an E element whose "foo" attribute value begins exactly with the string "bar"                                                      | [Attribute selectors](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#attribute-selectors)                   |
| E\[foo$="bar"]              | an E element whose "foo" attribute value ends exactly with the string "bar"                                                        | [Attribute selectors](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#attribute-selectors)                   |
| E\[foo\*="bar"]             | an E element whose "foo" attribute value contains the substring "bar"                                                              | [Attribute selectors](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#attribute-selectors)                   |
| E\[foo\|="en"]              | an E element whose "foo" attribute has a hyphen-separated list of values beginning (from the left) with "en"                       | [Attribute selectors](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#attribute-selectors)                   |
| E:root                     | an E element, root of the document                                                                                                 | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:nth-child(n)             | an E element, the n-th child of its parent                                                                                         | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:nth-last-child(n)        | an E element, the n-th child of its parent, counting from the last one                                                             | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:nth-of-type(n)           | an E element, the n-th sibling of its type                                                                                         | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:nth-last-of-type(n)      | an E element, the n-th sibling of its type, counting from the last one                                                             | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:first-child              | an E element, first child of its parent                                                                                            | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:last-child               | an E element, last child of its parent                                                                                             | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:first-of-type            | an E element, first sibling of its type                                                                                            | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:last-of-type             | an E element, last sibling of its type                                                                                             | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:only-child               | an E element, only child of its parent                                                                                             | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:only-of-type             | an E element, only sibling of its type                                                                                             | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:empty                    | an E element that has no children (including text nodes)                                                                           | [Structural pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#structural-pseudos)              |
| E:link E:visited          | an E element being the source anchor of a hyperlink of which the target is not yet visited (:link) or already visited (:visited) | [The link pseudo-classes](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#link)                              |
| E:lang(fr)                 | an element of type E in language "fr" (the document language specifies how language is determined)                                 | [The :lang() pseudo-class](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#lang-pseudo)                     |
| E::before                   | generated content before an E element                                                                                              | [The ::before pseudo-element](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#gen-content)                   |
| E::after                    | generated content after an E element                                                                                               | [The ::after pseudo-element](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#gen-content)                    |
| E.warning                   | an E element whose class is "warning" (the document language specifies how class is determined).                                   | [Class selectors](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#class-html)                                |
| E#myid                      | an E element with ID equal to "myid".                                                                                              | [ID selectors](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#id-selectors)                                 |
| E:not(s)                   | an E element that does not match simple selector s                                                                                 | [Negation pseudo-class](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#negation)                            |
| E F                         | an F element descendant of an E element                                                                                            | [Descendant combinator](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#descendant-combinators)              |
| E > F                       | an F element child of an E element                                                                                                 | [Child combinator](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#child-combinators)                        |
| E + F                       | an F element immediately preceded by an E element                                                                                  | [Next-sibling combinator](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#adjacent-sibling-combinators)      |
| E \~ F                      | an F element preceded by an E element                                                                                              | [Subsequent-sibling combinator](https://www.w3.org/TR/2018/REC-selectors-3-20181106/#general-sibling-combinators) |

## Sciter shortcut selectors

| Pattern            | Represents  |
| ------------------ | ----------- | 
| E(name)            | Equivalent of E[name="name"]
| E\|name             | Equivalent of E[type="name"]

## State CSS selectors

These selectors are reflected in JavaScript as element.state.xxx.

Some of them are set by runtime only and some are allowed to be set by JS.

| Pattern                     | Matches                                                                 | JS                                  |
| --------------------------- | ----------------------------------------------------------------------- | ----------------------------------- |
| E:empty                    | an element that has no children or `<input>` elements with no value set | element.state.empty |
| E:active                   | mouse/touch pressed on an element                                       | element.state.active |
| E:hover                    | mouse is inside an element                                              | element.state.hover |
| E:focus                    | an E element is in focus                                                | element.state.focus |
| E:tab-focus                | an E element got focus by TAB traversal                                 | element.state.tabfocus |
| E:owns-focus               | an E element has focused descendant inside it                           | element.state.ownsfocus |
| E:focusable                | an E element is focusable                                               | element.state.focusable |
| E:link                     | an E element has behavior:hyperlink                                     | element.state.link |
| E:visited                  | not used by Sciter, but JS code can set it                              | element.state.visited |
| E:checked                  | an element is checked (for instance a radio-button, checkbox or option) | element.state.checked |
| E:current                  | an element is current (for instance an option in select)                | element.state.current |
| E:disabled                 | an element is disabled                                                  | element.state.disabled |
| E:read-only                | an element is read only (for instance textarea or htmlarea)             | element.state.readonly |
| E:expanded                 | an element is expanded (option in select\|tree)                         | element.state.expanded |
| E:collapsed                | an element is collapsed (option in select\|tree), element can have either :expanded or :collapsed flag set| element.state.collapsed |
| E:node                     | an element is an expandable/collapsible node option in select\|tree     | element.state.node |
| E:incomplete               | an element is incomplete (img or frame has no content arrived )         | element.state.incomplete |
| E:busy                     | an element is busy (img or frame is loading )                           | element.state.busy |
| E:invalid                  | input element has an invalid value                                      | element.state.invalid |
| E:animating                | an element has running transition or animation (including scroll) on it | element.state.animating |
| E:popup                    | an element is shown as a popup now                                      | element.state.popup |
| E:owns-popup               | an E element has popup shown for it by E.popup(popupEl)                 | element.state.ownspopup |
| E:drag-over                | drag over an E element    | element.state.dragover |
| E:drag-source              | an E element is a drag source, see [window.performDrag()](../DOM/Window#performdrag) | element.state.dragsource |
| E:drop-target              | not used intenaly, for JS use only  | element.state.droptarget |
| E:ltr                      | an element is in LTR environment | element.state.isltr |
| E:rtl                      | an element is in RTL environment | element.state.isltr |
| E:theme(A)                 | an E element or one of its parents has theme="A-B" or theme="B-A" attribute defined  | N/A |
| E:window-root              | an E element is a window root - either root document of the window or a popup element that has window created for it | N/A |
| E:blur-behind              | a :window-root element that uses blur-behind background | N/A |

:::tip
At runtime these state flags can be set by JS as 
```js
element.state.visited = true;
```
for example.
:::

:::tip
In JSX these state flags can be set at attributes by prepending "state-" to the names above:
```js
render() {
  return <div state-visited={true}>...</div>
}

```
:::
