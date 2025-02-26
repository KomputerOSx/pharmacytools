(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[221],{6933:(e,l,a)=>{Promise.resolve().then(a.bind(a,2263))},2263:(e,l,a)=>{"use strict";a.r(l),a.d(l,{default:()=>t});var s=a(5155),c=a(2115);a(1636);let r=function(e){let{onSelect:l}=e,[a,r]=(0,c.useState)("Male"),n=e=>{r(e),l(e)};return(0,s.jsxs)("div",{className:"buttons has-addons",children:[(0,s.jsx)("button",{className:"button ".concat("Male"===a?"is-link is-selected":""),onClick:()=>n("Male"),children:"Male"}),(0,s.jsx)("button",{className:"button ".concat("Female"===a?"is-danger is-selected":""),onClick:()=>n("Female"),children:"Female"})]})};a(6414);let n=e=>{let{crcl:l,title:a="Creatinine Clearance",subtitle:c="mL/min"}=e,r=(e=>e>=90?"crcl-normal":e>=60?"crcl-mild":e>=30?"crcl-moderate":e>=15?"crcl-severe":"crcl-failure")(l),n=(e=>e>=90?"Normal":e>=60?"Mild Decrease":e>=30?"Moderate Decrease":e>=15?"Severe Decrease":"Kidney Failure")(l);return(0,s.jsx)("div",{className:"crcl-display-container",children:(0,s.jsxs)("div",{className:"crcl-card ".concat(r),children:[(0,s.jsx)("div",{className:"crcl-header",children:(0,s.jsx)("h3",{className:"crcl-title",children:a})}),(0,s.jsxs)("div",{className:"crcl-body",children:[(0,s.jsxs)("div",{className:"crcl-value-container",children:[(0,s.jsxs)("span",{className:"crcl-value",children:[l>=120?">":"",null!==l?l.toFixed(1):"N/A"]}),(0,s.jsx)("span",{className:"crcl-unit",children:c})]}),(0,s.jsx)("div",{className:"crcl-gauge",children:(0,s.jsx)("div",{className:"crcl-gauge-fill",style:{width:"".concat(Math.min(100,l/120*100),"%")}})}),(0,s.jsxs)("div",{className:"crcl-function",children:[(0,s.jsx)("span",{className:"crcl-function-label",children:"Kidney Function:"}),(0,s.jsx)("span",{className:"crcl-function-value",children:n})]})]})]})})},t=function(){let[e,l]=(0,c.useState)("Male"),[a,t]=(0,c.useState)(null),[i,u]=(0,c.useState)(null),[d,m]=(0,c.useState)(null),[h,o]=(0,c.useState)(null),[N,x]=(0,c.useState)({actualCrCl:null,ibwCrCl:null,abwCrCl:null}),j={ibwBase:50,crclBase:1.23},C={ibwBase:45.5,crclBase:1.04},b=(e,l)=>"male"===l.toLowerCase()?j.ibwBase+2.3*(e/2.54-60):C.ibwBase+2.3*(e/2.54-60),v=(e,l,a)=>{let s=b(l,a);return e<s?e:s+.4*(e-s)},g=(e,l,a,s)=>{let c=(140-l)*e*("male"===a.toLowerCase()?j.crclBase:C.crclBase)/s;return c>=120?120:c};return(0,s.jsx)(s.Fragment,{children:(0,s.jsxs)("div",{className:"container",style:{paddingLeft:"20px",paddingRight:"20px"},children:[(0,s.jsx)("div",{className:"block",children:(0,s.jsx)("h1",{className:"title is-1",children:"CrCl Calculator"})}),(0,s.jsx)(r,{onSelect:e=>{l(e)}}),(0,s.jsxs)("div",{className:"inputs-container",children:[(0,s.jsxs)("div",{className:"field",children:[(0,s.jsx)("label",{className:"label",children:"Age"}),(0,s.jsx)("div",{className:"control",children:(0,s.jsx)("input",{className:"input",type:"number",min:18,placeholder:"Enter Age",value:a||"",onChange:e=>t(e.target.value?Number(e.target.value):null)})})]}),(0,s.jsxs)("div",{className:"field",children:[(0,s.jsx)("label",{className:"label",children:"Weight (kg)"}),(0,s.jsx)("div",{className:"control",children:(0,s.jsx)("input",{className:"input",type:"number",min:30,placeholder:"Enter Weight",value:i||"",onChange:e=>u(e.target.value?Number(e.target.value):null)})})]}),(0,s.jsxs)("div",{className:"field",children:[(0,s.jsx)("label",{className:"label",children:"Height (cm)"}),(0,s.jsx)("div",{className:"control",children:(0,s.jsx)("input",{className:"input",type:"number",min:120,placeholder:"Enter Height",value:d||"",onChange:e=>m(e.target.value?Number(e.target.value):null)})})]}),(0,s.jsxs)("div",{className:"field",children:[(0,s.jsx)("label",{className:"label",children:"Serum Creatinine (μmol/L)"}),(0,s.jsx)("div",{className:"control",children:(0,s.jsx)("input",{className:"input",type:"number",min:20,step:"1",placeholder:"Enter Serum Creatinine",value:h||"",onChange:e=>o(e.target.value?Number(e.target.value):null)})})]})]}),(0,s.jsxs)("div",{className:"action-buttons-container",children:[(0,s.jsx)("button",{className:"button is-secondary is-light",onClick:()=>{t(null),u(null),m(null),o(null),x({actualCrCl:null,ibwCrCl:null,abwCrCl:null})},children:"Clear"}),(0,s.jsx)("button",{className:"button is-primary",onClick:()=>{if(a&&i&&d&&h){let l,s;let c=b(d,e),r=v(i,d,e),n=g(i,a,e,h),t=null,u=null;d<152?(l="Not calculated: Height is less than 154cm",s="Not calculated: Height is less than 154cm"):i<c?(l="Not calculated: Actual weight is less than IBW",s="Not calculated: Actual weight is less than IBW"):(t=g(c,a,e,h),u=g(r,a,e,h)),x({actualCrCl:n,ibwCrCl:t,abwCrCl:u,ibwError:l,abwError:s})}},disabled:!a||!i||!d||!h,children:"Calculate"})]}),(0,s.jsxs)("div",{className:"section",children:[null!==N.actualCrCl&&(0,s.jsx)("h2",{className:"title is-3",children:"Results"}),(0,s.jsxs)("div",{className:"crcl-results-container",children:[null!==N.actualCrCl&&(0,s.jsx)("div",{className:"crcl-results-item",children:(0,s.jsx)(n,{crcl:N.actualCrCl,title:"Actual Weight CrCl"})}),null!==N.ibwCrCl&&(0,s.jsxs)("div",{className:"crcl-results-item",children:[(0,s.jsx)(n,{crcl:N.ibwCrCl,title:"Ideal Body Weight CrCl"}),N.ibwError&&(0,s.jsx)("div",{className:"error-message",children:N.ibwError})]}),null!==N.abwCrCl&&(0,s.jsxs)("div",{className:"crcl-results-item",children:[(0,s.jsx)(n,{crcl:N.abwCrCl,title:"Adjusted Body Weight CrCl"}),N.abwError&&(0,s.jsx)("div",{className:"error-message",children:N.abwError})]})]})]})]})})}},1636:()=>{},6414:()=>{}},e=>{var l=l=>e(e.s=l);e.O(0,[123,441,517,358],()=>l(6933)),_N_E=e.O()}]);