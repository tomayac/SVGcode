// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
const e=(()=>{if(self!==top)try{top.location}catch{return!1}else{if("chooseFileSystemEntries"in self)return"chooseFileSystemEntries";if("showOpenFilePicker"in self)return"showOpenFilePicker"}return!1})(),i=e?"chooseFileSystemEntries"===e?import("./file-open.c1794569.js"):import("./file-open.05d00c00.js"):import("./file-open.1fe7b44c.js");
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
async function t(...e){return(await i).default(...e)}
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
e?"chooseFileSystemEntries"===e?import("./directory-open.1e94465d.js"):import("./directory-open.91239a8f.js"):import("./directory-open.2fe4b6a5.js");
// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
const o=e?"chooseFileSystemEntries"===e?import("./file-save.f4966a97.js"):import("./file-save.fb4972a3.js"):import("./file-save.72f7afaf.js");async function s(...e){return(await o).default(...e)}export{s as a,e,t as f};
