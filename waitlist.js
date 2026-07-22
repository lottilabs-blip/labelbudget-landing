/* ===================== LabelBudget — Waitlist =====================
 * Envoie les leads vers Formspree (endpoint Luca Lotti / lottilabs).
 * Fallback local (IndexedDB) si hors-ligne ou erreur réseau.
 * Endpoint : https://formspree.io/f/xwvgnvyl
 */
const FORMSPREE_ID = "xwvgnvyl";

const DB_NAME = 'labelbudget_waitlist';
let db;

function openDB(){
  return new Promise((res,rej)=>{
    const r = indexedDB.open(DB_NAME,1);
    r.onupgradeneeded = e=>{ e.target.result.createObjectStore('leads',{keyPath:'email'}); };
    r.onsuccess = e=>{ db=e.target.result; res(db); };
    r.onerror = e=>rej(e);
  });
}

async function addLead(email, role){
  return new Promise((res,rej)=>{
    const tx = db.transaction('leads','readwrite');
    tx.objectStore('leads').put({email, role:role||'', at:new Date().toISOString()});
    tx.oncomplete = ()=>res(true);
    tx.onerror = e=>rej(e);
  });
}
async function countLeads(){
  return new Promise((res,rej)=>{
    const tx = db.transaction('leads','readonly');
    const rq = tx.objectStore('leads').count();
    rq.onsuccess = ()=>res(rq.result); rq.onerror = e=>rej(e);
  });
}

async function sendToFormspree(email, role){
  if(!FORMSPREE_ID) return {ok:true, local:true};
  const r = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`,{
    method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({email, role, _subject:'Nouveau lead LabelBudget waitlist'})
  });
  return {ok:r.ok, status:r.status};
}

function initWaitlist(){
  if(!window.indexedDB){ fallbackNoDB(); return; }
  openDB().then(attachWaitlist).catch(fallbackNoDB);
}

function fallbackNoDB(){
  // Mode ultra-minimal si IndexedDB indispo : au moins on compte + message
  document.getElementById('wlCount').textContent = (+document.getElementById('wlCount').textContent||17);
  attachWaitlist(true);
}

function attachWaitlist(noStore){
  window.__lbReady = true;
  const c = +document.getElementById('wlCount').textContent || 17;
  document.getElementById('wlCount').textContent = c;
  const form = document.getElementById('wlForm');
  const msg = document.getElementById('wlMsg');
  const btn = document.getElementById('wlBtn');

  async function handle(){
    const email = document.getElementById('wlEmail').value.trim();
    const role = document.getElementById('wlRole').value.trim();
    if(!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
      msg.textContent='Merci de saisir un email valide.'; msg.className='wl-msg'; return;
    }
    btn.disabled = true; btn.textContent = '...';
    try{
      if(!noStore) await addLead(email, role);
      const sent = await sendToFormspree(email, role);
      const cur = +document.getElementById('wlCount').textContent || 17;
      document.getElementById('wlCount').textContent = cur + 1;
      msg.textContent = sent.local
        ? '✅ Inscrit ! (mode démo local — branche Formspree pour la prod)'
        : '✅ Inscrit ! Tu seras alerté au lancement.';
      msg.className = 'wl-msg ok';
      form.reset();
    }catch(err){
      msg.textContent = 'Erreur, réessaie.'; msg.className='wl-msg';
    }
    btn.disabled = false; btn.textContent = 'Je m\'inscris';
  }

  form.addEventListener('submit', e=>{ e.preventDefault(); handle(); });
  btn.addEventListener('click', e=>{ e.preventDefault(); handle(); });
}

/* Le script est en fin de body : DOM déjà prêt. On init directement,
   mais on garde le fallback DOMContentLoaded au cas où. */
function boot(){ initWaitlist(); }
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', boot);
}else{
  boot();
}
