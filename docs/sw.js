if(!self.define){let s,e={};const l=(l,r)=>(l=new URL(l+".js",r).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(r,n)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let o={};const u=s=>l(s,i),t={module:{uri:i},exports:o,require:u};e[i]=Promise.all(r.map((s=>t[s]||u(s)))).then((s=>(n(...s),o)))}}define(["./workbox-6cd28afd"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/colorworker.3bb51423.js",revision:null},{url:"assets/da-DK.9379d0cc.js",revision:null},{url:"assets/de-DE.3654cc9d.js",revision:null},{url:"assets/el-GR.80443947.js",revision:null},{url:"assets/en-GB.8e319b84.js",revision:null},{url:"assets/en-US.5e231c46.js",revision:null},{url:"assets/filehandling.8ce5ee49.js",revision:null},{url:"assets/fr-FR.2718e837.js",revision:null},{url:"assets/index.4fcadb15.js",revision:null},{url:"assets/install.de3e3994.js",revision:null},{url:"assets/ko-KR.746fbab1.js",revision:null},{url:"assets/languages.e7e3ff25.js",revision:null},{url:"assets/module-workers-polyfill.min.dc7647fd.js",revision:null},{url:"assets/monochromeworker.3e780118.js",revision:null},{url:"assets/nl-NL.1bc7222e.js",revision:null},{url:"assets/preprocessworker.353fdc25.js",revision:null},{url:"assets/preprocessworker.a4b60f0c.js",revision:null},{url:"assets/style.33037dc3.css",revision:null},{url:"assets/svgoworker.bb79c476.js",revision:null},{url:"assets/vendor.78f84693.js",revision:null},{url:"assets/windowcontrols.4b0dcc09.js",revision:null},{url:"assets/zh-CN.dc3f4e72.js",revision:null},{url:"index.html",revision:"22c58abf8e27e7a800f2ee0cc970d6e2"},{url:"manifest.webmanifest",revision:"2afab6fb30fbe179b8f55c3404813f7f"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
