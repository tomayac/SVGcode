if(!self.define){let s,e={};const r=(r,l)=>(r=new URL(r+".js",l).href,e[r]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=r,s.onload=e,document.head.appendChild(s)}else s=r,importScripts(r),e()})).then((()=>{let s=e[r];if(!s)throw new Error(`Module ${r} didn’t register its module`);return s})));self.define=(l,n)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let o={};const t=s=>r(s,i),u={module:{uri:i},exports:o,require:t};e[i]=Promise.all(l.map((s=>u[s]||t(s)))).then((s=>(n(...s),o)))}}define(["./workbox-6cd28afd"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/colorworker.3bb51423.js",revision:null},{url:"assets/de-DE.cc4f3a0c.js",revision:null},{url:"assets/el-GR.45cae4a7.js",revision:null},{url:"assets/en-US.8a7150ac.js",revision:null},{url:"assets/filehandling.e1411625.js",revision:null},{url:"assets/index.30ee5730.js",revision:null},{url:"assets/index.83034e7f.css",revision:null},{url:"assets/install.cdb36f95.js",revision:null},{url:"assets/module-workers-polyfill.min.dc7647fd.js",revision:null},{url:"assets/monochromeworker.3e780118.js",revision:null},{url:"assets/preprocessworker.353fdc25.js",revision:null},{url:"assets/preprocessworker.a4b60f0c.js",revision:null},{url:"assets/svgoworker.bb79c476.js",revision:null},{url:"assets/vendor.78f84693.js",revision:null},{url:"assets/windowcontrols.5f3bb039.js",revision:null},{url:"index.html",revision:"d29384e35951e77a6a2e8438fa83b982"},{url:"manifest.webmanifest",revision:"2afab6fb30fbe179b8f55c3404813f7f"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
