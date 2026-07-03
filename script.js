const CACHE_VERSION = 'v5-layered';

const pages=[
 {img:`assets/page1.png?${CACHE_VERSION}`,title:'زيارة بيت الدب',text:'في يومٍ مشمس، قررت مسك أن تزور صديقها الدب في بيته داخل الغابة. طرقت الباب وقالت: مرحبًا يا دب! هل أنت هنا؟',layers:[
   {type:'misk',icon:'👧',x:22,y:62,msg:'أنا مسك! هيا نطرق الباب.'},
   {type:'bear',icon:'🐻',x:71,y:58,msg:'أهلاً يا مسك!'},
   {type:'door',icon:'🚪',x:50,y:47,msg:'طق طق! الباب يفتح.'},
   {type:'stars',icon:'✨',x:13,y:18,msg:'يوم مشمس جميل!'}
 ]},
 {img:`assets/page2.png?${CACHE_VERSION}`,title:'الشاي والعسل',text:'فتح الدب الباب بفرح وقال: أهلاً بك يا مسك! تفضلي، لقد أعددت لك بعض الشاي والعسل.',layers:[
   {type:'bear',icon:'🐻',x:67,y:55,msg:'تفضلي يا مسك.'},
   {type:'misk',icon:'👧',x:30,y:62,msg:'رائحته لذيذة!'},
   {type:'tea',icon:'🍵',x:50,y:69,msg:'الشاي دافئ.'},
   {type:'steam',icon:'♨️',x:50,y:58,msg:'بخار الشاي يتحرك.'}
 ]},
 {img:`assets/page3.png?${CACHE_VERSION}`,title:'الفراشات الجميلة',text:'بعد الشاي قالت مسك: لنستكشف الغابة! وانطلقا معًا بين الأشجار والزهور، يبحثان عن الفراشات الجميلة.',game:true,layers:[
   {type:'misk',icon:'👧',x:24,y:64,msg:'ساعديني في التقاط الفراشات!'},
   {type:'bear',icon:'🐻',x:72,y:62,msg:'لنبحث عنها معًا.'},
   {type:'butterfly-anim',icon:'🦋',x:32,y:26,msg:'فراشة!'},
   {type:'butterfly-anim',icon:'🦋',x:56,y:20,msg:'فراشة أخرى!'},
   {type:'butterfly-anim',icon:'🦋',x:76,y:30,msg:'اضغطي عليّ!'}
 ]},
 {img:`assets/page4.png?${CACHE_VERSION}`,title:'المطر والمظلة',text:'فجأة بدأت الغيوم تتجمع، وقرر الدب أن يعودا إلى المنزل قبل المطر. قالت مسك: كان يومًا رائعًا! شكرًا لك يا دب.',layers:[
   {type:'rain',icon:'',x:0,y:0,msg:''},
   {type:'cloud',icon:'☁️',x:27,y:16,msg:'الغيوم تتحرك.'},
   {type:'cloud',icon:'☁️',x:68,y:12,msg:'بدأ المطر.'},
   {type:'misk',icon:'👧',x:30,y:64,msg:'لنعد إلى البيت!'},
   {type:'bear',icon:'🐻',x:67,y:62,msg:'لا تقلقي يا مسك.'},
   {type:'tea',icon:'☂️',x:49,y:44,msg:'المظلة تحمينا.'}
 ]},
 {img:`assets/page5.png?${CACHE_VERSION}`,title:'الصداقة أجمل',text:'عادا إلى البيت وجلسا قرب النافذة يشاهدان المطر. قال الدب: الصداقة مثل المطر، تجعل حياتنا أجمل. ابتسمت مسك وقالت: نعم، ومعك يا دب كل يوم مغامرة جميلة.',layers:[
   {type:'rain',icon:'',x:0,y:0,msg:''},
   {type:'heart',icon:'💗',x:50,y:22,msg:'الصداقة تجعل اليوم أجمل.'},
   {type:'misk',icon:'👧',x:34,y:63,msg:'كانت مغامرة جميلة!'},
   {type:'bear',icon:'🐻',x:66,y:62,msg:'كل يوم معكِ مغامرة.'},
   {type:'stars',icon:'✨',x:50,y:14,msg:'النهاية السعيدة!'}
 ]}
];

let current=0, earned=0, currentAudio=null;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function showScreen(id){$$('.screen').forEach(x=>x.classList.remove('active')); $('#'+id).classList.add('active'); $$('.tab').forEach(b=>b.classList.toggle('active', b.dataset.screen===id)); if(id==='story') renderPage(current); if(id==='coloring') setTimeout(loadColoring,60)}
$$('[data-screen]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.screen)));
$('#startBtn').addEventListener('click',()=>{current=0; showScreen('story')});

function renderPage(i){
  current=Math.max(0,Math.min(pages.length-1,i));
  const p=pages[current];
  $('#pageImg').src=p.img;
  $('#pageBadge').textContent=`الصفحة ${current+1} من ${pages.length}`;
  $('#pageTitle').textContent=p.title;
  $('#pageText').textContent=p.text;
  $('#progressBar').style.width=((current+1)/pages.length*100)+'%';
  $('#prevBtn').disabled=current===0;
  $('#nextBtn').textContent=current===pages.length-1?'النهاية':'التالي';
  earned=Math.max(earned,current+1);
  $('#stars').textContent='★ '.repeat(earned)+'☆ '.repeat(Math.max(0,5-earned));
  setupGame(!!p.game);
  renderSceneLayers(p.layers||[]);
}

function renderSceneLayers(layers){
  const holder=$('#sceneLayers');
  if(!holder) return;
  holder.innerHTML='<div class="scene-toast" id="sceneToast">اضغطي على عناصر المشهد</div>';
  layers.forEach((item,idx)=>{
    const el=document.createElement('button');
    el.type='button';
    el.className=`layer layer-${item.type}`;
    el.style.left=(item.x||0)+'%';
    el.style.top=(item.y||0)+'%';
    el.style.transform+=' translate(-50%,-50%)';
    el.style.animationDelay=(idx*.18)+'s';
    if(item.type==='rain'){
      el.className='layer-rain';
      holder.appendChild(el);
      return;
    }
    el.innerHTML=`<span class="layer-emoji">${item.icon||''}</span><span class="bubble">${item.msg||''}</span>`;
    el.addEventListener('click',()=>{
      el.classList.add('show-bubble');
      showSceneToast(item.msg||'رائع!');
      setTimeout(()=>el.classList.remove('show-bubble'),1700);
    });
    holder.appendChild(el);
  });
  setTimeout(()=>showSceneToast('اضغطي على الشخصيات والعناصر'),450);
}

function showSceneToast(msg){
  const toast=$('#sceneToast');
  if(!toast || !msg) return;
  toast.textContent=msg;
  toast.classList.add('show');
  clearTimeout(showSceneToast.t);
  showSceneToast.t=setTimeout(()=>toast.classList.remove('show'),1500);
}

$('#prevBtn').onclick=()=>renderPage(current-1);
$('#nextBtn').onclick=()=> current===pages.length-1?showScreen('home'):renderPage(current+1);
$('#readBtn').onclick=()=>{const p=pages[current]; if(currentAudio){currentAudio.pause(); currentAudio=null;} currentAudio=new Audio(`audio/page${current+1}.mp3?${CACHE_VERSION}`); currentAudio.play().catch(()=>{speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(p.text); u.lang='ar'; u.rate=.9; speechSynthesis.speak(u);});};
function setupGame(on){const box=$('#gameBox'); box.hidden=!on; if(!on)return; box.innerHTML='<b>🦋 التقطي 3 فراشات:</b><br>'; let caught=0; for(let i=0;i<3;i++){const btn=document.createElement('button');btn.className='butterfly';btn.textContent='🦋';btn.onclick=()=>{if(btn.classList.contains('caught'))return; btn.classList.add('caught'); caught++; if(caught===3){box.insertAdjacentHTML('beforeend','<p>أحسنتِ! حصلتِ على كل النجوم ⭐</p>'); earned=5; $('#stars').textContent='★ ★ ★ ★ ★';}}; box.appendChild(btn)}}

const colorImgs=[
  `assets/coloring/coloring1.png?${CACHE_VERSION}`,
  `assets/coloring/coloring2.png?${CACHE_VERSION}`,
  `assets/coloring/coloring3.png?${CACHE_VERSION}`,
  `assets/coloring/coloring4.png?${CACHE_VERSION}`,
  `assets/coloring/coloring5.png?${CACHE_VERSION}`
];
let canvas,ctx,drawing=false,brushColor='#d94c8a',lastColor='#d94c8a',brushSize=16,colorIndex=0,coloringReady=false;
function loadColoring(){if(coloringReady)return; coloringReady=true; canvas=$('#paintCanvas'); ctx=canvas.getContext('2d',{willReadFrequently:true}); buildColorButtons(); loadColorPage(0); bindPaint();}
function buildColorButtons(){const cp=$('#colorPages'); colorImgs.forEach((_,i)=>{let b=document.createElement('button');b.textContent=`صفحة ${i+1}`;b.onclick=()=>loadColorPage(i);cp.appendChild(b)}); const palette=['#111111','#ffffff','#d94c8a','#8b5cf6','#3b82f6','#22c55e','#facc15','#f97316','#ef4444','#8b5a2b','#ffb6c1','#7dd3fc','#a7f3d0','#fde68a','#c084fc']; const cs=$('#colors'); palette.forEach((c,i)=>{let s=document.createElement('button');s.className='swatch'+(i===2?' active':'');s.style.background=c;s.title=c;s.onclick=()=>{lastColor=c; brushColor=c; $$('.swatch').forEach(x=>x.classList.remove('active')); s.classList.add('active')};cs.appendChild(s)}); $('#brush').oninput=e=>brushSize=+e.target.value; $('#eraserBtn').onclick=()=>{brushColor='#ffffff'}; $('#clearBtn').onclick=()=>loadColorPage(colorIndex); $('#saveBtn').onclick=()=>{const a=document.createElement('a');a.download=`misk-coloring-${colorIndex+1}.png`;a.href=canvas.toDataURL('image/png');a.click();};}
function loadColorPage(i){colorIndex=i; $$('#colorPages button').forEach((b,k)=>b.classList.toggle('active',k===i)); const img=new Image(); img.onload=()=>{canvas.width=img.width; canvas.height=img.height; ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0);}; img.src=colorImgs[i];}
function point(e){const r=canvas.getBoundingClientRect(); const t=e.touches?e.touches[0]:e; return {x:(t.clientX-r.left)*(canvas.width/r.width), y:(t.clientY-r.top)*(canvas.height/r.height)}}
function bindPaint(){function start(e){e.preventDefault(); drawing=true; const p=point(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x+.1,p.y+.1); ctx.strokeStyle=brushColor; ctx.lineWidth=brushSize; ctx.lineCap='round'; ctx.stroke()} function move(e){if(!drawing)return; e.preventDefault(); const p=point(e); ctx.lineWidth=brushSize; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle=brushColor; ctx.lineTo(p.x,p.y); ctx.stroke()} function end(){drawing=false} canvas.addEventListener('mousedown',start);canvas.addEventListener('mousemove',move);window.addEventListener('mouseup',end);canvas.addEventListener('touchstart',start,{passive:false});canvas.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',end)}
if('serviceWorker' in navigator){/* جاهز لاحقًا لإضافة service worker */}
renderPage(0);
