let items = [];
let customers = [];
let editingIndex = null;

function addItem() {
    const n = document.getElementById('name').value;
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
    if (total <= 0) {
        alert("No items in order!");
        return;
    }

    const summary = items.map(it => `${it.qty}x ${it.name}`).join(", ");

    if (editingIndex !== null) {
        // Update existing customer
        customers[editingIndex].summary = summary;
        customers[editingIndex].total = total;
        editingIndex = null;
    } else {
        // New customer
        customers.push({ id: customers.length + 1, summary, total });
    }

    renderCustomers();
    clearItems();
}

function renderCustomers() {
    const list = document.getElementById('customerList');
    const select = document.getElementById('customerSelect');
    list.innerHTML = '';
    select.innerHTML = '<option value="">-- Select --</option>';

    let daily = 0;
    customers.forEach((c, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${c.id}</td><td>${c.summary}</td><td>${c.total.toFixed(2)}</td>`;
        list.appendChild(tr);

        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Customer ${c.id}`;
        select.appendChild(opt);

        daily += c.total;
    });

    document.getElementById('dailyTotal').textContent = daily.toFixed(2);
}

function editCustomer() {
    const select = document.getElementById('customerSelect');
    const idx = parseInt(select.value);
    if (isNaN(idx)) return;

    editingIndex = idx;
    const c = customers[idx];

    // load that customer’s order back into items
    // ⚠ since we only stored summary text, we can’t fully reconstruct items
    // Instead, treat it as “add new items to adjust total”
    items = [];
    render();
    alert(`Now editing Customer ${c.id}. Add more items and Close Bill to update.`);
}

function clearDaily() {
    customers = [];
    renderCustomers();
}
