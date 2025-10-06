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

// ✅ FULLY FIXED: Works for editing any customer (2, 3, etc.)
function closeBill() {
    const total = render();
    if (total <= 0) {
        alert("No items in order!");
        return;
    }

    if (editingIndex !== null) {
        // Editing existing customer
        const customer = customers[editingIndex];

        // Merge new items into existing ones
        customer.items.push(...items);

        // Update summary and total
        customer.total += total;
        customer.summary = customer.items
            .map(it => `${it.qty}x ${it.name}`)
            .join(", ");

        alert(`✅ Updated Customer ${customer.id}'s order.`);
        editingIndex = null;
    } else {
        // New customer
        const summary = items.map(it => `${it.qty}x ${it.name}`).join(", ");
        customers.push({
            id: customers.length + 1,
            items: [...items],
            summary,
            total
        });
        alert(`✅ New Customer ${customers.length} added.`);
    }

    renderCustomers();
    clearItems();
}

function renderCustomers() {
    const list = document.getElementById('customerList');
    const select = document.getElementById('customerSelect');
    list.innerHTML = '';
    select.innerHTML = '<option value="">-- Select Customer --</option>';

    let daily = 0;
    customers.forEach((c, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id}</td>
            <td>${c.summary}</td>
            <td>${c.total.toFixed(2)} DKK</td>`;
        list.appendChild(tr);

        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Customer ${c.id}`;
        select.appendChild(opt);

        daily += c.total;
    });

    document.getElementById('dailyTotal').textContent = daily.toFixed(2);
}

// ✅ Works for ANY customer (1, 2, 3...)
function editCustomer() {
    const select = document.getElementById('customerSelect');
    const idx = parseInt(select.value);

    if (isNaN(idx)) {
        alert("Please select a customer to edit!");
        return;
    }

    editingIndex = idx;
    const c = customers[idx];
    alert(`✏️ You are now editing Customer ${c.id}. Add more items and press Close Bill to update.`);
}

function clearDaily() {
    if (!confirm("Are you sure you want to clear the entire day?")) return;
    customers = [];
    renderCustomers();
}
