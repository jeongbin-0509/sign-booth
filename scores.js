/* Shared browser storage. Never insert participant input as HTML. */
window.ScoreStore=(()=>{
 const key='sign-booth-scores-v1',maxRecords=10000;
 function valid(r){return r&&typeof r.id==='string'&&r.id.length<=120&&typeof r.name==='string'&&r.name.trim().length>0&&r.name.length<=20&&Number.isSafeInteger(r.score)&&r.score>=0&&r.score<=999999&&typeof r.createdAt==='string'&&Number.isFinite(Date.parse(r.createdAt))}
 function read(){const value=localStorage.getItem(key);if(!value)return [];const data=JSON.parse(value);if(!Array.isArray(data)||data.length>maxRecords||!data.every(valid))throw Error('저장된 기록을 읽을 수 없어요. 백업 파일을 확인해 주세요.');return data}
 function write(records){if(records.length>maxRecords)throw Error('기록은 최대 10,000개까지 저장할 수 있어요.');localStorage.setItem(key,JSON.stringify(records));window.dispatchEvent(new Event('scores-changed'))}
 function ranked(){let lastScore=null,rank=0;return read().sort((a,b)=>b.score-a.score||a.createdAt.localeCompare(b.createdAt)||a.id.localeCompare(b.id)).map((r,i)=>{if(r.score!==lastScore)rank=i+1;lastScore=r.score;return {...r,rank}})}
 function add(name,score){const r={id:crypto.randomUUID(),name:name.trim(),score,createdAt:new Date().toISOString()};if(!valid(r))throw Error('닉네임과 점수를 다시 확인해 주세요.');const list=read();list.push(r);write(list);return r}
 function remove(id){write(read().filter(r=>r.id!==id))}
 function merge(data){if(!data||data.version!==1||!Array.isArray(data.records)||data.records.length>maxRecords||!data.records.every(valid))throw Error('올바른 기록 파일이 아니에요. 이 사이트에서 내보낸 JSON 파일을 선택해 주세요.');const list=read(),ids=new Set(list.map(r=>r.id));let count=0;data.records.forEach(r=>{if(!ids.has(r.id)){list.push({id:r.id,name:r.name.trim(),score:r.score,createdAt:r.createdAt});ids.add(r.id);count++}});write(list);return count}
 function observe(fn){window.addEventListener('storage',e=>{if(e.key===key||e.key===null)fn()});window.addEventListener('scores-changed',fn)}
 return {read,write,ranked,add,remove,merge,observe};
})();
