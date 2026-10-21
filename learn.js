const lessons = [
 {id:'hello',label:'안녕하세요',en:'HELLO',icon:'👋'},
 {id:'thanks',label:'감사합니다',en:'THANK YOU',icon:'🙏'},
 {id:'sorry',label:'미안합니다',en:'I’M SORRY',icon:'🙇'},
 {id:'love',label:'사랑해요',en:'I LOVE YOU',icon:'🫶'},
 {id:'okay',label:'괜찮습니다',en:'IT’S OKAY',icon:'👌'}
];
const video=document.querySelector('#lesson-video');
let selected='all';
let watched=new Set();
try{const saved=JSON.parse(localStorage.getItem('sign-watched-v1')||'[]');if(Array.isArray(saved))watched=new Set(saved.filter(id=>lessons.some(x=>x.id===id)))}catch{}
function render(){
 const list=document.querySelector('#lesson-buttons');list.replaceChildren();
 lessons.forEach((lesson,i)=>{
  const button=document.createElement('button');button.className='lesson-button'+(selected===lesson.id?' active':'')+(watched.has(lesson.id)?' watched':'');button.setAttribute('aria-pressed',String(selected===lesson.id));
  button.innerHTML=`<span class="lesson-icon" aria-hidden="true">${lesson.icon}</span><span class="lesson-label">${lesson.label}<small>${lesson.en}</small></span><span class="arrow" aria-hidden="true">${watched.has(lesson.id)?'✓':'›'}</span>`;
  button.addEventListener('click',()=>select(lesson.id,true));list.append(button);
 });
 const all=document.querySelector('#all-video');all.classList.toggle('active',selected==='all');all.setAttribute('aria-pressed',String(selected==='all'));
 document.querySelector('#progress-count').textContent=`${watched.size} / 5`;document.querySelector('#progress-fill').style.width=`${watched.size*20}%`;
 document.querySelector('#progress-label').textContent=watched.size===5?'모두 배웠어요! 이제 게임에 도전해 볼까요?':'영상을 끝까지 보면 학습 표시가 남아요.';
}
function select(id,play){
 selected=id;const lesson=lessons.find(x=>x.id===id);video.pause();video.src=`assets/${id}.mp4`;video.poster=`assets/${id}.jpg`;video.load();
 document.querySelector('#video-error').hidden=true;
 document.querySelector('#video-title').textContent=lesson?lesson.label:'다섯 가지 수어, 한 번에 보기';document.querySelector('#video-count').textContent=lesson?`${lessons.indexOf(lesson)+1} / 5`:'모음집';
 document.querySelector('#video-step').textContent=lesson?'STEP 01 · 하나씩 익히기':'STEP 01 · 함께 배우기';
 document.querySelector('#video-description').textContent=lesson?'영상 속 손 모양과 움직임을 천천히 따라 해 보세요.':'재생 버튼을 눌러 수어 모음집을 먼저 시청해 주세요.';
 render();if(play)video.play().catch(()=>{});
}
video.addEventListener('ended',()=>{if(selected==='all')lessons.forEach(x=>watched.add(x.id));else watched.add(selected);try{localStorage.setItem('sign-watched-v1',JSON.stringify([...watched]))}catch{}render()});
video.addEventListener('error',()=>{document.querySelector('#video-error').hidden=false});
document.querySelector('#all-video').addEventListener('click',()=>select('all',true));document.querySelector('#replay').addEventListener('click',()=>{video.currentTime=0;video.play().catch(()=>{})});render();
