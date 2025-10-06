let items = [];
let customers = [];
let editingIndex = null;

function addItem() {
    const n = document.getElementById('name').value.trim();
    const p = parseFloat(document.getElementById('price').value);
    const q = parseInt(document.getElementById('qty').value);

    if (!n || isNaN(p) || isNaN(q)) return;

    items.push({ id: Date.now(), name: n, price: p, qty: q });
    render();
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('qty').value = 1;
}

function removeItem(id) {
    items = items.filter(it => it.id !== id);
    render();
}

function render() {
    const list = document.getElementById('orderList');
    list.innerHTML = '';
    let total = 0;

    items.forEach(it => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${it.name}</td>
      <td>${it.qty}</td>
      <td>${it.price.toFixed(2)}</td>
      <td>${(it.qty * it.price).toFixed(2)}</td>
      <td><button onclick="removeItem(${it.id})">❌</button></td>`;
        list.appendChild(tr);
        total += it.qty * it.price;
    });

    document.getElementById('grand').textContent = total.toFixed(2);
    return total;
}

function clearItems() {
    items = [];
    render();
}

function closeBill() {
    const total = render();
    if (total <= 0) return;

    if (editingIndex !== null) {
        const c = customers[editingIndex];
        c.items.push(...items);
        c.total += total;
        editingIndex = null;
    } else {
        customers.push({
            id: customers.length + 1,
            items: [...items],
            total
        });
    }

    renderCustomers();
    clearItems();
}

function renderCustomers() {
    const list = document.getElementById('customerList');
    const select = document.getElementById('customerSelect');
    list.innerHTML = '';
    select.innerHTML = '<option value="">-- Select Customer --</option>';

    customers.forEach((c, i) => {
        const tr = document.createElement('tr');
        const receipt = c.items
            .map(it => `• ${it.qty}x ${it.name} (${(it.qty * it.price).toFixed(2)} DKK)`)
            .join('\n');
        tr.innerHTML = `
      <td>${c.id}</td>
      <td class="receipt">${receipt}</td>
      <td>${c.total.toFixed(2)} DKK</td>`;
        list.appendChild(tr);

        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Customer ${c.id}`;
        select.appendChild(opt);
    });
}

function editCustomer() {
    const select = document.getElementById('customerSelect');
    const idx = parseInt(select.value);
    if (isNaN(idx)) return;
    editingIndex = idx;
    // optional: show a tiny inline status instead of a popup
    const s = document.getElementById('status');
    if (s) s.textContent = `Editing Customer ${customers[idx].id}… add items then press Close Bill`;
}


function clearDaily() {
    customers = [];
    renderCustomers();
}

