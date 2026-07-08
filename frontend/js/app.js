document.addEventListener('DOMContentLoaded', () => {
  const authForm = document.getElementById('authForm');
  const isDashboard = document.body.classList.contains('dashboard-body');

  if (!isDashboard && authForm) {
    // Auth View Operations
    let isLoginMode = true;
    const toggleLoginBtn = document.getElementById('toggleLoginBtn');
    const toggleRegisterBtn = document.getElementById('toggleRegisterBtn');
    const usernameGroup = document.getElementById('usernameGroup');
    const roleGroup = document.getElementById('roleGroup');
    const submitBtn = document.getElementById('submitBtn');

    toggleRegisterBtn.addEventListener('click', () => {
      isLoginMode = false;
      usernameGroup.classList.remove('hidden');
      roleGroup.classList.remove('hidden');
      toggleRegisterBtn.classList.add('active');
      toggleLoginBtn.classList.remove('active');
    });

    toggleLoginBtn.addEventListener('click', () => {
      isLoginMode = true;
      usernameGroup.classList.add('hidden');
      roleGroup.classList.add('hidden');
      toggleLoginBtn.classList.add('active');
      toggleRegisterBtn.classList.remove('active');
    });

    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const messageEl = document.getElementById('authMessage');

      try {
        if (isLoginMode) {
          const data = await fetchAPI('/auth/login', 'POST', { email, password });
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.href = 'dashboard.html';
        } else {
          const username = document.getElementById('username').value;
          const role = document.getElementById('role').value;
          await fetchAPI('/auth/register', 'POST', { username, email, password, role });
          messageEl.style.color = 'var(--success)';
          messageEl.innerText = 'Registration profile deployed. Proceeding to toggle login.';
          toggleLoginBtn.click();
        }
      } catch (err) {
        messageEl.style.color = 'var(--danger)';
        messageEl.innerText = err.message;
      }
    });
  }

  if (isDashboard) {
    // Dashboard Core Business View Actions
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) window.location.href = 'index.html';

    document.getElementById('userBadge').innerText = `Active Session: ${user.username} (${user.role})`;
    if (user.role === 'admin') document.getElementById('adminPanel').classList.remove('hidden');

    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'index.html';
    });

    const loadInventory = async () => {
      try {
        const tools = await fetchAPI('/tools');
        const tbody = document.getElementById('inventoryBody');
        tbody.innerHTML = '';

        tools.forEach(tool => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${tool.id}</td>
            <td>${tool.name}</td>
            <td>${tool.category}</td>
            <td class="status-${tool.status}">${tool.status}</td>
            <td>${tool.available_qty} / ${tool.total_qty}</td>
            <td>${tool.location_bin}</td>
            <td>
              <button onclick="handleAllocation(${tool.id}, 'checkout')" ${tool.available_qty === 0 ? 'disabled' : ''}>Checkout</button>
              <button onclick="handleAllocation(${tool.id}, 'return')" ${tool.available_qty === tool.total_qty ? 'disabled' : ''} style="background-color: var(--text-muted)">Return</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      } catch (err) {
        alert('Error rendering inventory matrix sequence: ' + err.message);
      }
    };

    window.handleAllocation = async (id, action) => {
      try {
        await fetchAPI('/tools/allocation', 'POST', { id, action });
        loadInventory();
      } catch (err) {
        alert(err.message);
      }
    };

    document.getElementById('addToolForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('toolName').value;
      const category = document.getElementById('toolCategory').value;
      const total_qty = document.getElementById('toolQty').value;
      const location_bin = document.getElementById('toolBin').value;

      try {
        await fetchAPI('/tools', 'POST', { name, category, total_qty, location_bin });
        document.getElementById('addToolForm').reset();
        loadInventory();
      } catch (err) {
        alert(err.message);
      }
    });

    loadInventory();
  }
});
