"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6247],{7019:(A,e,t)=>{t.r(e),t.d(e,{assets:()=>i,contentTitle:()=>o,default:()=>f,frontMatter:()=>c,metadata:()=>r,toc:()=>l});const r=JSON.parse('{"id":"troubleshooting/collections-prefix","title":"Collections Prefix","description":"If you\'re facing the error Invalid payload. Collections can\'t start with \\"directus_\\".","source":"@site/docs/troubleshooting/collections-prefix.md","sourceDirName":"troubleshooting","slug":"/troubleshooting/collections-prefix","permalink":"/docs/troubleshooting/collections-prefix","draft":false,"unlisted":false,"editUrl":"https://github.com/directus-sync/directus-sync/tree/main/website/docs/troubleshooting/collections-prefix.md","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2},"sidebar":"docs","previous":{"title":"Firewall Configurations","permalink":"/docs/troubleshooting/firewall-configurations"}}');var n=t(4848),s=t(3023);const c={sidebar_position:2},o="Collections Prefix",i={},l=[];function d(A){const e={a:"a",code:"code",h1:"h1",header:"header",img:"img",p:"p",...(0,s.R)(),...A.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.header,{children:(0,n.jsx)(e.h1,{id:"collections-prefix",children:"Collections Prefix"})}),"\n",(0,n.jsxs)(e.p,{children:["If you're facing the error ",(0,n.jsx)(e.code,{children:'Invalid payload. Collections can\'t start with "directus_".'}),"\nwhen running ",(0,n.jsx)(e.code,{children:"directus-sync push"}),", as shown below:"]}),"\n",(0,n.jsx)(e.p,{children:(0,n.jsx)(e.img,{alt:"Collections prefix error",src:t(8283).A+"",width:"598",height:"209"})}),"\n",(0,n.jsxs)(e.p,{children:["This is likely due to a restriction in Directus that prevents the creation of the ",(0,n.jsx)(e.code,{children:"directus_sync_id_map"})," collection\nthat is present in the snapshot."]}),"\n",(0,n.jsxs)(e.p,{children:["This collection is essential for the operation of ",(0,n.jsx)(e.code,{children:"directus-sync"})," but should not be created during the push operation."]}),"\n",(0,n.jsxs)(e.p,{children:["This collection is created by the ",(0,n.jsx)(e.code,{children:"directus-extension-sync"})," extension, which must be installed on your Directus\ninstance."]}),"\n",(0,n.jsxs)(e.p,{children:["Therefore, to resolve this issue, ensure that you have installed\nthe ",(0,n.jsx)(e.a,{href:"https://www.npmjs.com/package/directus-extension-sync",children:"directus-extension-sync"})," on your target Directus instance."]}),"\n",(0,n.jsxs)(e.p,{children:["You can refer to the ",(0,n.jsx)(e.a,{href:"/docs/getting-started/installation",children:"installation guide"})," for more information."]})]})}function f(A={}){const{wrapper:e}={...(0,s.R)(),...A.components};return e?(0,n.jsx)(e,{...A,children:(0,n.jsx)(d,{...A})}):d(A)}},8283:(A,e,t)=>{t.d(e,{A:()=>r});const r="data:image/png;base64,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"},3023:(A,e,t)=>{t.d(e,{R:()=>c,x:()=>o});var r=t(6540);const n={},s=r.createContext(n);function c(A){const e=r.useContext(s);return r.useMemo((function(){return"function"==typeof A?A(e):{...e,...A}}),[e,A])}function o(A){let e;return e=A.disableParentContext?"function"==typeof A.components?A.components(n):A.components||n:c(A.components),r.createElement(s.Provider,{value:e},A.children)}}}]);