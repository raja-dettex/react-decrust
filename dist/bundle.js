(()=>{"use strict";function e(e,t,...n){return{type:e,props:t,children:n}}function t(e){if("string"==typeof e)return document.createTextNode(e);const n=document.createElement(e.type);if(e.props)for(const[t,r]of Object.entries(e.props))t.startsWith("on")&&"function"==typeof r?n.addEventListener(t.slice(2).toLowerCase(),r):n.setAttribute(t,r);return Array.isArray(e.children)&&e.children.forEach((e=>{n.appendChild(t(e))})),n}function n(e,r,o,i=0){if(r)if(o){if(function(e,t){if(typeof e!=typeof t)return!0;if("string"==typeof e&&"string"==typeof t)return e!==t;if("string"!=typeof e&&"string"!=typeof t){if(e.type!==t.type)return!0;const n=e.props||{},r=t.props||{},o=Object.keys(n),i=Object.keys(r);if(o.length!==i.length)return!0;for(const e of i)if(n[e]!==r[e])return!0}return!1}(r,o))e.replaceChild(t(o),e.childNodes[i]);else if("string"!=typeof o&&"string"!=typeof r){l=e.childNodes[i],c=r.props,s=o.props,new Set([...Object.keys(c||{}),...Object.keys(s||{})]).forEach((e=>{const t=null==c?void 0:c[e],n=null==s?void 0:s[e];t!==n&&(null==n?l.removeAttribute(e):l.setAttribute(e,n))}));const d=Array.isArray(r.children)?r.children:[r.children],p=Array.isArray(o.children)?o.children:[o.children],f=Math.max(d.length,p.length);for(let r=0;r<f;r++){const o=d[r]||null,i=p[r]||null;o?i?n(e.childNodes[r],o,i,r):e.removeChild(e.childNodes[r]):e.appendChild(t(i))}}}else e.removeChild(e.childNodes[i]);else e.appendChild(t(o));var l,c,s}const r={};function o(e){return 0 in r||(r[0]=e),[()=>r[0],e=>{r[0]=e,function(){const e=i();let t=c;console.log(document.body),n(document.body,t,e),t=e}()}]}function i(){let[t,n]=o(0);return console.log(t()),e("div",{id:"header"},e("h1",{},"hello this vDOM"),e("p",{},"count "+t()),e("button",{onClick:()=>{n(t()+1)}},"increment"))}const l=document.getElementById("app");let c=i();console.log("hello"),l&&l.appendChild(t(c))})();