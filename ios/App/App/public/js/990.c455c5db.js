"use strict";(self["webpackChunkandago_client"]=self["webpackChunkandago_client"]||[]).push([[990],{8990:(e,t,n)=>{n.r(t),n.d(t,{createSwipeBackGesture:()=>i});var r=n(6587),a=n(545),c=n(6515);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const i=(e,t,n,i,o)=>{const s=e.ownerDocument.defaultView;let l=(0,a.i)(e);const u=e=>{const t=50,{startX:n}=e;return l?n>=s.innerWidth-t:n<=t},d=e=>l?-e.deltaX:e.deltaX,h=e=>l?-e.velocityX:e.velocityX,k=n=>(l=(0,a.i)(e),u(n)&&t()),w=e=>{const t=d(e),n=t/s.innerWidth;i(n)},g=e=>{const t=d(e),n=s.innerWidth,a=t/n,c=h(e),i=n/2,l=c>=0&&(c>.2||t>i),u=l?1-a:a,k=u*n;let w=0;if(k>5){const e=k/Math.abs(c);w=Math.min(e,540)}o(l,a<=0?.01:(0,r.h)(0,a,.9999),w)};return(0,c.createGesture)({el:e,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:k,onStart:n,onMove:w,onEnd:g})}}}]);
//# sourceMappingURL=990.c455c5db.js.map