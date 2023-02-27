// Custom module url resolver shall be defined in module loaded before any others
import * as srt from "@sciter";

const thisDir = __DIR__;

// NPM style module resolver (basic, does not use package.json):
srt.setModuleUrlResolver((name,documentDir,sourceDir)=>{
  return `${thisDir}node_modules/${name}/index.js`;
});

document.on("beforeunload", e => {
  if(e.target === this)
    srt.setModuleUrlResolver(null);
});
