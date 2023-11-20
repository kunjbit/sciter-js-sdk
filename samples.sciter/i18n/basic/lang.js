import * as sciter from "@sciter";

const translations = {}; // all translations
let   lang;
let   translation = {}; // current translation table

export function setLang(langName) {

  let update = !!lang;
  if(!(langName in translations)) {
     let t = sciter.import(__DIR__ + `lang-${langName}.js`)?.default;
     translations[langName] = t;
     translation = t;
  } else {
     translation = translations[langName];
  }
  document.attributes["lang"] = lang = langName;
  if(update) {
    for(let element of document.$$(".x"))
      element.translate();
  }
}

setLang(document.attributes["lang"] || "en");

export function translate() {
  const key = this.innerText;
  this.translate = () => {
    const newText = translation[key];
    if( newText ) this.innerText = newText;
  }
  this.translate();
}