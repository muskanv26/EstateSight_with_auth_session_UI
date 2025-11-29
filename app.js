
/* Session and header updates: show welcome name, logout, and protect demo */
function initSessionUI() {
  const nav = document.querySelector('.main-nav');
  if(!nav) return;
  const users = JSON.parse(localStorage.getItem('es_current_user') || 'null');
  // remove existing user-area if present
  let existing = document.getElementById('es-user-area');
  if(existing) existing.remove();
  const userArea = document.createElement('div');
  userArea.id = 'es-user-area';
  userArea.style.display = 'flex';
  userArea.style.alignItems = 'center';
  userArea.style.gap = '8px';
  if(users && users.name) {
    const nameSpan = document.createElement('span');
    nameSpan.textContent = 'Welcome, ' + users.name;
    nameSpan.style.color = '#fff';
    nameSpan.style.fontWeight = '600';
    nameSpan.style.marginRight = '6px';
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn ghost';
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', ()=>{
      localStorage.removeItem('es_current_user');
      // optionally keep users in localStorage, just remove current
      initSessionUI();
      // redirect to home
      window.location.href = 'index.html';
    });
    userArea.appendChild(nameSpan);
    userArea.appendChild(logoutBtn);
  } else {
    // show login/register links if not logged in
    const loginA = document.createElement('a');
    loginA.href = 'login.html';
    loginA.className = 'nav-link';
    loginA.textContent = 'Login';
    const regA = document.createElement('a');
    regA.href = 'register.html';
    regA.className = 'nav-link';
    regA.textContent = 'Register';
    userArea.appendChild(loginA);
    userArea.appendChild(regA);
  }
  nav.appendChild(userArea);
}

// protect Get Started demo: if not logged in, disable form and show prompt
function protectDemo() {
  const form = document.getElementById('priceForm');
  const resultBox = document.getElementById('resultBox');
  if(!form) return;
  const user = JSON.parse(localStorage.getItem('es_current_user') || 'null');
  const lockOverlayId = 'es-lock-overlay';
  // remove existing overlay
  const existing = document.getElementById(lockOverlayId);
  if(existing) existing.remove();
  if(!user) {
    // disable inputs and show overlay prompt
    Array.from(form.querySelectorAll('input, select, button')).forEach(el=>{
      // allow reset button to function
      if(el.id === 'resetBtn') return;
      el.disabled = true;
    });
    const overlay = document.createElement('div');
    overlay.id = lockOverlayId;
    overlay.style.position = 'absolute';
    overlay.style.right = '20px';
    overlay.style.top = '20px';
    overlay.style.background = 'rgba(255,255,255,0.98)';
    overlay.style.border = '1px solid #eee';
    overlay.style.padding = '12px';
    overlay.style.borderRadius = '8px';
    overlay.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
    overlay.innerHTML = '<strong>Login required</strong><div style="margin-top:8px">Please <a href="login.html">login</a> or <a href="register.html">create an account</a> to use the interactive demo.</div>';
    // position relative to form parent
    const parent = form.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(overlay);
    if(resultBox) resultBox.innerHTML = '<p class="muted">Please login to use the interactive demo. You can register or login from the top-right.</p>';
  } else {
    // enable inputs
    Array.from(form.querySelectorAll('input, select, button')).forEach(el=> el.disabled = false);
    if(resultBox) resultBox.innerHTML = '<p class="muted">No prediction yet. Enter details and click <strong>Predict Price</strong>.</p>';
  }
}


document.addEventListener('DOMContentLoaded', ()=>{
  const imgs = document.querySelectorAll('.carousel img');
  let idx=0;
  function show(i){
    imgs.forEach(x=>x.classList.remove('active'));
    imgs[i].classList.add('active');
  }
  show(0);
  setInterval(()=>{ idx = (idx+1)%imgs.length; show(idx); }, 3000);

  const form = document.getElementById('priceForm');
  const resultBox = document.getElementById('resultBox');
  const resetBtn = document.getElementById('resetBtn');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const area = Number(document.getElementById('area').value)||0;
    const beds = Number(document.getElementById('beds').value)||0;
    const baths = Number(document.getElementById('baths').value)||0;
    const location = document.getElementById('location').value;
    const age = Number(document.getElementById('age').value)||0;
    const parking = document.getElementById('parking').checked;
    const garden = document.getElementById('garden').checked;
    const furnished = document.getElementById('furnished').checked;
    if(area<=0){ resultBox.innerHTML='<p class="muted">Please enter a valid area.</p>'; return; }
    resultBox.innerHTML='<p class="muted">Predicting...</p>';
    setTimeout(()=>{
      const price = predict({area,beds,baths,location,age,parking,garden,furnished});
      resultBox.innerHTML = `<div style="text-align:center"><div style="font-size:22px;color:#7A122C;font-weight:800">₹ ${price.toLocaleString('en-IN')}</div><div class="muted">Estimated (demo)</div></div>`;
    },700);
  });
  resetBtn.addEventListener('click', ()=>{ form.reset(); document.getElementById('area').value=1000; document.getElementById('beds').value=3; document.getElementById('baths').value=2; resultBox.innerHTML='<p class="muted">No prediction yet. Enter details and click <strong>Predict Price</strong>.</p>'; });

  function predict(f){
    const baseByLocation = { central:7500, suburb:4800, outskirts:2500 };
    let price = (baseByLocation[f.location]||4000) * f.area;
    price *= 1 + (0.04*Math.max(0,f.beds-1));
    price *= 1 + (0.02*f.baths);
    price *= 1 - Math.min(0.25, f.age*0.01);
    if(f.parking) price += 150000;
    if(f.garden) price += 100000;
    if(f.furnished) price += 80000;
    price *= (0.95 + Math.random()*0.1);
    return Math.max(200000, Math.round(price/100)*100);
  }

  // contact form sample handler (no backend)
  document.getElementById('contactForm').addEventListener('submit',(e)=>{ e.preventDefault(); alert('Message sent — this is a demo.'); e.target.reset(); });
});
