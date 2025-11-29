
document.addEventListener('DOMContentLoaded', ()=>{
  // Simple frontend-only auth using localStorage
  const regForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  if(regForm){
    regForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const pw = document.getElementById('regPassword').value;
      const pw2 = document.getElementById('regPassword2').value;
      if(pw !== pw2){ alert('Passwords do not match'); return; }
      const users = JSON.parse(localStorage.getItem('es_users')||'{}');
      if(users[email]){ alert('An account with this email already exists.'); return; }
      users[email] = { name, pw };
      localStorage.setItem('es_users', JSON.stringify(users));
      alert('Account created. You can now login.');
      window.location.href = 'login.html';
      if(window.initSessionUI) setTimeout(initSessionUI, 200);
    });
  }

  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const pw = document.getElementById('loginPassword').value;
      const users = JSON.parse(localStorage.getItem('es_users')||'{}');
      if(users[email] && users[email].pw === pw){
        // success
        localStorage.setItem('es_current_user', JSON.stringify({ email, name: users[email].name }));
        alert('Login successful — redirecting to Demo');
        window.location.href = 'index.html#getstarted';
        if(window.initSessionUI) setTimeout(initSessionUI, 200);
      } else {
        alert('Invalid credentials. Try registering first.');
      }
    });
  }
});
