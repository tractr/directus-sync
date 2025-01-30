"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7924],{1806:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>c,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"getting-started/installation","title":"Installation","description":"The directus-extension-sync is an essential extension required for using the directus-sync CLI. It manages the mapping between synchronization identifiers (SyncIDs) and Directus\'s internal entity IDs.","source":"@site/docs/getting-started/installation.md","sourceDirName":"getting-started","slug":"/getting-started/installation","permalink":"/directus-sync/docs/getting-started/installation","draft":false,"unlisted":false,"editUrl":"https://github.com/directus-sync/directus-sync/tree/main/website/docs/getting-started/installation.md","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"docs","previous":{"title":"Introduction","permalink":"/directus-sync/docs/intro"},"next":{"title":"Quick Start Guide","permalink":"/directus-sync/docs/getting-started/usage"}}');var i=t(4848),r=t(3023);const o={sidebar_position:1},c="Installation",a={},d=[{value:"Option 1: NPM Installation",id:"option-1-npm-installation",level:2},{value:"Option 2: Pre-built Docker Image",id:"option-2-pre-built-docker-image",level:2},{value:"Option 3: Custom Docker Image",id:"option-3-custom-docker-image",level:2},{value:"Option 4: Directus Marketplace",id:"option-4-directus-marketplace",level:2}];function l(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"installation",children:"Installation"})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"directus-extension-sync"})," is an essential extension required for using the ",(0,i.jsx)(n.code,{children:"directus-sync"})," CLI. It manages the mapping between synchronization identifiers (SyncIDs) and Directus's internal entity IDs."]}),"\n",(0,i.jsx)(n.p,{children:"There are four different ways to install the extension. Choose the one that best fits your setup:"}),"\n",(0,i.jsx)(n.h2,{id:"option-1-npm-installation",children:"Option 1: NPM Installation"}),"\n",(0,i.jsx)(n.p,{children:"In your Directus installation root, run:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm install directus-extension-sync\n"})}),"\n",(0,i.jsx)(n.p,{children:"Then, restart Directus."}),"\n",(0,i.jsx)(n.h2,{id:"option-2-pre-built-docker-image",children:"Option 2: Pre-built Docker Image"}),"\n",(0,i.jsx)(n.p,{children:"You can use the pre-built Docker image with this extension pre-installed."}),"\n",(0,i.jsxs)(n.p,{children:["This image is available on Docker Hub: ",(0,i.jsx)(n.a,{href:"https://hub.docker.com/r/tractr/directus-sync",children:"tractr/directus-sync"}),"."]}),"\n",(0,i.jsx)(n.p,{children:"Example of a Docker Compose stack using Postgres:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yml",children:"# file: docker-compose.yml\nservices:\n  directus:\n    image: tractr/directus-sync:latest\n    restart: unless-stopped\n    ports:\n      - '8055:8055'\n    environment:\n      KEY: 'XXXXXXXX'\n      SECRET: 'XXXXXXXX'\n      ADMIN_EMAIL: 'admin@example.com'\n      ADMIN_PASSWORD: 'password'\n      DB_CLIENT: 'pg'\n      DB_HOST: 'postgres'\n      DB_PORT: '5432'\n      DB_DATABASE: 'directus'\n      DB_USER: 'directus'\n      DB_PASSWORD: 'password'\n    depends_on:\n      - postgres\n\n  postgres:\n    image: postgis/postgis:15-3.5-alpine\n    restart: unless-stopped\n    ports:\n      - '5432:5432'\n    volumes:\n      - postgres-data:/var/lib/postgresql/data\n    environment:\n      POSTGRES_PASSWORD: 'password'\n      POSTGRES_USER: 'directus'\n      POSTGRES_DB: 'directus'\n\nvolumes:\n  postgres-data:\n    driver: local\n"})}),"\n",(0,i.jsx)(n.h2,{id:"option-3-custom-docker-image",children:"Option 3: Custom Docker Image"}),"\n",(0,i.jsx)(n.p,{children:"To build your own Docker image with the extension, follow these steps:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["Create a file ",(0,i.jsx)(n.code,{children:"extensions/package.json"})," and declare the extensions:"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "name": "directus-extensions",\n  "dependencies": {\n    "directus-extension-sync": "^3.0.2"\n  }\n}\n'})}),"\n",(0,i.jsxs)(n.p,{children:["You may add other extensions to the ",(0,i.jsx)(n.code,{children:"extensions/package.json"})," file, depending on your use case."]}),"\n",(0,i.jsxs)(n.ol,{start:"2",children:["\n",(0,i.jsxs)(n.li,{children:["Create a ",(0,i.jsx)(n.code,{children:"Dockerfile"})," to extend the Directus Docker image:"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-Dockerfile",children:'FROM node:20-alpine as third-party-ext\nRUN apk add python3 g++ make\nWORKDIR /extensions\nADD extensions .\nRUN npm install\n# Move all extensions the starts with directus-extension-, using find, to the /extensions/directus folder\nRUN mkdir -p ./directus\nRUN cd node_modules && find . -maxdepth 1 -type d -name "directus-extension-*" -exec mv {} ../directus \\;\n\nFROM directus/directus:11.4.0\n# Copy third party extensions\nCOPY --from=third-party-ext /extensions/directus ./extensions\n'})}),"\n",(0,i.jsxs)(n.ol,{start:"3",children:["\n",(0,i.jsxs)(n.li,{children:["In your ",(0,i.jsx)(n.code,{children:"docker-compose.yml"}),", use this custom image:"]}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yml",children:"directus:\n  build:\n    context: .\n    dockerfile: Dockerfile\n"})}),"\n",(0,i.jsxs)(n.p,{children:["You may need to flush the ",(0,i.jsx)(n.code,{children:"directus-extensions"})," table and restart Directus to force it to detect new extensions."]}),"\n",(0,i.jsxs)(n.p,{children:["For more details and discussion about this approach, see ",(0,i.jsx)(n.a,{href:"https://github.com/tractr/directus-sync/issues/63#issuecomment-2096657924",children:"this GitHub issue"}),"."]}),"\n",(0,i.jsx)(n.admonition,{type:"tip",children:(0,i.jsxs)(n.p,{children:["Make sure to use the latest versions of both Directus and the extension. You can check the latest versions on ",(0,i.jsx)(n.a,{href:"https://www.npmjs.com/package/directus-extension-sync",children:"NPM"})," and ",(0,i.jsx)(n.a,{href:"https://hub.docker.com/r/directus/directus",children:"Docker Hub"}),"."]})}),"\n",(0,i.jsx)(n.h2,{id:"option-4-directus-marketplace",children:"Option 4: Directus Marketplace"}),"\n",(0,i.jsx)(n.p,{children:"Unfortunately, the extension is not available in the Directus Marketplace out of the box. Directus Marketplace does not support extensions that require a database connection."}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"However"}),", you can force Directus Marketplace to show all extensions by setting the ",(0,i.jsx)(n.code,{children:"MARKETPLACE_TRUST"})," environment variable to ",(0,i.jsx)(n.code,{children:"all"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"MARKETPLACE_TRUST=all\n"})}),"\n",(0,i.jsxs)(n.p,{children:["Then, go to the Directus Marketplace and search for the ",(0,i.jsx)(n.code,{children:"directus-extension-sync"})," extension."]})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},3023:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>c});var s=t(6540);const i={},r=s.createContext(i);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);