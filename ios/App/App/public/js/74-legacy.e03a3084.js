"use strict";(self["webpackChunkandago_client"]=self["webpackChunkandago_client"]||[]).push([[74],{4074:(e,t,n)=>{n.r(t),n.d(t,{startTapClick:()=>s});var o=n(6587);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const s=e=>{let t,n,s,v=10*-u,f=0;const p=e.getBoolean("animated",!0)&&e.getBoolean("rippleEffect",!0),h=new WeakMap,m=e=>{v=(0,o.u)(e),b(e)},L=e=>{v=(0,o.u)(e),k(e)},w=e=>{if(2===e.button)return;const t=(0,o.u)(e)-u;v<t&&b(e)},E=e=>{const t=(0,o.u)(e)-u;v<t&&k(e)},g=()=>{s&&clearTimeout(s),s=void 0,t&&(y(!1),t=void 0)},b=e=>{t||T(i(e),e)},k=e=>{T(void 0,e)},T=(e,n)=>{if(e&&e===t)return;s&&clearTimeout(s),s=void 0;const{x:i,y:c}=(0,o.p)(n);if(t){if(h.has(t))throw new Error("internal error");t.classList.contains(r)||C(t,i,c),y(!0)}if(e){const t=h.get(e);t&&(clearTimeout(t),h.delete(e)),e.classList.remove(r);const n=()=>{C(e,i,c),s=void 0};a(e)?n():s=setTimeout(n,d)}t=e},C=(e,t,o)=>{if(f=Date.now(),e.classList.add(r),!p)return;const s=c(e);null!==s&&(R(),n=s.addRipple(t,o))},R=()=>{void 0!==n&&(n.then((e=>e())),n=void 0)},y=e=>{R();const n=t;if(!n)return;const o=l-Date.now()+f;if(e&&o>0&&!a(n)){const e=setTimeout((()=>{n.classList.remove(r),h.delete(n)}),l);h.set(n,e)}else n.classList.remove(r)},S=document;S.addEventListener("ionGestureCaptured",g),S.addEventListener("touchstart",m,!0),S.addEventListener("touchcancel",L,!0),S.addEventListener("touchend",L,!0),S.addEventListener("pointercancel",g,!0),S.addEventListener("mousedown",w,!0),S.addEventListener("mouseup",E,!0)},i=e=>{if(void 0===e.composedPath)return e.target.closest(".ion-activatable");{const t=e.composedPath();for(let e=0;e<t.length-2;e++){const n=t[e];if(!(n instanceof ShadowRoot)&&n.classList.contains("ion-activatable"))return n}}},a=e=>e.classList.contains("ion-activatable-instant"),c=e=>{if(e.shadowRoot){const t=e.shadowRoot.querySelector("ion-ripple-effect");if(t)return t}return e.querySelector("ion-ripple-effect")},r="ion-activated",d=200,l=200,u=2500}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGNBQWU3QyxHQUFZLEdBQ2hEMkMsRUFBSUUsaUJBQWlCLFdBQVk3QyxHQUFZLEdBYTdDMkMsRUFBSUUsaUJBQWlCLGdCQUFpQnZDLEdBQWMsR0FDcERxQyxFQUFJRSxpQkFBaUIsWUFBYTNDLEdBQWEsR0FDL0N5QyxFQUFJRSxpQkFBaUIsVUFBV3hDLEdBQVcsRUFBSyxFQUc1Q00sRUFBd0JiLElBQzVCLFFBQXdCVSxJQUFwQlYsRUFBR2dELGFBa0JMLE9BQU9oRCxFQUFHaUQsT0FBT0MsUUFBUSxvQkFsQlEsQ0FTakMsTUFBTUMsRUFBT25ELEVBQUdnRCxlQUNoQixJQUFLLElBQUlJLEVBQUksRUFBR0EsRUFBSUQsRUFBS0UsT0FBUyxFQUFHRCxJQUFLLENBQ3hDLE1BQU10QyxFQUFLcUMsRUFBS0MsR0FDaEIsS0FBTXRDLGFBQWN3QyxhQUFleEMsRUFBR00sVUFBVUMsU0FBUyxtQkFDdkQsT0FBT1AsQ0FFWCxDQUNGLENBR0EsRUFFSWUsRUFBYWYsR0FDVkEsRUFBR00sVUFBVUMsU0FBUywyQkFFekJlLEVBQW1CdEIsSUFDdkIsR0FBSUEsRUFBR3lDLFdBQVksQ0FDakIsTUFBTUMsRUFBUzFDLEVBQUd5QyxXQUFXRSxjQUFjLHFCQUMzQyxHQUFJRCxFQUNGLE9BQU9BLENBRVgsQ0FDQSxPQUFPMUMsRUFBRzJDLGNBQWMsb0JBQW9CLEVBRXhDbkMsRUFBWSxnQkFDWlMsRUFBdUIsSUFDdkJZLEVBQXFCLElBQ3JCbEQsRUFBYSxJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYW5kYWdvLWNsaWVudC8uL25vZGVfbW9kdWxlcy9AaW9uaWMvY29yZS9jb21wb25lbnRzL2luZGV4OS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIChDKSBJb25pYyBodHRwOi8vaW9uaWNmcmFtZXdvcmsuY29tIC0gTUlUIExpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgdSBhcyBub3csIHAgYXMgcG9pbnRlckNvb3JkIH0gZnJvbSAnLi9oZWxwZXJzLmpzJztcblxuY29uc3Qgc3RhcnRUYXBDbGljayA9IChjb25maWcpID0+IHtcbiAgbGV0IGxhc3RUb3VjaCA9IC1NT1VTRV9XQUlUICogMTA7XG4gIGxldCBsYXN0QWN0aXZhdGVkID0gMDtcbiAgbGV0IGFjdGl2YXRhYmxlRWxlO1xuICBsZXQgYWN0aXZlUmlwcGxlO1xuICBsZXQgYWN0aXZlRGVmZXI7XG4gIGNvbnN0IHVzZVJpcHBsZUVmZmVjdCA9IGNvbmZpZy5nZXRCb29sZWFuKCdhbmltYXRlZCcsIHRydWUpICYmIGNvbmZpZy5nZXRCb29sZWFuKCdyaXBwbGVFZmZlY3QnLCB0cnVlKTtcbiAgY29uc3QgY2xlYXJEZWZlcnMgPSBuZXcgV2Vha01hcCgpO1xuICAvLyBUb3VjaCBFdmVudHNcbiAgY29uc3Qgb25Ub3VjaFN0YXJ0ID0gKGV2KSA9PiB7XG4gICAgbGFzdFRvdWNoID0gbm93KGV2KTtcbiAgICBwb2ludGVyRG93bihldik7XG4gIH07XG4gIGNvbnN0IG9uVG91Y2hFbmQgPSAoZXYpID0+IHtcbiAgICBsYXN0VG91Y2ggPSBub3coZXYpO1xuICAgIHBvaW50ZXJVcChldik7XG4gIH07XG4gIGNvbnN0IG9uTW91c2VEb3duID0gKGV2KSA9PiB7XG4gICAgLy8gSWdub3JlIHJpZ2h0IGNsaWNrc1xuICAgIGlmIChldi5idXR0b24gPT09IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdCA9IG5vdyhldikgLSBNT1VTRV9XQUlUO1xuICAgIGlmIChsYXN0VG91Y2ggPCB0KSB7XG4gICAgICBwb2ludGVyRG93bihldik7XG4gICAgfVxuICB9O1xuICBjb25zdCBvbk1vdXNlVXAgPSAoZXYpID0+IHtcbiAgICBjb25zdCB0ID0gbm93KGV2KSAtIE1PVVNFX1dBSVQ7XG4gICAgaWYgKGxhc3RUb3VjaCA8IHQpIHtcbiAgICAgIHBvaW50ZXJVcChldik7XG4gICAgfVxuICB9O1xuICBjb25zdCBjYW5jZWxBY3RpdmUgPSAoKSA9PiB7XG4gICAgaWYgKGFjdGl2ZURlZmVyKVxuICAgICAgY2xlYXJUaW1lb3V0KGFjdGl2ZURlZmVyKTtcbiAgICBhY3RpdmVEZWZlciA9IHVuZGVmaW5lZDtcbiAgICBpZiAoYWN0aXZhdGFibGVFbGUpIHtcbiAgICAgIHJlbW92ZUFjdGl2YXRlZChmYWxzZSk7XG4gICAgICBhY3RpdmF0YWJsZUVsZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IHBvaW50ZXJEb3duID0gKGV2KSA9PiB7XG4gICAgaWYgKGFjdGl2YXRhYmxlRWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNldEFjdGl2YXRlZEVsZW1lbnQoZ2V0QWN0aXZhdGFibGVUYXJnZXQoZXYpLCBldik7XG4gIH07XG4gIGNvbnN0IHBvaW50ZXJVcCA9IChldikgPT4ge1xuICAgIHNldEFjdGl2YXRlZEVsZW1lbnQodW5kZWZpbmVkLCBldik7XG4gIH07XG4gIGNvbnN0IHNldEFjdGl2YXRlZEVsZW1lbnQgPSAoZWwsIGV2KSA9PiB7XG4gICAgLy8gZG8gbm90aGluZ1xuICAgIGlmIChlbCAmJiBlbCA9PT0gYWN0aXZhdGFibGVFbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGFjdGl2ZURlZmVyKVxuICAgICAgY2xlYXJUaW1lb3V0KGFjdGl2ZURlZmVyKTtcbiAgICBhY3RpdmVEZWZlciA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCB7IHgsIHkgfSA9IHBvaW50ZXJDb29yZChldik7XG4gICAgLy8gZGVhY3RpdmF0ZSBzZWxlY3RlZFxuICAgIGlmIChhY3RpdmF0YWJsZUVsZSkge1xuICAgICAgaWYgKGNsZWFyRGVmZXJzLmhhcyhhY3RpdmF0YWJsZUVsZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnRlcm5hbCBlcnJvcicpO1xuICAgICAgfVxuICAgICAgaWYgKCFhY3RpdmF0YWJsZUVsZS5jbGFzc0xpc3QuY29udGFpbnMoQUNUSVZBVEVEKSkge1xuICAgICAgICBhZGRBY3RpdmF0ZWQoYWN0aXZhdGFibGVFbGUsIHgsIHkpO1xuICAgICAgfVxuICAgICAgcmVtb3ZlQWN0aXZhdGVkKHRydWUpO1xuICAgIH1cbiAgICAvLyBhY3RpdmF0ZVxuICAgIGlmIChlbCkge1xuICAgICAgY29uc3QgZGVmZXJJZCA9IGNsZWFyRGVmZXJzLmdldChlbCk7XG4gICAgICBpZiAoZGVmZXJJZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoZGVmZXJJZCk7XG4gICAgICAgIGNsZWFyRGVmZXJzLmRlbGV0ZShlbCk7XG4gICAgICB9XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKEFDVElWQVRFRCk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgYWRkQWN0aXZhdGVkKGVsLCB4LCB5KTtcbiAgICAgICAgYWN0aXZlRGVmZXIgPSB1bmRlZmluZWQ7XG4gICAgICB9O1xuICAgICAgaWYgKGlzSW5zdGFudChlbCkpIHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBhY3RpdmVEZWZlciA9IHNldFRpbWVvdXQoY2FsbGJhY2ssIEFERF9BQ1RJVkFURURfREVGRVJTKTtcbiAgICAgIH1cbiAgICB9XG4gICAgYWN0aXZhdGFibGVFbGUgPSBlbDtcbiAgfTtcbiAgY29uc3QgYWRkQWN0aXZhdGVkID0gKGVsLCB4LCB5KSA9PiB7XG4gICAgbGFzdEFjdGl2YXRlZCA9IERhdGUubm93KCk7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChBQ1RJVkFURUQpO1xuICAgIGlmICghdXNlUmlwcGxlRWZmZWN0KVxuICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IHJpcHBsZUVmZmVjdCA9IGdldFJpcHBsZUVmZmVjdChlbCk7XG4gICAgaWYgKHJpcHBsZUVmZmVjdCAhPT0gbnVsbCkge1xuICAgICAgcmVtb3ZlUmlwcGxlKCk7XG4gICAgICBhY3RpdmVSaXBwbGUgPSByaXBwbGVFZmZlY3QuYWRkUmlwcGxlKHgsIHkpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgcmVtb3ZlUmlwcGxlID0gKCkgPT4ge1xuICAgIGlmIChhY3RpdmVSaXBwbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYWN0aXZlUmlwcGxlLnRoZW4oKHJlbW92ZSkgPT4gcmVtb3ZlKCkpO1xuICAgICAgYWN0aXZlUmlwcGxlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgcmVtb3ZlQWN0aXZhdGVkID0gKHNtb290aCkgPT4ge1xuICAgIHJlbW92ZVJpcHBsZSgpO1xuICAgIGNvbnN0IGFjdGl2ZSA9IGFjdGl2YXRhYmxlRWxlO1xuICAgIGlmICghYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRpbWUgPSBDTEVBUl9TVEFURV9ERUZFUlMgLSBEYXRlLm5vdygpICsgbGFzdEFjdGl2YXRlZDtcbiAgICBpZiAoc21vb3RoICYmIHRpbWUgPiAwICYmICFpc0luc3RhbnQoYWN0aXZlKSkge1xuICAgICAgY29uc3QgZGVmZXJJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhY3RpdmUuY2xhc3NMaXN0LnJlbW92ZShBQ1RJVkFURUQpO1xuICAgICAgICBjbGVhckRlZmVycy5kZWxldGUoYWN0aXZlKTtcbiAgICAgIH0sIENMRUFSX1NUQVRFX0RFRkVSUyk7XG4gICAgICBjbGVhckRlZmVycy5zZXQoYWN0aXZlLCBkZWZlcklkKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBhY3RpdmUuY2xhc3NMaXN0LnJlbW92ZShBQ1RJVkFURUQpO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgZG9jID0gZG9jdW1lbnQ7XG4gIGRvYy5hZGRFdmVudExpc3RlbmVyKCdpb25HZXN0dXJlQ2FwdHVyZWQnLCBjYW5jZWxBY3RpdmUpO1xuICBkb2MuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCwgdHJ1ZSk7XG4gIGRvYy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIG9uVG91Y2hFbmQsIHRydWUpO1xuICBkb2MuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kLCB0cnVlKTtcbiAgLyoqXG4gICAqIFRhcCBjbGljayBlZmZlY3RzIHN1Y2ggYXMgdGhlIHJpcHBsZSBlZmZlY3Qgc2hvdWxkXG4gICAqIG5vdCBoYXBwZW4gd2hlbiBzY3JvbGxpbmcuIEZvciBleGFtcGxlLCBpZiBhIHVzZXIgc2Nyb2xsc1xuICAgKiB0aGUgcGFnZSBidXQgYWxzbyBoYXBwZW5zIHRvIGRvIGEgdG91Y2hzdGFydCBvbiBhIGJ1dHRvblxuICAgKiBhcyBwYXJ0IG9mIHRoZSBzY3JvbGwsIHRoZSByaXBwbGUgZWZmZWN0IHNob3VsZCBub3RcbiAgICogYmUgZGlzcGF0Y2hlZC4gVGhlIHJpcHBsZSBlZmZlY3Qgc2hvdWxkIG9ubHkgaGFwcGVuXG4gICAqIGlmIHRoZSBidXR0b24gaXMgYWN0aXZhdGVkIGFuZCB0aGUgcGFnZSBpcyBub3Qgc2Nyb2xsaW5nLlxuICAgKlxuICAgKiBwb2ludGVyY2FuY2VsIGlzIGRpc3BhdGNoZWQgb24gYSBnZXN0dXJlIHdoZW4gc2Nyb2xsaW5nXG4gICAqIHN0YXJ0cywgc28gdGhpcyBsZXRzIHVzIGF2b2lkIGhhdmluZyB0byBsaXN0ZW4gZm9yXG4gICAqIGlvbi1jb250ZW50J3Mgc2Nyb2xsIGV2ZW50cy5cbiAgICovXG4gIGRvYy5hZGRFdmVudExpc3RlbmVyKCdwb2ludGVyY2FuY2VsJywgY2FuY2VsQWN0aXZlLCB0cnVlKTtcbiAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCB0cnVlKTtcbiAgZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBvbk1vdXNlVXAsIHRydWUpO1xufTtcbi8vIFRPRE8oRlctMjgzMik6IHR5cGVcbmNvbnN0IGdldEFjdGl2YXRhYmxlVGFyZ2V0ID0gKGV2KSA9PiB7XG4gIGlmIChldi5jb21wb3NlZFBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgIC8qKlxuICAgICAqIGNvbXBvc2VkUGF0aCByZXR1cm5zIEV2ZW50VGFyZ2V0W10uIEhvd2V2ZXIsXG4gICAgICogb2JqZWN0cyBvdGhlciB0aGFuIEVsZW1lbnQgY2FuIGJlIHRhcmdldHMgdG9vLlxuICAgICAqIEZvciBleGFtcGxlLCBBdWRpb0NvbnRleHQgY2FuIGJlIGEgdGFyZ2V0LiBJbiB0aGlzXG4gICAgICogY2FzZSwgd2Uga25vdyB0aGF0IHRoZSBldmVudCBpcyBhIFVJRXZlbnQgc28gd2VcbiAgICAgKiBjYW4gYXNzdW1lIHRoYXQgdGhlIHBhdGggd2lsbCBjb250YWluIGVpdGhlciBFbGVtZW50XG4gICAgICogb3IgU2hhZG93Um9vdC5cbiAgICAgKi9cbiAgICBjb25zdCBwYXRoID0gZXYuY29tcG9zZWRQYXRoKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aCAtIDI7IGkrKykge1xuICAgICAgY29uc3QgZWwgPSBwYXRoW2ldO1xuICAgICAgaWYgKCEoZWwgaW5zdGFuY2VvZiBTaGFkb3dSb290KSAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMoJ2lvbi1hY3RpdmF0YWJsZScpKSB7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIGV2LnRhcmdldC5jbG9zZXN0KCcuaW9uLWFjdGl2YXRhYmxlJyk7XG4gIH1cbn07XG5jb25zdCBpc0luc3RhbnQgPSAoZWwpID0+IHtcbiAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucygnaW9uLWFjdGl2YXRhYmxlLWluc3RhbnQnKTtcbn07XG5jb25zdCBnZXRSaXBwbGVFZmZlY3QgPSAoZWwpID0+IHtcbiAgaWYgKGVsLnNoYWRvd1Jvb3QpIHtcbiAgICBjb25zdCByaXBwbGUgPSBlbC5zaGFkb3dSb290LnF1ZXJ5U2VsZWN0b3IoJ2lvbi1yaXBwbGUtZWZmZWN0Jyk7XG4gICAgaWYgKHJpcHBsZSkge1xuICAgICAgcmV0dXJuIHJpcHBsZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVsLnF1ZXJ5U2VsZWN0b3IoJ2lvbi1yaXBwbGUtZWZmZWN0Jyk7XG59O1xuY29uc3QgQUNUSVZBVEVEID0gJ2lvbi1hY3RpdmF0ZWQnO1xuY29uc3QgQUREX0FDVElWQVRFRF9ERUZFUlMgPSAyMDA7XG5jb25zdCBDTEVBUl9TVEFURV9ERUZFUlMgPSAyMDA7XG5jb25zdCBNT1VTRV9XQUlUID0gMjUwMDtcblxuZXhwb3J0IHsgc3RhcnRUYXBDbGljayB9O1xuIl0sIm5hbWVzIjpbInN0YXJ0VGFwQ2xpY2siLCJjb25maWciLCJhY3RpdmF0YWJsZUVsZSIsImFjdGl2ZVJpcHBsZSIsImFjdGl2ZURlZmVyIiwibGFzdFRvdWNoIiwiTU9VU0VfV0FJVCIsImxhc3RBY3RpdmF0ZWQiLCJ1c2VSaXBwbGVFZmZlY3QiLCJnZXRCb29sZWFuIiwiY2xlYXJEZWZlcnMiLCJXZWFrTWFwIiwib25Ub3VjaFN0YXJ0IiwiZXYiLCJwb2ludGVyRG93biIsIm9uVG91Y2hFbmQiLCJwb2ludGVyVXAiLCJvbk1vdXNlRG93biIsImJ1dHRvbiIsInQiLCJvbk1vdXNlVXAiLCJjYW5jZWxBY3RpdmUiLCJjbGVhclRpbWVvdXQiLCJ1bmRlZmluZWQiLCJyZW1vdmVBY3RpdmF0ZWQiLCJzZXRBY3RpdmF0ZWRFbGVtZW50IiwiZ2V0QWN0aXZhdGFibGVUYXJnZXQiLCJlbCIsIngiLCJ5IiwicCIsImhhcyIsIkVycm9yIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJBQ1RJVkFURUQiLCJhZGRBY3RpdmF0ZWQiLCJkZWZlcklkIiwiZ2V0IiwiZGVsZXRlIiwicmVtb3ZlIiwiY2FsbGJhY2siLCJpc0luc3RhbnQiLCJzZXRUaW1lb3V0IiwiQUREX0FDVElWQVRFRF9ERUZFUlMiLCJEYXRlIiwibm93IiwiYWRkIiwicmlwcGxlRWZmZWN0IiwiZ2V0UmlwcGxlRWZmZWN0IiwicmVtb3ZlUmlwcGxlIiwiYWRkUmlwcGxlIiwidGhlbiIsInNtb290aCIsImFjdGl2ZSIsInRpbWUiLCJDTEVBUl9TVEFURV9ERUZFUlMiLCJzZXQiLCJkb2MiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb21wb3NlZFBhdGgiLCJ0YXJnZXQiLCJjbG9zZXN0IiwicGF0aCIsImkiLCJsZW5ndGgiLCJTaGFkb3dSb290Iiwic2hhZG93Um9vdCIsInJpcHBsZSIsInF1ZXJ5U2VsZWN0b3IiXSwic291cmNlUm9vdCI6IiJ9