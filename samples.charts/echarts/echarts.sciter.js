
export function createCanvas() {
  document.head.append(<canvas/>);
  return document.head.lastElementChild;
}

export function measureText(text,font) {
  const gtext = new Graphics.Text(text);
  if(font) gtext.font = font;
  const [miw,maw] = gtext.width();
  return { width:maw }
}

export async function loadImage(src,onload,onerror) {
  try {
    const img = Graphics.Image.load(src); 
    if(onload) onload(img);
  } catch(e) {
    if(onerror) onerror(e);
  }
}