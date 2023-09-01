---
sidebar_position: 4
title: Client Side Includes
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# HTML `<include>`s

Sciter allows to assemble a document from fragments at load time by using `<include>` meta element:

```html
<include src="url" [media="..."]>
  ... fallback content (optional) ...
</include>
```

If fallback content is provided it will appear in final DOM if _url_ data is not available or if media expression will be resolved to _false_.

This feature allows to load fragments as conditionally, by using media expressions, as unconditionally:

```html
<body>
  <include src="windows-header.htm" media='platform == "Windows"' />
  <include src="osx-header.htm" media='platform == "OSX"' />
  <include src="linux-header.htm" media='platform == "Linux"' />
  <include src="content.htm" />
</body>
```



