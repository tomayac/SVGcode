var Se=Object.defineProperty,y=(t,e)=>()=>(t&&(e=t(t=0)),e),w=(t,e)=>{for(var n in e)Se(t,n,{get:e[n],enumerable:!0})},Q={};w(Q,{default:()=>ee});var ee,Pe=y(()=>{ee=async(t=[{}])=>(Array.isArray(t)||(t=[t]),new Promise((e,n)=>{let i=document.createElement("input");i.type="file";let s=[...t.map(o=>o.mimeTypes||[]).join(),t.map(o=>o.extensions||[]).join()].join();i.multiple=t[0].multiple||!1,i.accept=s||"";let l=()=>r(n),c=o=>{typeof r=="function"&&r(),e(o)},r=t[0].legacySetup&&t[0].legacySetup(c,l,i);i.addEventListener("change",()=>{c(i.multiple?Array.from(i.files):i.files[0])}),i.click()}))}),te={};w(te,{default:()=>ie});var ne,ie,Ce=y(()=>{ne=async t=>{let e=await t.getFile();return e.handle=t,e},ie=async(t=[{}])=>{Array.isArray(t)||(t=[t]);let e=[];t.forEach((s,l)=>{e[l]={description:s.description||"",accept:{}},s.mimeTypes?s.mimeTypes.map(c=>{e[l].accept[c]=s.extensions||[]}):e[l].accept["*/*"]=s.extensions||[]});let n=await window.showOpenFilePicker({id:t[0].id,startIn:t[0].startIn,types:e,multiple:t[0].multiple||!1,excludeAcceptAllOption:t[0].excludeAcceptAllOption||!1}),i=await Promise.all(n.map(ne));return t[0].multiple?i:i[0]}}),re={};w(re,{default:()=>se});var se,Ae=y(()=>{se=async(t=[{}])=>(Array.isArray(t)||(t=[t]),t[0].recursive=t[0].recursive||!1,new Promise((e,n)=>{let i=document.createElement("input");i.type="file",i.webkitdirectory=!0;let s=()=>c(n),l=r=>{typeof c=="function"&&c(),e(r)},c=t[0].legacySetup&&t[0].legacySetup(l,s,i);i.addEventListener("change",()=>{let r=Array.from(i.files);t[0].recursive?t[0].recursive&&t[0].skipDirectory&&(r=r.filter(o=>o.webkitRelativePath.split("/").every(a=>!t[0].skipDirectory({name:a,kind:"directory"})))):r=r.filter(o=>o.webkitRelativePath.split("/").length===2),l(r)}),i.click()}))}),oe={};w(oe,{default:()=>ae});var j,ae,Te=y(()=>{j=async(t,e,n=t.name,i)=>{let s=[],l=[];for await(let c of t.values()){let r=`${n}/${c.name}`;c.kind==="file"?l.push(c.getFile().then(o=>(o.directoryHandle=t,o.handle=c,Object.defineProperty(o,"webkitRelativePath",{configurable:!0,enumerable:!0,get:()=>r})))):c.kind==="directory"&&e&&(!i||!i(c))&&s.push(j(c,e,r,i))}return[...(await Promise.all(s)).flat(),...await Promise.all(l)]},ae=async(t={})=>{t.recursive=t.recursive||!1;let e=await window.showDirectoryPicker({id:t.id,startIn:t.startIn});return j(e,t.recursive,void 0,t.skipDirectory)}}),ce={};w(ce,{default:()=>le});async function Re(t,e){let n=t.getReader(),i=new ReadableStream({start(l){return c();async function c(){return n.read().then(({done:r,value:o})=>{if(r){l.close();return}return l.enqueue(o),c()})}}}),s=new Response(i);return n.releaseLock(),new Blob([await s.blob()],{type:e})}var le,Me=y(()=>{le=async(t,e={})=>{Array.isArray(e)&&(e=e[0]);let n=document.createElement("a"),i=t;"body"in t&&(i=await Re(t.body,t.headers.get("content-type"))),n.download=e.fileName||"Untitled",n.href=URL.createObjectURL(i);let s=()=>c(reject),l=()=>{typeof c=="function"&&c()},c=e.legacySetup&&e.legacySetup(l,s,n);return n.addEventListener("click",()=>{setTimeout(()=>URL.revokeObjectURL(n.href),30*1e3),l()}),n.click(),null}}),he={};w(he,{default:()=>de});var de,Ie=y(()=>{de=async(t,e=[{}],n=null,i=!1)=>{Array.isArray(e)||(e=[e]),e[0].fileName=e[0].fileName||"Untitled";let s=[];if(e.forEach((r,o)=>{s[o]={description:r.description||"",accept:{}},r.mimeTypes?(o===0&&(t.type?r.mimeTypes.push(t.type):t.headers&&t.headers.get("content-type")&&r.mimeTypes.push(t.headers.get("content-type"))),r.mimeTypes.map(a=>{s[o].accept[a]=r.extensions||[]})):t.type&&(s[o].accept[t.type]=r.extensions||[])}),n)try{await n.getFile()}catch(r){if(n=null,i)throw r}let l=n||await window.showSaveFilePicker({suggestedName:e[0].fileName,id:e[0].id,startIn:e[0].startIn,types:s,excludeAcceptAllOption:e[0].excludeAcceptAllOption||!1}),c=await l.createWritable();return"stream"in t?(await t.stream().pipeTo(c),l):"body"in t?(await t.body.pipeTo(c),l):(await c.write(blob),await c.close(),l)}}),ze=(()=>{if(typeof self=="undefined")return!1;if("top"in self&&self!==top)try{top.location+""}catch{return!1}else if("showOpenFilePicker"in self)return"showOpenFilePicker";return!1})(),H=ze,Be=H?Promise.resolve().then(()=>(Ce(),te)):Promise.resolve().then(()=>(Pe(),Q));async function Ze(...t){return(await Be).default(...t)}H?Promise.resolve().then(()=>(Te(),oe)):Promise.resolve().then(()=>(Ae(),re));var je=H?Promise.resolve().then(()=>(Ie(),he)):Promise.resolve().then(()=>(Me(),ce));async function Je(...t){return(await je).default(...t)}// @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
function He(){var t=!navigator.userAgentData&&/Safari\//.test(navigator.userAgent)&&!/Chrom(e|ium)\//.test(navigator.userAgent);if(!t||!indexedDB.databases)return Promise.resolve();var e;return new Promise(function(n){var i=function(){return indexedDB.databases().finally(n)};e=setInterval(i,100),i()}).finally(function(){return clearInterval(e)})}function C(t){return new Promise((e,n)=>{t.oncomplete=t.onsuccess=()=>e(t.result),t.onabort=t.onerror=()=>n(t.error)})}function Ve(t,e){const n=He().then(()=>{const i=indexedDB.open(t);return i.onupgradeneeded=()=>i.result.createObjectStore(e),C(i)});return(i,s)=>n.then(l=>s(l.transaction(e,i).objectStore(e)))}let V;function O(){return V||(V=Ve("keyval-store","keyval")),V}function Qe(t,e=O()){return e("readonly",n=>C(n.get(t)))}function et(t,e,n=O()){return n("readwrite",i=>(i.put(e,t),C(i.transaction)))}function tt(t,e=O()){return e("readwrite",n=>(n.delete(t),C(n.transaction)))}class g{constructor(e){this.id=-1,this.nativePointer=e,this.pageX=e.pageX,this.pageY=e.pageY,this.clientX=e.clientX,this.clientY=e.clientY,self.Touch&&e instanceof Touch?this.id=e.identifier:L(e)&&(this.id=e.pointerId)}getCoalesced(){if("getCoalescedEvents"in this.nativePointer){const e=this.nativePointer.getCoalescedEvents().map(n=>new g(n));if(e.length>0)return e}return[this]}}const L=t=>"pointerId"in t,Y=t=>"changedTouches"in t,ue=()=>{};class Oe{constructor(e,{start:n=()=>!0,move:i=ue,end:s=ue,rawUpdates:l=!1,avoidPointerEvents:c=!1}={}){this._element=e,this.startPointers=[],this.currentPointers=[],this._excludeFromButtonsCheck=new Set,this._pointerStart=r=>{if(L(r)&&r.buttons===0)this._excludeFromButtonsCheck.add(r.pointerId);else if(!(r.buttons&1))return;const o=new g(r);this.currentPointers.some(a=>a.id===o.id)||!this._triggerPointerStart(o,r)||(L(r)?((r.target&&"setPointerCapture"in r.target?r.target:this._element).setPointerCapture(r.pointerId),this._element.addEventListener(this._rawUpdates?"pointerrawupdate":"pointermove",this._move),this._element.addEventListener("pointerup",this._pointerEnd),this._element.addEventListener("pointercancel",this._pointerEnd)):(window.addEventListener("mousemove",this._move),window.addEventListener("mouseup",this._pointerEnd)))},this._touchStart=r=>{for(const o of Array.from(r.changedTouches))this._triggerPointerStart(new g(o),r)},this._move=r=>{if(!Y(r)&&(!L(r)||!this._excludeFromButtonsCheck.has(r.pointerId))&&r.buttons===0){this._pointerEnd(r);return}const o=this.currentPointers.slice(),a=Y(r)?Array.from(r.changedTouches).map(d=>new g(d)):[new g(r)],h=[];for(const d of a){const u=this.currentPointers.findIndex(m=>m.id===d.id);u!==-1&&(h.push(d),this.currentPointers[u]=d)}h.length!==0&&this._moveCallback(o,h,r)},this._triggerPointerEnd=(r,o)=>{if(!Y(o)&&o.buttons&1)return!1;const a=this.currentPointers.findIndex(d=>d.id===r.id);if(a===-1)return!1;this.currentPointers.splice(a,1),this.startPointers.splice(a,1),this._excludeFromButtonsCheck.delete(r.id);const h=!(o.type==="mouseup"||o.type==="touchend"||o.type==="pointerup");return this._endCallback(r,o,h),!0},this._pointerEnd=r=>{if(!!this._triggerPointerEnd(new g(r),r))if(L(r)){if(this.currentPointers.length)return;this._element.removeEventListener(this._rawUpdates?"pointerrawupdate":"pointermove",this._move),this._element.removeEventListener("pointerup",this._pointerEnd),this._element.removeEventListener("pointercancel",this._pointerEnd)}else window.removeEventListener("mousemove",this._move),window.removeEventListener("mouseup",this._pointerEnd)},this._touchEnd=r=>{for(const o of Array.from(r.changedTouches))this._triggerPointerEnd(new g(o),r)},this._startCallback=n,this._moveCallback=i,this._endCallback=s,this._rawUpdates=l&&"onpointerrawupdate"in window,self.PointerEvent&&!c?this._element.addEventListener("pointerdown",this._pointerStart):(this._element.addEventListener("mousedown",this._pointerStart),this._element.addEventListener("touchstart",this._touchStart),this._element.addEventListener("touchmove",this._move),this._element.addEventListener("touchend",this._touchEnd),this._element.addEventListener("touchcancel",this._touchEnd))}stop(){this._element.removeEventListener("pointerdown",this._pointerStart),this._element.removeEventListener("mousedown",this._pointerStart),this._element.removeEventListener("touchstart",this._touchStart),this._element.removeEventListener("touchmove",this._move),this._element.removeEventListener("touchend",this._touchEnd),this._element.removeEventListener("touchcancel",this._touchEnd),this._element.removeEventListener(this._rawUpdates?"pointerrawupdate":"pointermove",this._move),this._element.removeEventListener("pointerup",this._pointerEnd),this._element.removeEventListener("pointercancel",this._pointerEnd),window.removeEventListener("mousemove",this._move),window.removeEventListener("mouseup",this._pointerEnd)}_triggerPointerStart(e,n){return this._startCallback(e,n)?(this.currentPointers.push(e),this.startPointers.push(e),!0):!1}}function Ye(t,e){e===void 0&&(e={});var n=e.insertAt;if(!(!t||typeof document=="undefined")){var i=document.head||document.getElementsByTagName("head")[0],s=document.createElement("style");s.type="text/css",n==="top"&&i.firstChild?i.insertBefore(s,i.firstChild):i.appendChild(s),s.styleSheet?s.styleSheet.cssText=t:s.appendChild(document.createTextNode(t))}}var Ue=`pinch-zoom {
  display: block;
  overflow: hidden;
  touch-action: none;
  --scale: 1;
  --x: 0;
  --y: 0;
}

pinch-zoom > * {
  transform: translate(var(--x), var(--y)) scale(var(--scale));
  transform-origin: 0 0;
  will-change: transform;
}
`;Ye(Ue);const A="min-scale";function pe(t,e){return e?Math.sqrt((e.clientX-t.clientX)**2+(e.clientY-t.clientY)**2):0}function me(t,e){return e?{clientX:(t.clientX+e.clientX)/2,clientY:(t.clientY+e.clientY)/2}:t}function fe(t,e){return typeof t=="number"?t:t.trimRight().endsWith("%")?e*parseFloat(t)/100:parseFloat(t)}let ve;function ge(){return ve||(ve=document.createElementNS("http://www.w3.org/2000/svg","svg"))}function U(){return ge().createSVGMatrix()}function be(){return ge().createSVGPoint()}const X=.01;class Xe extends HTMLElement{constructor(){super();this._transform=U(),new MutationObserver(()=>this._stageElChange()).observe(this,{childList:!0});const e=new Oe(this,{start:(n,i)=>e.currentPointers.length===2||!this._positioningEl?!1:(i.preventDefault(),!0),move:n=>{this._onPointerMove(n,e.currentPointers)}});this.addEventListener("wheel",n=>this._onWheel(n))}static get observedAttributes(){return[A]}attributeChangedCallback(e,n,i){e===A&&this.scale<this.minScale&&this.setTransform({scale:this.minScale})}get minScale(){const e=this.getAttribute(A);if(!e)return X;const n=parseFloat(e);return Number.isFinite(n)?Math.max(X,n):X}set minScale(e){this.setAttribute(A,String(e))}connectedCallback(){this._stageElChange()}get x(){return this._transform.e}get y(){return this._transform.f}get scale(){return this._transform.a}scaleTo(e,n={}){let{originX:i=0,originY:s=0}=n;const{relativeTo:l="content",allowChangeEvent:c=!1}=n,r=l==="content"?this._positioningEl:this;if(!r||!this._positioningEl){this.setTransform({scale:e,allowChangeEvent:c});return}const o=r.getBoundingClientRect();if(i=fe(i,o.width),s=fe(s,o.height),l==="content")i+=this.x,s+=this.y;else{const a=this._positioningEl.getBoundingClientRect();i-=a.left,s-=a.top}this._applyChange({allowChangeEvent:c,originX:i,originY:s,scaleDiff:e/this.scale})}setTransform(e={}){const{scale:n=this.scale,allowChangeEvent:i=!1}=e;let{x:s=this.x,y:l=this.y}=e;if(!this._positioningEl){this._updateTransform(n,s,l,i);return}const c=this.getBoundingClientRect(),r=this._positioningEl.getBoundingClientRect();if(!c.width||!c.height){this._updateTransform(n,s,l,i);return}let o=be();o.x=r.left-c.left,o.y=r.top-c.top;let a=be();a.x=r.width+o.x,a.y=r.height+o.y;const h=U().translate(s,l).scale(n).multiply(this._transform.inverse());o=o.matrixTransform(h),a=a.matrixTransform(h),o.x>c.width?s+=c.width-o.x:a.x<0&&(s+=-a.x),o.y>c.height?l+=c.height-o.y:a.y<0&&(l+=-a.y),this._updateTransform(n,s,l,i)}_updateTransform(e,n,i,s){if(!(e<this.minScale)&&!(e===this.scale&&n===this.x&&i===this.y)&&(this._transform.e=n,this._transform.f=i,this._transform.d=this._transform.a=e,this.style.setProperty("--x",this.x+"px"),this.style.setProperty("--y",this.y+"px"),this.style.setProperty("--scale",this.scale+""),s)){const l=new Event("change",{bubbles:!0});this.dispatchEvent(l)}}_stageElChange(){this._positioningEl=void 0,this.children.length!==0&&(this._positioningEl=this.children[0],this.children.length>1&&console.warn("<pinch-zoom> must not have more than one child."),this.setTransform({allowChangeEvent:!0}))}_onWheel(e){if(!this._positioningEl)return;e.preventDefault();const n=this._positioningEl.getBoundingClientRect();let{deltaY:i}=e;const{ctrlKey:s,deltaMode:l}=e;l===1&&(i*=15);const r=1-i/(s?100:300);this._applyChange({scaleDiff:r,originX:e.clientX-n.left,originY:e.clientY-n.top,allowChangeEvent:!0})}_onPointerMove(e,n){if(!this._positioningEl)return;const i=this._positioningEl.getBoundingClientRect(),s=me(e[0],e[1]),l=me(n[0],n[1]),c=s.clientX-i.left,r=s.clientY-i.top,o=pe(e[0],e[1]),a=pe(n[0],n[1]),h=o?a/o:1;this._applyChange({originX:c,originY:r,scaleDiff:h,panX:l.clientX-s.clientX,panY:l.clientY-s.clientY,allowChangeEvent:!0})}_applyChange(e={}){const{panX:n=0,panY:i=0,originX:s=0,originY:l=0,scaleDiff:c=1,allowChangeEvent:r=!1}=e,o=U().translate(n,i).translate(s,l).translate(this.x,this.y).scale(c).translate(-s,-l).scale(this.scale);this.setTransform({allowChangeEvent:r,scale:o.a,x:o.e,y:o.f})}}customElements.define("pinch-zoom",Xe);// @license © 2019 Google LLC. Licensed under the Apache License, Version 2.0.
const x=document,$=localStorage,T="prefers-color-scheme",R="media",f="light",v="dark",ye=`(${T}:${v})`,De=`(${T}:${f})`,we="link[rel=stylesheet]",D="remember",W="legend",M="toggle",Ee="switch",F="appearance",q="permanent",N="mode",S="colorschemechange",G="permanentcolorscheme",ke="all",K="not all",p="dark-mode-toggle",E="https://googlechromelabs.github.io/dark-mode-toggle/demo/",k=(t,e,n=e)=>{Object.defineProperty(t,n,{enumerable:!0,get(){const i=this.getAttribute(e);return i===null?"":i},set(i){this.setAttribute(e,i)}})},We=(t,e,n=e)=>{Object.defineProperty(t,n,{enumerable:!0,get(){return this.hasAttribute(e)},set(i){i?this.setAttribute(e,""):this.removeAttribute(e)}})},_e=x.createElement("template");_e.innerHTML=`<style>*,::after,::before{box-sizing:border-box}:host{contain:content;display:block}:host([hidden]){display:none}form{background-color:var(--${p}-background-color,transparent);color:var(--${p}-color,inherit);padding:0}fieldset{border:none;margin:0;padding-block:.25rem;padding-inline:.25rem}legend{font:var(--${p}-legend-font,inherit);padding:0}input,label{cursor:pointer}label{white-space:nowrap}input{opacity:0;position:absolute;pointer-events:none}input:focus-visible+label{outline:#e59700 auto 2px;outline:-webkit-focus-ring-color auto 5px}label:not(:empty)::before{margin-inline-end:.5rem;}label::before{content:"";display:inline-block;background-size:var(--${p}-icon-size,1rem);background-repeat:no-repeat;height:var(--${p}-icon-size,1rem);width:var(--${p}-icon-size,1rem);vertical-align:middle;}[part=lightLabel]::before{background-image:var(--${p}-light-icon, url("${E}sun.png"))}[part=darkLabel]::before{filter:var(--${p}-icon-filter, none);background-image:var(--${p}-dark-icon, url("${E}moon.png"))}[part=toggleLabel]::before{background-image:var(--${p}-checkbox-icon,none)}[part=permanentLabel]::before{background-image:var(--${p}-remember-icon-unchecked, url("${E}unchecked.svg"))}[part=darkLabel],[part=lightLabel],[part=toggleLabel]{font:var(--${p}-label-font,inherit)}[part=darkLabel]:empty,[part=lightLabel]:empty,[part=toggleLabel]:empty{font-size:0;padding:0}[part=permanentLabel]{font:var(--${p}-remember-font,inherit)}input:checked+[part=permanentLabel]::before{background-image:var(--${p}-remember-icon-checked, url("${E}checked.svg"))}input:checked+[part=darkLabel],input:checked+[part=lightLabel]{background-color:var(--${p}-active-mode-background-color,transparent)}input:checked+[part=darkLabel]::before,input:checked+[part=lightLabel]::before{background-color:var(--${p}-active-mode-background-color,transparent)}input:checked+[part=toggleLabel]::before{filter:var(--${p}-icon-filter, none)}input:checked+[part=toggleLabel]+aside [part=permanentLabel]::before{filter:var(--${p}-remember-filter, invert(100%))}aside{visibility:hidden;margin-block-start:.15rem}[part=darkLabel]:focus-visible~aside,[part=lightLabel]:focus-visible~aside,[part=toggleLabel]:focus-visible~aside{visibility:visible;transition:visibility 0s}aside [part=permanentLabel]:empty{display:none}@media (hover:hover){aside{transition:visibility 3s}aside:hover{visibility:visible}[part=darkLabel]:hover~aside,[part=lightLabel]:hover~aside,[part=toggleLabel]:hover~aside{visibility:visible;transition:visibility 0s}}</style><form part=form><fieldset part=fieldset><legend part=legend></legend><input part=lightRadio id=l name=mode type=radio><label part=lightLabel for=l></label><input part=darkRadio id=d name=mode type=radio><label part=darkLabel for=d></label><input part=toggleCheckbox id=t type=checkbox><label part=toggleLabel for=t></label><aside part=aside><input part=permanentCheckbox id=p type=checkbox><label part=permanentLabel for=p></label></aside></fieldset></form>`;class Fe extends HTMLElement{static get observedAttributes(){return[N,F,q,W,f,v,D]}constructor(){super();k(this,N),k(this,F),k(this,W),k(this,f),k(this,v),k(this,D),We(this,q),this.t=null,this.i=null,x.addEventListener(S,e=>{this.mode=e.detail.colorScheme,this.o(),this.l()}),x.addEventListener(G,e=>{this.permanent=e.detail.permanent,this.h.checked=this.permanent}),this.p()}p(){const e=this.attachShadow({mode:"open"});e.appendChild(_e.content.cloneNode(!0)),this.t=x.querySelectorAll(`${we}[${R}*=${T}][${R}*="${v}"]`),this.i=x.querySelectorAll(`${we}[${R}*=${T}][${R}*="${f}"]`),this.g=e.querySelector("[part=lightRadio]"),this.m=e.querySelector("[part=lightLabel]"),this.u=e.querySelector("[part=darkRadio]"),this.k=e.querySelector("[part=darkLabel]"),this.v=e.querySelector("[part=toggleCheckbox]"),this.$=e.querySelector("[part=toggleLabel]"),this.L=e.querySelector("legend"),this.M=e.querySelector("aside"),this.h=e.querySelector("[part=permanentCheckbox]"),this.C=e.querySelector("[part=permanentLabel]");const n=matchMedia(ye).media!==K;n&&matchMedia(ye).addListener(({matches:s})=>{this.mode=s?v:f,this.R(S,{colorScheme:this.mode})});const i=$.getItem(p);i&&[v,f].includes(i)?(this.mode=i,this.h.checked=!0,this.permanent=!0):n&&(this.mode=matchMedia(De).matches?f:v),this.mode||(this.mode=f),this.permanent&&!i&&$.setItem(p,this.mode),this.appearance||(this.appearance=M),this._(),this.o(),this.l(),[this.g,this.u].forEach(s=>{s.addEventListener("change",()=>{this.mode=this.g.checked?f:v,this.l(),this.R(S,{colorScheme:this.mode})})}),this.v.addEventListener("change",()=>{this.mode=this.v.checked?v:f,this.o(),this.R(S,{colorScheme:this.mode})}),this.h.addEventListener("change",()=>{this.permanent=this.h.checked,this.R(G,{permanent:this.permanent})}),this.A(),this.R(S,{colorScheme:this.mode}),this.R(G,{permanent:this.permanent})}attributeChangedCallback(e,n,i){if(e===N){if(![f,v].includes(i))throw new RangeError(`Allowed values: "${f}" and "${v}".`);matchMedia("(hover:none)").matches&&this.remember&&this.S(),this.permanent&&$.setItem(p,this.mode),this.o(),this.l(),this.A()}else if(e===F){if(![M,Ee].includes(i))throw new RangeError(`Allowed values: "${M}" and "${Ee}".`);this._()}else e===q?(this.permanent?$.setItem(p,this.mode):$.removeItem(p),this.h.checked=this.permanent):e===W?this.L.textContent=i:e===D?this.C.textContent=i:e===f?(this.m.textContent=i,this.mode===f&&(this.$.textContent=i)):e===v&&(this.k.textContent=i,this.mode===v&&(this.$.textContent=i))}R(e,n){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:n}))}_(){const e=this.appearance===M;this.g.hidden=e,this.m.hidden=e,this.u.hidden=e,this.k.hidden=e,this.v.hidden=!e,this.$.hidden=!e}o(){this.mode===f?this.g.checked=!0:this.u.checked=!0}l(){this.mode===f?(this.$.style.setProperty(`--${p}-checkbox-icon`,`var(--${p}-light-icon,url("${E}moon.png"))`),this.$.textContent=this.light,this.light||(this.$.ariaLabel=v),this.v.checked=!1):(this.$.style.setProperty(`--${p}-checkbox-icon`,`var(--${p}-dark-icon,url("${E}sun.png"))`),this.$.textContent=this.dark,this.dark||(this.$.ariaLabel=f),this.v.checked=!0)}A(){this.mode===f?(this.i.forEach(e=>{e.media=ke,e.disabled=!1}),this.t.forEach(e=>{e.media=K,e.disabled=!0})):(this.t.forEach(e=>{e.media=ke,e.disabled=!1}),this.i.forEach(e=>{e.media=K,e.disabled=!0}))}S(){this.M.style.visibility="visible",setTimeout(()=>{this.M.style.visibility="hidden"},3e3)}}customElements.define(p,Fe);var nt='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M14 28c-3.31 0-6 2.69-6 6 0 2.62-2.31 4-4 4 1.84 2.44 4.99 4 8 4 4.42 0 8-3.58 8-8 0-3.31-2.69-6-6-6zM41.41 9.26l-2.67-2.67c-.78-.78-2.05-.78-2.83 0L18 24.5l5.5 5.5 17.91-17.91c.79-.79.79-2.05 0-2.83z"/></svg>',it='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M42 12H6c-2.21 0-4 1.79-4 4v16c0 2.21 1.79 4 4 4h36c2.21 0 4-1.79 4-4V16c0-2.21-1.79-4-4-4zm0 20H6V16h4v8h4v-8h4v8h4v-8h4v8h4v-8h4v8h4v-8h4v16z"/></svg>',rt='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M31.93 20.57l-5.5 7.08-3.93-4.72L17 30h22l-7.07-9.43zM6 10H2v32c0 2.21 1.79 4 4 4h32v-4H6V10zm36-8H14c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V6c0-2.21-1.79-4-4-4zm0 32H14V6h28v28z"/></svg>',st='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M6 34v4h12v-4H6zm0-24v4h20v-4H6zm20 32v-4h16v-4H26v-4h-4v12h4zM14 18v4H6v4h8v4h4V18h-4zm28 8v-4H22v4h20zm-12-8h4v-4h8v-4h-8V6h-4v12z"/></svg>',ot='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M40 12H24l-4-4H8c-2.21 0-3.98 1.79-3.98 4L4 36c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V16c0-2.21-1.79-4-4-4zm0 24H8V16h32v20z"/></svg>',at='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M34 6H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V14l-8-8zM24 38c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm6-20H10v-8h20v8z"/></svg>',ct='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M32 2H8C5.79 2 4 3.79 4 6v28h4V6h24V2zm6 8H16c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h22c2.21 0 4-1.79 4-4V14c0-2.21-1.79-4-4-4zm0 32H16V14h22v28z"/></svg>',lt='<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M38 4h-8.37c-.82-2.32-3.02-4-5.63-4s-4.81 1.68-5.63 4H10C7.79 4 6 5.79 6 8v32c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zM24 4c1.1 0 2 .89 2 2s-.9 2-2 2-2-.89-2-2 .9-2 2-2zm14 36H10V8h4v6h20V8h4v32z"/></svg>';try{self["workbox:window:6.4.1"]&&_()}catch{}function Le(t,e){return new Promise(function(n){var i=new MessageChannel;i.port1.onmessage=function(s){n(s.data)},t.postMessage(e,[i.port2])})}function qe(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function xe(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function Ne(t,e){var n;if(typeof Symbol=="undefined"||t[Symbol.iterator]==null){if(Array.isArray(t)||(n=function(s,l){if(s){if(typeof s=="string")return xe(s,l);var c=Object.prototype.toString.call(s).slice(8,-1);return c==="Object"&&s.constructor&&(c=s.constructor.name),c==="Map"||c==="Set"?Array.from(s):c==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?xe(s,l):void 0}}(t))||e&&t&&typeof t.length=="number"){n&&(t=n);var i=0;return function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}return(n=t[Symbol.iterator]()).next.bind(n)}try{self["workbox:core:6.4.1"]&&_()}catch{}var Z=function(){var t=this;this.promise=new Promise(function(e,n){t.resolve=e,t.reject=n})};function J(t,e){var n=location.href;return new URL(t,n).href===new URL(e,n).href}var P=function(t,e){this.type=t,Object.assign(this,e)};function I(t,e,n){return n?e?e(t):t:(t&&t.then||(t=Promise.resolve(t)),e?t.then(e):t)}function Ge(){}var Ke={type:"SKIP_WAITING"};function $e(t,e){if(!e)return t&&t.then?t.then(Ge):Promise.resolve()}var ht=function(t){var e,n;function i(r,o){var a,h;return o===void 0&&(o={}),(a=t.call(this)||this).nn={},a.tn=0,a.rn=new Z,a.en=new Z,a.on=new Z,a.un=0,a.an=new Set,a.cn=function(){var d=a.fn,u=d.installing;a.tn>0||!J(u.scriptURL,a.sn.toString())||performance.now()>a.un+6e4?(a.vn=u,d.removeEventListener("updatefound",a.cn)):(a.hn=u,a.an.add(u),a.rn.resolve(u)),++a.tn,u.addEventListener("statechange",a.ln)},a.ln=function(d){var u=a.fn,m=d.target,b=m.state,z=m===a.vn,B={sw:m,isExternal:z,originalEvent:d};!z&&a.mn&&(B.isUpdate=!0),a.dispatchEvent(new P(b,B)),b==="installed"?a.wn=self.setTimeout(function(){b==="installed"&&u.waiting===m&&a.dispatchEvent(new P("waiting",B))},200):b==="activating"&&(clearTimeout(a.wn),z||a.en.resolve(m))},a.dn=function(d){var u=a.hn,m=u!==navigator.serviceWorker.controller;a.dispatchEvent(new P("controlling",{isExternal:m,originalEvent:d,sw:u,isUpdate:a.mn})),m||a.on.resolve(u)},a.gn=(h=function(d){var u=d.data,m=d.ports,b=d.source;return I(a.getSW(),function(){a.an.has(b)&&a.dispatchEvent(new P("message",{data:u,originalEvent:d,ports:m,sw:b}))})},function(){for(var d=[],u=0;u<arguments.length;u++)d[u]=arguments[u];try{return Promise.resolve(h.apply(this,d))}catch(m){return Promise.reject(m)}}),a.sn=r,a.nn=o,navigator.serviceWorker.addEventListener("message",a.gn),a}n=t,(e=i).prototype=Object.create(n.prototype),e.prototype.constructor=e,e.__proto__=n;var s,l,c=i.prototype;return c.register=function(r){var o=(r===void 0?{}:r).immediate,a=o!==void 0&&o;try{var h=this;return function(d,u){var m=d();return m&&m.then?m.then(u):u(m)}(function(){if(!a&&document.readyState!=="complete")return $e(new Promise(function(d){return window.addEventListener("load",d)}))},function(){return h.mn=Boolean(navigator.serviceWorker.controller),h.yn=h.pn(),I(h.bn(),function(d){h.fn=d,h.yn&&(h.hn=h.yn,h.en.resolve(h.yn),h.on.resolve(h.yn),h.yn.addEventListener("statechange",h.ln,{once:!0}));var u=h.fn.waiting;return u&&J(u.scriptURL,h.sn.toString())&&(h.hn=u,Promise.resolve().then(function(){h.dispatchEvent(new P("waiting",{sw:u,wasWaitingBeforeRegister:!0}))}).then(function(){})),h.hn&&(h.rn.resolve(h.hn),h.an.add(h.hn)),h.fn.addEventListener("updatefound",h.cn),navigator.serviceWorker.addEventListener("controllerchange",h.dn),h.fn})})}catch(d){return Promise.reject(d)}},c.update=function(){try{return this.fn?$e(this.fn.update()):void 0}catch(r){return Promise.reject(r)}},c.getSW=function(){return this.hn!==void 0?Promise.resolve(this.hn):this.rn.promise},c.messageSW=function(r){try{return I(this.getSW(),function(o){return Le(o,r)})}catch(o){return Promise.reject(o)}},c.messageSkipWaiting=function(){this.fn&&this.fn.waiting&&Le(this.fn.waiting,Ke)},c.pn=function(){var r=navigator.serviceWorker.controller;return r&&J(r.scriptURL,this.sn.toString())?r:void 0},c.bn=function(){try{var r=this;return function(o,a){try{var h=o()}catch(d){return a(d)}return h&&h.then?h.then(void 0,a):h}(function(){return I(navigator.serviceWorker.register(r.sn,r.nn),function(o){return r.un=performance.now(),o})},function(o){throw o})}catch(o){return Promise.reject(o)}},s=i,(l=[{key:"active",get:function(){return this.en.promise}},{key:"controlling",get:function(){return this.on.promise}}])&&qe(s.prototype,l),i}(function(){function t(){this.Pn=new Map}var e=t.prototype;return e.addEventListener=function(n,i){this.Sn(n).add(i)},e.removeEventListener=function(n,i){this.Sn(n).delete(i)},e.dispatchEvent=function(n){n.target=this;for(var i,s=Ne(this.Sn(n.type));!(i=s()).done;)(0,i.value)(n)},e.Sn=function(n){return this.Pn.has(n)||this.Pn.set(n,new Set),this.Pn.get(n)},t}());export{Je as C,Ze as _,at as a,st as b,ct as c,tt as d,nt as e,it as f,Qe as g,rt as h,ot as o,lt as p,et as s,H as u,ht as v};
