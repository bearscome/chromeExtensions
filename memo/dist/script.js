const s=(()=>{let e="",t=[];function d(o){chrome.tabs.query({active:!0,currentWindow:!0},function(n){const i=new URL(n[0].url).hostname;(!e||e!=i)&&(e=i),o()})}function l(){let o=document.getElementById("noteList");if(o.innerHTML="",t)for(let n=0;n<t.length;n++){const a='<div style="display: flex"><p id="text" style="margin-right: 10px">'+t[n]+'</p><button id="modify">수정</button><button id="delete">삭제</button></div>';let i=document.createElement("li");i.innerHTML=a.trim(),i.setAttribute("data-index",""+n),i.setAttribute("id","content"),o.append(i)}else{const n=document.createElement("<h2>");n.text="저장된 데이터가 없습니다.",o.append(n)}}function c(o){t=[],d(o)}function r(){this.init(function(){chrome.storage.local.get([e],o=>{var n,a;(a=(n=o[e])==null?void 0:n.memo)!=null&&a.length&&(t=o[e].memo.filter(i=>i)),l()})})}function m(o){console.log("delete Data = ",t[o]),t.splice(o,1),chrome.storage.local.set({[e]:{memo:t}},()=>{this.load()})}function u(o){if(o.trim().length===0){alert("내용을 작성해 주세요"),document.getElementById("note").value="";return}t.push(o),chrome.storage.local.set({[e]:{memo:t}},()=>{console.log("save memo data = ",t),document.getElementById("note").value="",this.load()})}function f(o,n){const a=window.prompt(`수정 내용을 작성해 주세요 
${t[o]}`);if(a===null){alert("취소 되었습니다.");return}if(a.trim().length===0){alert("수정 된 내용이 없습니다. (스페이스바만 있어요)");return}t[o]=a,chrome.storage.local.set({[e]:{memo:t}},()=>{this.load()})}return{init:c,load:r,deleteData:m,saveData:u,modifyData:f}})();document.getElementById("noteList").addEventListener("click",e=>{var l;e.stopPropagation();const t=e==null?void 0:e.target,d=t==null?void 0:t.id;if(["modify","delete"].includes(d)){const c=t==null?void 0:t.closest("#content"),r=c.getAttribute("data-index")&&+c.getAttribute("data-index");switch(d){case"modify":const m=(l=t==null?void 0:t.closest("#text"))==null?void 0:l.value;s.modifyData(r,m);break;case"delete":s.deleteData(r);break}}},!0);document.getElementById("addNote").addEventListener("click",e=>{var d;e.stopPropagation();const t=(d=e==null?void 0:e.target)==null?void 0:d.id;if(t==="save")switch(t){case"save":const l=document.getElementById("note");if(l){if(!l.value){alert("저장할 내용이 없습니다.");return}s.saveData(l.value)}break}});s.load();
