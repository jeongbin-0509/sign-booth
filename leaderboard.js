const store=window.ScoreStore;
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node}
function update(){
 const status=document.querySelector('#board-status');
 try{
  const records=store.ranked();document.querySelector('#participant-count').textContent=`참가 기록 ${records.length.toLocaleString('ko-KR')}개`;
  document.querySelector('#empty-state').hidden=records.length>0;document.querySelector('#ranking-table').hidden=records.length===0;
  const podium=document.querySelector('#podium');podium.replaceChildren();podium.hidden=records.length===0;
  const top=records.slice(0,3);const order=top.length===3?[top[1],top[0],top[2]]:top;
  if(top.length<3)podium.style.gridTemplateColumns=`repeat(${top.length||1},1fr)`;else podium.style.gridTemplateColumns='';
  order.forEach(record=>{const card=el('article','podium-card'+(record.rank===1?' first':''));card.append(el('span','medal',record.rank===1?'🥇':record.rank===2?'🥈':'🥉'),el('span','step',`${record.rank}위`),el('h3','',record.name));const score=el('div','podium-score',record.score.toLocaleString('ko-KR'));score.append(el('small','','점'));card.append(score);podium.append(card)});
  const body=document.querySelector('#ranking-body');body.replaceChildren();records.forEach(record=>{const row=el('tr');row.append(el('td','rank-number',`${record.rank}`),el('td','',record.name),el('td','',`${record.score.toLocaleString('ko-KR')}점`));body.append(row)});
  status.textContent=records.length?'입력한 기록이 자동으로 반영돼요.':'';
 }catch(e){status.textContent=e.message||'브라우저 저장소에 접근할 수 없어요.';status.classList.add('error')}
}
store.observe(update);update();
document.querySelector('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else document.querySelector('#board-status').textContent='이 브라우저는 전체 화면을 지원하지 않아요.'}catch{document.querySelector('#board-status').textContent='전체 화면을 열 수 없어요. 브라우저의 전체 화면 기능을 사용해 주세요.'}});
document.addEventListener('fullscreenchange',()=>{document.querySelector('#fullscreen').textContent=document.fullscreenElement?'전체 화면 종료 ↙':'전체 화면 ↗'});
