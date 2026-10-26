/* KINO+ frontend. API холболтын бүх тохиргоо CONFIG дотор. */
const CONFIG = {
  API_BASE: '', // ЖИШЭЭ: 'https://your-server.com'. Хоосон бол DEMO горим.
  ENDPOINTS: { // Одоогийн backend-ийн бодит замуудаар солино
    movies: '/api/movies', me: '/api/auth/me', login: '/api/auth/login',
    register: '/api/auth/register', logout: '/api/auth/logout',
    list: '/api/my-list', plans: '/api/premium/plans',
    invoice: '/api/premium/invoice', invoiceStatus: '/api/premium/invoice/'
  }
};
const DEMO = !CONFIG.API_BASE;

/* ---- Demo өгөгдөл (зөвхөн API байхгүй үед) ---- */
const D = (id,title,year,genres,rating,category,extra={}) => ({id,title,year,genres,rating,category,
  description:'Demo тайлбар: энд киноны товч агуулга харагдана.',duration:'1 цаг 50 мин',director:'—',cast:[],poster:'',backdrop:'',trailer:'',video:'',premium:false,...extra});
const DEMO_MOVIES = [
  D(1,'Шөнийн цагдаа',2025,['Тулаант','Триллер'],8.1,'hollywood',{trending:true,description:'Хотыг сүүдэрт нь хамгаалдаг нэгэн цагдааны түүх.'}),
  D(2,'Тэнгэрийн зам',2024,['Драма'],7.8,'mongolian',{trending:true}),
  D(3,'Сөүлийн намар',2025,['Романтик','Драма'],8.4,'korean',{trending:true}),
  D(4,'Сүүлчийн говь',2023,['Адал явдал'],7.2,'mongolian'),
  D(5,'Цэнхэр од',2026,['Шинжлэх ухаан'],8.0,'hollywood',{isNew:true,premium:true}),
  D(6,'Сакурагийн сэлэм',2026,['Аниме','Тулаант'],8.6,'anime',{isNew:true}),
  D(7,'Дөрөвдэх давхар',2025,['Триллер'],7.5,'korean',{isNew:true}),
  D(8,'Нутгийн хүүхэд',2022,['Инээдэм'],7.0,'mongolian'),
  D(9,'Хаадын хөндий',2024,['Түүхэн','Драма'],8.3,'series',{episodes:12,premium:true}),
  D(10,'Хотын дуу',2025,['Романтик'],7.6,'series',{episodes:16}),
  D(11,'Сарны хүү',2023,['Аниме','Адал явдал'],8.2,'anime',{premium:true}),
  D(12,'Хамгийн урт шөнө',2026,['Аймшиг'],6.9,'hollywood',{isNew:true})
];
const DEMO_PLANS = [
  {id:'m1',name:'1 сар',price:9900,days:30},{id:'m3',name:'3 сар',price:24900,days:90,best:true},{id:'m12',name:'12 сар',price:89900,days:365}
];

/* ---- Төлөв ---- */
const S = { view:'home', movies:[], user:null, list:new Set(), genre:'', query:'', status:'loading', plans:[] };
const $ = s => document.querySelector(s);
const app = $('#app'), modal = $('#modal'), mbody = $('#modalBody');
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => Number(n).toLocaleString('mn-MN') + '₮';

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove('show'),2800); }

/* ---- API давхарга (бүх дуудлага эндээс) ---- */
async function api(path, {method='GET', body} = {}){
  let res;
  try{
    res = await fetch(CONFIG.API_BASE + path, {method, credentials:'include',
      headers: body ? {'Content-Type':'application/json'} : undefined, body: body ? JSON.stringify(body) : undefined});
  }catch{ throw new Error('Серверт холбогдож чадсангүй. Интернэт холболтоо шалгаад дахин оролдоно уу.'); }
  if(res.status===401) throw new Error('Нэвтэрнэ үү.');
  if(res.status===403) throw new Error('Танд энэ үйлдлийг хийх эрх алга.');
  if(!res.ok){ let m=''; try{ m=(await res.json()).message }catch{} throw new Error(m || 'Серверийн алдаа гарлаа ('+res.status+'). Дараа дахин оролдоно уу.'); }
  return res.status===204 ? null : res.json();
}

/* Backend-ийн талбарын нэрийг ЭНД тааруулна (бодит хариуг хараад засна) */
function normalize(m){
  return {
    id:m.id ?? m._id, title:m.title ?? m.name ?? '', year:m.year ?? m.releaseYear ?? '',
    genres:m.genres ?? (m.genre ? [].concat(m.genre) : []), rating:m.rating ?? m.imdb ?? '',
    category:m.category ?? '', description:m.description ?? m.overview ?? '', duration:m.duration ?? '',
    director:m.director ?? '', cast:m.cast ?? m.actors ?? [], poster:m.poster ?? '', backdrop:m.backdrop ?? m.poster ?? '',
    trailer:m.trailer ?? '', video:m.video ?? m.videoUrl ?? '', premium:!!m.premium, trending:!!m.trending, isNew:!!m.isNew, episodes:m.episodes
  };
}

async function load(){
  S.status='loading'; render();
  try{
    if(DEMO){ $('#demoBar').hidden=false; S.movies=DEMO_MOVIES; S.plans=DEMO_PLANS; }
    else{
      const data = await api(CONFIG.ENDPOINTS.movies);
      S.movies = (Array.isArray(data) ? data : data.items || data.movies || []).map(normalize);
      try{ const p=await api(CONFIG.ENDPOINTS.plans); S.plans=Array.isArray(p)?p:p.plans||[]; }catch{ S.plans=[]; }
      try{ S.user = await api(CONFIG.ENDPOINTS.me); }catch{ S.user=null; }
      if(S.user){ try{ const l=await api(CONFIG.ENDPOINTS.list); S.list=new Set((Array.isArray(l)?l:l.items||[]).map(x=>x.id??x)); }catch{} }
    }
    S.status = S.movies.length ? 'ok' : 'empty';
  }catch(e){ S.status='error'; S.error=e.message; }
  updateAuth(); render();
}

/* ---- Үйлдлүүд ---- */
async function toggleList(id){
  if(!S.user){ toast('Жагсаалт ашиглахын тулд нэвтэрнэ үү.'); return openAuth(); }
  const has=S.list.has(id);
  try{
    if(!DEMO) await api(CONFIG.ENDPOINTS.list + (has?'/'+encodeURIComponent(id):''), {method:has?'DELETE':'POST', body:has?undefined:{movieId:id}});
    has ? S.list.delete(id) : S.list.add(id);
    toast(has?'Жагсаалтаас хасагдлаа':'Жагсаалтад нэмэгдлээ'); render();
  }catch(e){ toast(e.message); }
}
const find = id => S.movies.find(m => String(m.id)===String(id));
const search = list => {
  const q=S.query.trim().toLowerCase();
  return list.filter(m => (!q || (m.title+' '+m.genres.join(' ')).toLowerCase().includes(q)) && (!S.genre || m.genres.includes(S.genre)));
};

/* ---- Дүрслэл ---- */
const poster = m => m.poster ? `<img src="${esc(m.poster)}" alt="" loading="lazy" onerror="this.remove()">` : '';
function card(m){
  const on=S.list.has(m.id);
  return `<article class="card"><button class="poster" data-open="${esc(m.id)}" aria-label="${esc(m.title)} дэлгэрэнгүй">${poster(m)}${m.premium?'<span class="badge">Premium</span>':''}<span style="position:relative">${m.poster?'':esc(m.title)}</span></button>
  <div class="card-b"><div class="card-t">${esc(m.title)}</div>
  <div class="card-m"><span>${esc(m.year)} · ${esc(m.genres[0]||'')}</span><span class="rate">★ ${esc(m.rating)}</span></div>
  <div class="card-a"><button data-open="${esc(m.id)}">Дэлгэрэнгүй</button><button class="${on?'on':''}" data-list="${esc(m.id)}" aria-pressed="${on}">${on?'✓ Жагсаалтад':'+ Жагсаалт'}</button></div></div></article>`;
}
const row = (t,l) => l.length ? `<section class="section"><h2>${t}</h2><div class="row">${l.map(card).join('')}</div></section>` : '';
const grid = (t,l) => `<section class="section"><h2>${t}</h2>${l.length?`<div class="grid">${l.map(card).join('')}</div>`:'<div class="state">Илэрц олдсонгүй. Хайлт эсвэл төрлөө өөрчилж үзнэ үү.</div>'}</section>`;
const chips = () => { const g=[...new Set(S.movies.flatMap(m=>m.genres))];
  return `<div class="chips"><button class="chip ${!S.genre?'on':''}" data-genre="">Бүгд</button>${g.map(x=>`<button class="chip ${S.genre===x?'on':''}" data-genre="${esc(x)}">${esc(x)}</button>`).join('')}</div>`; };

function hero(m){
  const bg = m.backdrop ? `background-image:url('${esc(m.backdrop)}')` : 'background-image:radial-gradient(circle at 70% 30%,#4c1d95,#08090D 70%)';
  return `<section class="hero" style="${bg}"><div class="hero-in"><h1>${esc(m.title)}</h1>
  <div class="meta"><span>${esc(m.year)}</span><span class="rate">★ ${esc(m.rating)}</span><span>${esc(m.genres.join(', '))}</span></div>
  <p>${esc(m.description)}</p><div class="hero-btns"><button class="btn btn-primary" data-watch="${esc(m.id)}">▶ Үзэх</button><button class="btn btn-ghost" data-open="${esc(m.id)}">Дэлгэрэнгүй</button></div></div></section>`;
}

function render(){
  document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.view===S.view));
  if(S.status==='loading'){ app.innerHTML='<section class="section"><div class="grid">'+'<div class="skel"></div>'.repeat(8)+'</div></section>'; return; }
  if(S.status==='error'){ app.innerHTML=`<div class="state"><p>${esc(S.error)}</p><br><button class="btn btn-primary" id="retry">Дахин оролдох</button></div>`; $('#retry').onclick=load; return; }
  if(S.status==='empty'){ app.innerHTML='<div class="state">Одоогоор кино нэмэгдээгүй байна.</div>'; return; }
  const M=S.movies, v=S.view; let h='';
  if(v==='home'){
    const f=M.find(m=>m.trending)||M[0];
    h=hero(f)+row('Тренд кино',M.filter(m=>m.trending))+row('Шинээр нэмэгдсэн',M.filter(m=>m.isNew))
     +row('Монгол кино',M.filter(m=>m.category==='mongolian'))+row('Солонгос кино',M.filter(m=>m.category==='korean'))
     +row('Холливуд кино',M.filter(m=>m.category==='hollywood'))+row('Аниме',M.filter(m=>m.category==='anime'))
     +row('Олон ангит кино',M.filter(m=>m.category==='series'))+row('Premium контент',M.filter(m=>m.premium));
  }
  else if(v==='movies') h=`<section class="section">${chips()}</section>`+grid('Кино',search(M.filter(m=>m.category!=='series')));
  else if(v==='series') h=grid('Олон ангит',search(M.filter(m=>m.category==='series')));
  else if(v==='mongolian') h=grid('Монгол кино',search(M.filter(m=>m.category==='mongolian')));
  else if(v==='genres') h=`<section class="section"><h2>Төрөл</h2>${chips()}</section>`+grid(S.genre||'Бүх кино',search(M));
  else if(v==='search') h=grid(`Хайлт: “${esc(S.query)}”`,search(M));
  else if(v==='mylist') h=S.user ? grid('Миний жагсаалт',M.filter(m=>S.list.has(m.id))) : `<div class="state"><p>Жагсаалтаа үзэхийн тулд нэвтэрнэ үү.</p><br><button class="btn btn-primary" data-auth>Нэвтрэх</button></div>`;
  else if(v==='premium') h=premiumView();
  else if(v==='profile') h=profileView();
  app.innerHTML=h;
}

/* ---- Дэлгэрэнгүй ---- */
function openMovie(id, watch){
  const m=find(id); if(!m) return;
  const sim=S.movies.filter(x=>x.id!==m.id && x.genres.some(g=>m.genres.includes(g))).slice(0,6);
  const locked = m.premium && !(S.user && S.user.premium);
  let player='';
  if(watch){
    if(locked) player=`<div class="note">Энэ контент Premium эрхтэй хэрэглэгчдэд нээлттэй. <button class="btn btn-primary" data-view="premium" data-close>Premium авах</button></div>`;
    else if(m.video) player=`<video class="player" controls src="${esc(m.video)}"></video>`;
    else player=`<div class="note">Энэ киноны видео эх үүсвэр одоогоор холбогдоогүй байна.</div>`;
  }
  const trailer = m.trailer ? `<h3 style="margin-top:16px">Trailer</h3><iframe class="player" src="${esc(m.trailer)}" title="Trailer" allowfullscreen loading="lazy"></iframe>` : '';
  const bg = m.backdrop ? `background-image:url('${esc(m.backdrop)}')` : 'background-image:radial-gradient(circle at 70% 30%,#4c1d95,#15171E 70%)';
  mbody.innerHTML=`<button class="close" data-close aria-label="Хаах">×</button>
  <div class="d-top" style="${bg}"><h1>${esc(m.title)}</h1></div>
  <div class="d-body"><div class="meta"><span>${esc(m.year)}</span><span class="rate">★ ${esc(m.rating)}</span><span>${esc(m.duration)}</span>${m.premium?'<span>Premium</span>':''}</div>
  <p>${esc(m.description)}</p>
  <dl><dt>Төрөл</dt><dd>${esc(m.genres.join(', ')||'—')}</dd><dt>Найруулагч</dt><dd>${esc(m.director||'—')}</dd><dt>Жүжигчид</dt><dd>${esc([].concat(m.cast).join(', ')||'—')}</dd></dl>
  <div class="hero-btns"><button class="btn btn-primary" data-watch="${esc(m.id)}">▶ Үзэх</button><button class="btn btn-ghost" data-list="${esc(m.id)}">${S.list.has(m.id)?'✓ Жагсаалтад':'+ Жагсаалтад нэмэх'}</button></div>
  ${player}${trailer}
  ${sim.length?`<h3 style="margin-top:20px">Төстэй кинонууд</h3><div class="row" style="margin-top:10px">${sim.map(card).join('')}</div>`:''}</div>`;
  if(!modal.open) modal.showModal();
}

/* ---- Нэвтрэх / бүртгүүлэх (нууц үг хадгалахгүй, session cookie ашиглана) ---- */
function openAuth(mode='login'){
  const reg=mode==='register';
  mbody.innerHTML=`<button class="close" data-close aria-label="Хаах">×</button>
  <form class="form" id="authForm"><h2>${reg?'Бүртгүүлэх':'Нэвтрэх'}</h2>
  ${DEMO?'<div class="note">Demo горим: бодит бүртгэл үүсэхгүй.</div>':''}
  ${reg?'<input name="name" placeholder="Нэр" required autocomplete="name">':''}
  <input name="email" type="email" placeholder="И-мэйл" required autocomplete="email">
  <input name="password" type="password" placeholder="Нууц үг (8+ тэмдэгт)" minlength="8" required autocomplete="${reg?'new-password':'current-password'}">
  <div class="err" id="authErr"></div>
  <button class="btn btn-primary" type="submit">${reg?'Бүртгүүлэх':'Нэвтрэх'}</button>
  <button class="btn btn-ghost" type="button" data-auth="${reg?'login':'register'}">${reg?'Бүртгэлтэй юу? Нэвтрэх':'Шинээр бүртгүүлэх'}</button></form>`;
  if(!modal.open) modal.showModal();
  $('#authForm').onsubmit = async e=>{
    e.preventDefault(); const f=Object.fromEntries(new FormData(e.target)); const err=$('#authErr'); err.textContent='';
    try{
      if(DEMO) S.user={name:f.name||f.email.split('@')[0],email:f.email,premium:false,demo:true};
      else{ await api(reg?CONFIG.ENDPOINTS.register:CONFIG.ENDPOINTS.login,{method:'POST',body:f}); S.user=await api(CONFIG.ENDPOINTS.me); }
      modal.close(); updateAuth(); toast('Тавтай морилно уу!'); render();
    }catch(x){ err.textContent=x.message; }
  };
}
function updateAuth(){ $('#authBtn').textContent = S.user ? (S.user.name||'Профайл') : 'Нэвтрэх'; }
function profileView(){
  const u=S.user; if(!u) return '<div class="state"><button class="btn btn-primary" data-auth>Нэвтрэх</button></div>';
  return `<section class="section"><h2>Профайл</h2><div class="plan"><p><b style="font-size:20px">${esc(u.name)}</b></p><p style="color:var(--muted)">${esc(u.email||'')}</p>
  <p style="margin:12px 0">Premium: ${u.premium?'идэвхтэй'+(u.premiumUntil?' ('+esc(u.premiumUntil)+' хүртэл)':''):'идэвхгүй'}</p>
  <button class="btn btn-ghost" id="logout">Гарах</button></div></section>`;
}

/* ---- Premium + QPay (invoice болон баталгаажуулалт зөвхөн backend-ээр) ---- */
function premiumView(){
  if(!S.plans.length) return '<div class="state">Premium багцын мэдээлэл одоогоор байхгүй байна.</div>';
  return `<section class="section"><h2>Premium багц</h2>${DEMO?'<div class="note" style="margin-bottom:14px">Demo: үнэ болон төлбөр бодит биш.</div>':''}
  <div class="plans">${S.plans.map(p=>`<div class="plan ${p.best?'best':''}"><h3>${esc(p.name)}</h3><b>${money(p.price)}</b><p style="color:var(--muted);margin-bottom:14px">Бүх Premium контент, ${esc(p.days)} хоног</p><button class="btn btn-primary" data-pay="${esc(p.id)}">Төлбөр төлөх</button></div>`).join('')}</div></section>`;
}
async function pay(planId){
  if(!S.user){ toast('Төлбөр төлөхийн өмнө нэвтэрнэ үү.'); return openAuth(); }
  const plan=S.plans.find(p=>String(p.id)===String(planId));
  mbody.innerHTML=`<button class="close" data-close aria-label="Хаах">×</button><div class="form"><h2>QPay төлбөр</h2><p id="payMsg">Нэхэмжлэх үүсгэж байна…</p></div>`;
  if(!modal.open) modal.showModal();
  if(DEMO){
    $('.form').innerHTML=`<h2>QPay төлбөр (DEMO)</h2><div class="note">Энэ бол жишээ харагдац. Бодит төлбөр хийгдэхгүй.</div><div class="qr" role="img" aria-label="Demo QR"></div><p style="text-align:center">${esc(plan.name)} — ${money(plan.price)}</p><button class="btn btn-primary" id="demoPaid">Demo: төлсөн гэж тооцох</button>`;
    $('#demoPaid').onclick=()=>{ S.user.premium=true; modal.close(); toast('Demo Premium идэвхжлээ'); render(); };
    return;
  }
  try{
    const inv=await api(CONFIG.ENDPOINTS.invoice,{method:'POST',body:{planId}}); // дүнг backend өөрөө төлөвлөгөөнөөс тооцно
    const qr=inv.qr_image||inv.qrImage;
    $('.form').innerHTML=`<h2>QPay төлбөр</h2>${qr?`<img class="qr" alt="QPay QR" src="${esc(qr.startsWith('data:')?qr:'data:image/png;base64,'+qr)}">`:''}
      ${inv.deeplink||inv.url?`<a class="btn btn-ghost" href="${esc(inv.deeplink||inv.url)}" rel="noopener">Банкны апп нээх</a>`:''}
      <p id="payMsg" style="text-align:center;color:var(--muted)">Төлбөр хүлээж байна…</p>`;
    pollInvoice(inv.id||inv.invoiceId);
  }catch(e){ $('#payMsg').textContent=e.message; }
}
function pollInvoice(id,n=0){
  if(!modal.open) return;
  if(n>60){ const m=$('#payMsg'); if(m) m.textContent='Хугацаа хэтэрлээ. Төлсөн бол Профайл хэсгээс шалгана уу.'; return; }
  setTimeout(async()=>{
    try{
      const r=await api(CONFIG.ENDPOINTS.invoiceStatus+encodeURIComponent(id));
      if(r.paid||r.status==='PAID'){ S.user=await api(CONFIG.ENDPOINTS.me); modal.close(); updateAuth(); toast('Premium идэвхжлээ!'); render(); }
      else pollInvoice(id,n+1);
    }catch{ pollInvoice(id,n+1); }
  },4000);
}

/* ---- Үйл явдал ---- */
document.addEventListener('click', async e=>{
  const t=e.target.closest('[data-view],[data-open],[data-watch],[data-list],[data-genre],[data-pay],[data-close],[data-auth],#logout,#authBtn,#burger');
  if(!t) return;
  if(t.id==='burger') return $('#nav').classList.toggle('open');
  if(t.id==='authBtn') return S.user ? go('profile') : openAuth();
  if(t.id==='logout'){ try{ if(!DEMO) await api(CONFIG.ENDPOINTS.logout,{method:'POST'}); }catch{} S.user=null; S.list=new Set(); updateAuth(); go('home'); return toast('Гарлаа'); }
  if('close' in t.dataset) modal.close();
  if('auth' in t.dataset) return openAuth(t.dataset.auth||'login');
  if(t.dataset.view) return go(t.dataset.view);
  if(t.dataset.open){ openMovie(t.dataset.open); }
  if(t.dataset.watch){ openMovie(t.dataset.watch,true); }
  if(t.dataset.list){ await toggleList(isNaN(t.dataset.list)?t.dataset.list:Number(t.dataset.list)); if(modal.open&&mbody.querySelector('.d-top')) openMovie(t.dataset.list); }
  if('genre' in t.dataset){ S.genre=t.dataset.genre; render(); }
  if(t.dataset.pay) pay(t.dataset.pay);
});
function go(v){ S.view=v; $('#nav').classList.remove('open'); if(v!=='search') {S.query='';$('#q').value='';} S.genre=''; render(); app.focus(); window.scrollTo(0,0); }
$('#searchForm').addEventListener('submit',e=>{ e.preventDefault(); S.query=$('#q').value; S.view='search'; render(); });
$('#q').addEventListener('input',e=>{ if(S.view==='search'){ S.query=e.target.value; render(); } });
modal.addEventListener('click',e=>{ if(e.target===modal) modal.close(); });
modal.addEventListener('close',()=>{ mbody.innerHTML=''; });

load();
