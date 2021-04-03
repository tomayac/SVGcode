// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
const e=async e=>{const t=await e.getFile();return t.handle=e,t};export default async(t={})=>{const i=await window.chooseFileSystemEntries({accepts:[{description:t.description||"",mimeTypes:t.mimeTypes||["*/*"],extensions:t.extensions||[""]}],multiple:t.multiple||!1});return t.multiple?Promise.all(i.map(e)):e(i)};
