import{b as n}from"./index.4fcadb15.js";import"./vendor.78f84693.js";let e=null;window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),e=t,n.style.display="flex"});n.addEventListener("click",async()=>{if(!e)return;e.prompt(),(await e.userChoice).outcome==="accepted"&&(n.style.display="none",e=null)});window.addEventListener("appinstalled",t=>{n.style.display="none",e=null});
