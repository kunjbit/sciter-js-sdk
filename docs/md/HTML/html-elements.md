---
sidebar_position: 2
title: Supported Elements
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# HTML Elements

Full list of HTML recongnized by default.

:::note
The engine supports custom elements too. In order to render them meaningfully `display` and optionally `flow` needs to be defined for them in CSS.
::: 


| tag | display | parsing | content | purpose |
| --- | ------- | ------- | ------- | ------- |
| TT |    inline |   requires closing |   phrasing |       teletype or monospaced text 
| I |    inline |   requires closing |   phrasing |        italic text style 
| B |    inline |   requires closing |   phrasing |        bold text style 
| U |    inline |   requires closing |   phrasing |        underlined text style 
| STRIKE |    inline |   requires closing |   phrasing |   strike-through text style 
| S |    inline |   requires closing |   phrasing |        strike-through text style 
| Q |    inline |   requires closing |   phrasing |        inline quotation text style 
| DEL |    inline |   requires closing |   opaque |      deleted text style 
| INS |    inline |   requires closing |   opaque |      inserted text style 
| BIG |    inline |   requires closing |   phrasing |      places text in a large font 
| SMALL |    inline |   requires closing |   phrasing |    places text in a small font 
| SUB |    inline |   requires closing |   phrasing |      places text in subscript style 
| SUP |    inline |   requires closing |   phrasing |      places text in superscript style 
| EM |    inline |   requires closing |   phrasing |       basic emphasis typically rendered in an italic font 
| STRONG |    inline |   requires closing |   phrasing |   strong emphasis typically rendered in a bold font 
| DFN |    inline |   requires closing |   phrasing |      defining instance of the enclosed term 
| CODE |    inline |   requires closing |   phrasing |     used for extracts from program code 
| SAMP |    inline |   requires closing |   phrasing |     used for sample output from programs, and scripts etc. 
| KBD |    inline |   requires closing |   phrasing |      used for text to be typed by the user 
| VAR |    inline |   requires closing |   phrasing |      used for variables or arguments to commands 
| CITE |    inline |   requires closing |   phrasing |     used for citations or references to other sources 
| BR |   inline-block |   optional closing |   no content |        
| INPUT |   inline-block |   optional closing |   no content |    inputs
| OUTPUT |   inline-block |   requires closing |   phrasing |    outputs
| BUTTON |   inline-block |   requires closing |   flow |    inputs
| SELECT |   inline-block |   requires closing |   flow |    inputs
| TEXTAREA |   inline-block |   PMODEL_CDATA |   text only |    multiline textbox
| HTMLAREA |   block |   requires closing |   flow |    multiline richtextbox
| RICHTEXT |   block |   requires closing |   flow |    multiline richtextbox
| PLAINTEXT |   block |   PMODEL_CDATA |   text only |    multiline plaintextbox
| P |   block |   requires closing |   phrasing |    paragraph
| TEXT |   block |   requires closing |   phrasing |    anonymous paragraph
| UL |   block |   requires closing |   flow |    unordered lists 
| OL |   block |   requires closing |   flow |    ordered (i.e. numbered, requires closing |  lists 
| DL |   block |   requires closing |   flow |    definition lists 
| DIR |   block |   requires closing |   flow |    unordered lists (eq. UL, requires closing | 
| MENU |   block |   requires closing |   flow |    unordered lists (eq.UL, requires closing | 
| PRE |   block |   requires closing |   phrasing |    preformatted text 
| DIV |   block |   requires closing |   flow |    document divisions 
| CENTER |   block |   requires closing |   flow |    text alignment 
| BLOCKQUOTE |   block |   requires closing |   flow |    quoted passage 
| DD |   block |   requires closing |   flow |    quoted part of DL list 
| DT |   block |   requires closing |   flow |    list item in DL lists
| LI |   block |   requires closing |   flow |    list item
| FORM |   block |   requires closing |   flow |    fill-out forms 
| HR |   block |   optional closing |   flow |    horizontal rules 
| SPLITTER |   block |   requires closing |   flow |    horizontal rules 
| H1 |   block |   requires closing |   phrasing | 
| H2 |   block |   requires closing |   phrasing | 
| H3 |   block |   requires closing |   phrasing | 
| H4 |   block |   requires closing |   phrasing | 
| H5 |   block |   requires closing |   phrasing | 
| H6 |   block |   requires closing |   phrasing | 
| ADDRESS |  block |   requires closing |   flow | 
| A |    inline |   requires closing |  opaque |        anchor, 
| IMG |   inline-block |   optional closing |  no content |      
| FONT |    inline |   requires closing |  phrasing |     
| BASEFONT |   none |   optional closing |  text only |    
| MAP |   none |   requires closing |  flow |      
| AREA |   none |   requires closing |  flow |      
| HTML |   block |   requires closing |  flow |  
| BODY |   block |   requires closing |  flow | 
| HEAD |   none |   requires closing |  flow | 
| TABLE |   TABLE_TAG |   requires closing |  flow |    table
| TD |   TABLE_CELL_TAG |   requires closing |  flow | 
| TH |   TABLE_CELL_TAG |   requires closing |  flow |  
| TBODY |   TABLE_BODY_TAG |   requires closing |  flow |  
| THEAD |   TABLE_BODY_TAG |   requires closing |  flow |  
| TFOOT |   TABLE_BODY_TAG |   requires closing |  flow |  
| CAPTION |   block |   requires closing |  flow |  
| COL |   none |   optional closing |   no content | 
| COLGROUP |   none |   requires closing |  flow |  
| TR |   TABLE_ROW_TAG |   requires closing |  flow | 
| TITLE |   none |   requires closing |  text only |    defines the document title, and is always needed. 
| ISINDEX |   none |   requires closing |  text only |  for simple keyword searches, see PROMPT attribute. 
| BASE |   none |   requires closing |  text only |     defines base URL for resolving relative URLs. 
| STYLE |   none |   PMODEL_CDATA |  text only |    style sheet. 
| META |   none |   optional closing |  text only |     used to supply meta info as name/value pairs. 
| LINK |   none |   optional closing |  text only |     
| SCRIPT |   none |   PMODEL_CDATA |  text only |    script source `<script>`. 
| COMPONENT |   none |   PMODEL_CDATA |   text only |    SSX component: `<component(Clock | >...</component>`. 
| REACTOR |   none |   PMODEL_CDATA |   text only |    SSX component, samething as the above but `<reactor(Clock | >...</reactor>`. 
| OPTION |   block |   requires closing |  flow | 
| OPTGROUP |   block |   requires closing |  flow | 
| OPTIONS |   block |   requires closing |  flow | 
| WIDGET |   block |   requires closing |  flow | 
| PARAM |   none |   requires closing |  text only | 
| OBJECT |   inline-block |   requires closing |  flow | 
| FIELDSET |   block |   requires closing |  flow | 
| LEGEND |   block |   requires closing |  flow | 
| SPAN |    inline |   requires closing |  phrasing | 
| LABEL |    inline |   requires closing |  flow | 
| NOBR |    inline |   requires closing |  flow | 
| IFRAME |   block |   requires closing |  flow |   
| FRAME |   block |   requires closing |  flow |  
| FRAMESET |   block |   requires closing |  flow |  
| POPUP |   block |   requires closing |  flow |   special synthetic tag
| INCLUDE |   block |   requires closing |  text only |   special synthetic tag - `<include src=/>`
| PICTURE |   block |   requires closing |  flow |   special `<picture>` tag - non-cacheable image.
| SECTION |   block |   requires closing |  flow | 
| ARTICLE |   block |   requires closing |  flow | 
| ASIDE |   block |   requires closing |  flow | 
| HGROUP |   block |   requires closing |  flow | 
| HEADER |   block |   requires closing |  flow | 
| FOOTER |   block |   requires closing |  flow | 
| MAIN |   block |   requires closing |  flow | 
| PAGEFRAME |   block |   requires closing |  flow | 
| PAGEBOX |   block |   requires closing |  flow | 
| NAV |   block |   requires closing |  flow | 
| TOOLBAR |   block |   requires closing |  flow | 
| MARK |    inline |   requires closing |  phrasing | 
| PROGRESS |   inline-block |   requires closing |  flow | 
| METER |   inline-block |   requires closing |  flow | 
| TIME |    inline |   requires closing |  flow | 
| FIGURE |   block |   requires closing |  flow | 
| FIGCAPTION |   block |   requires closing |  flow | 
| DETAILS |   block |   requires closing |  flow | 
| SUMMARY |   block |   requires closing |   flow | 
| SVG |   inline-block |   requires closing |   flow |        SVG
| G |   inline-block |   requires closing |   flow |          SVG:G
| PATH |   inline-block |   requires closing |   flow |       SVG:PATH
| RECT |   inline-block |   requires closing |   flow |       SVG:RECT
| CIRCLE |   inline-block |   requires closing |   flow |     SVG:CIRCLE
| ELLIPSE |   inline-block |   requires closing |   flow |    SVG:ELLIPSE
| LINE |   inline-block |   requires closing |   flow |       SVG:LINE
| POLYLINE |   inline-block |   requires closing |   flow |   SVG:POLYLINE
| POLYGON |   inline-block |   requires closing |   flow |    SVG:POLYGON
| SWITCH |   inline-block |   requires closing |   flow |     SVG:SWITCH
| USE |   inline-block |   requires closing |   flow |        SVG:USE
| DEFS |   none |   requires closing |   flow |               SVG:DEFS
| MASK |   none |   requires closing |   flow |               SVG:MASK
| RADIALGRADIENT |   inline-block |   requires closing |   flow |     SVG:RADIALGRADIENT
| LINEARGRADIENT |   inline-block |   requires closing |   flow |     SVG:LINEARGRADIENT
| STOP |   inline-block |   requires closing |   flow |     SVG:STOP
 | TEXT |   inline-block |   requires closing |   flow |     SVG:TEXT
| VIDEO |   block |   requires closing |  flow |   `<video>` 
| SOURCE |   none |   optional closing |  text only |     used to supply source info in video. 
| CANVAS |   block |   optional closing |   flow |   `<canvas>` 

where:

* [_flow_](https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#flow-content) 
* [_phrasing_](https://www.w3.org/TR/2011/WD-html5-20110525/content-models.html#phrasing-content)