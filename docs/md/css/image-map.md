---
sidebar_position: 8
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# CSS Sprite: @image-map

Image Map is a catalog of named areas (fragments) of some base bitmap image.

## @image-map rule

Image Map is declared by using `@image-map` declaration: 

```css
@image-map toolbar-icons 
{
  /* we define three images under this single logical entity */
  src:   url(tb-icons.png) 120dpi,    /* <= 120dpi */
         url(tb-icons-x2.png) 240dpi, /* <= 240dpi */
         url(tb-icons-jumbo.png);     /* the rest  */

  cells: 15 2;                        /* 15 columns, 2 rows in the image */

  /* logical names of the parts */ 
  items: bold, italic, underline, strike,
         font-family, font-size, text-color, text-back-color;
}
```

This declares set of names associated with cells or fragments of the base image. 

:::note
Image map supports set of sources for different resolutions   
:::

## image-map() function

Fragment of image map is addressable by the image-map() function:
```css
image-map(map-name,part-name)
```
That selects part _part-name_ of map _map-name_ as animage fragment.

Fragment of an image map can be used at any CSS property that expects and image:

```css
toolbar > button {
  size:2em;
  background:no-repeat 50% 50%; padding:3px;
}
/* use of image-map fragments */
toolbar > button.bold      { background-image:image-map(toolbar-icons,bold); } 
toolbar > button.italic    { background-image:image-map(toolbar-icons,italic); } 
toolbar > button.underline { background-image:image-map(toolbar-icons,underline); } 
toolbar > button.strike    { background-image:image-map(toolbar-icons,strike); } 
```

