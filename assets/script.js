// --- MASTER PRODUCT DATABASE ---
const masterDB = [
    // BOOKS
    { id: 101, name: "Engineering Math I", price: 450, mrp: 600, cat: "books", subcat: "firstyear", desc: "Comprehensive guide for First Year students.", mfd: "08/2024", exp: "N/A", img: "assets/eng maths.webp" },
    { id: 202, name: "DBMS Guide", author: "N. Karumanchi", price: 550, mrp: 700, cat: "books", subcat: "cse", desc: "Database Management System.", mfd: "2023", img: "assets/dbms.jpg" },
    { id: 203, name: "Electronic Devices", author: "Boylestad", price: 720, mrp: 950, cat: "books", subcat: "ece", desc: "Circuit Theory.", mfd: "11th Ed", img: "assets/digital.jpg" },
    { id: 204, name: "GATE CSE 2026", author: "Made Easy", price: 890, mrp: 1200, cat: "books", subcat: "prep", desc: "Solved papers.", mfd: "2025", img: "assets/gate.jpg" },
    { id: 205, name: "Python Crash Course", author: "E. Matthes", price: 450, mrp: 600, cat: "books", subcat: "cse", desc: "Hands-on intro.", mfd: "3rd Ed", img: "assets/python.png" },
    
    // STUDY
    { id: 102, name: "Drafting Kit Pro", price: 350, mrp: 500, cat: "study", subcat: "art", desc: "Complete geometry and drafting set.", mfd: "01/2025", exp: "N/A", img: "assets/draftingkit.jpg" },
    { id: 401, name: "Casio Classwiz fx-991EX", price: 1200, mrp: 1400, cat: "study", subcat: "tech", desc: "Scientific calculator.", brand: "Casio", war: "3 Years", img: "assets/calculator.jpg" },
    { id: 402, name: "Classmate Pulse", price: 210, mrp: 250, cat: "study", subcat: "paper", desc: "Spiral notebook.", brand: "Classmate", img: "assets/pulse.webp" },
    { id: 403, name: "Pencil Black", price: 40, mrp: 50, cat: "study", subcat: "writing", desc: "0.7 mm lead.", brand: "Pentel", img: "assets/pencil.jpg" },
    { id: 406, name: "Neon Highlighters", price: 120, mrp: 150, cat: "study", subcat: "writing", desc: "Pack of 5.", brand: "Faber Castell", img: "assets/neon.webp" },

    // FOOD
    { id: 103, name: "Cold Brew Coffee", price: 120, mrp: 150, cat: "food", subcat: "drinks", desc: "Black coffee, no sugar.", mfd: "11/2025", exp: "12/2025", img: "assets/cofee.webp" },
    { id: 301, name: "Spicy Ramen Cup", price: 65, mrp: 75, cat: "food", subcat: "spicy", desc: "Instant hot chicken.", mfd: "10/2025", exp: "04/2026", img: "assets/ramen.webp" },
    { id: 302, name: "Red Bull Energy", price: 125, mrp: 140, cat: "food", subcat: "drinks", desc: "Vitalizes body.", mfd: "09/2025", exp: "09/2026", img: "assets/redbull.webp" },
    { id: 304, name: "Classic Salted Chips", price: 30, mrp: 40, cat: "food", subcat: "chips", desc: "Crispy salted.", mfd: "11/2025", exp: "02/2026", img: "assets/lays.jpg" },
    { id: 305, name: "Dark Chocolate 70%", price: 150, mrp: 200, cat: "food", subcat: "sweet", desc: "Rich chocolate.", mfd: "08/2025", exp: "08/2026", img: "assets/darkc.webp" },
    { id: 306, name: "Protein Bar", price: 100, mrp: 120, cat: "food", subcat: "sweet", desc: "20g Protein.", mfd: "10/2025", exp: "04/2026", img: "assets/protien.webp" },

    // XEROX
    { id: 501, name: "B&W Print (Single)", price: 2, cat: "xerox", subcat: "doc", desc: "Laser print.", paper: "75 GSM", time: "Instant", img: "assets/bw.png" },
    { id: 502, name: "Color Print (Premium)", price: 10, cat: "xerox", subcat: "doc", desc: "Color print.", paper: "80 GSM", time: "Instant", img: "assets/color.jpg" },
    { id: 503, name: "Spiral Binding", price: 40, cat: "xerox", subcat: "bind", desc: "Front sheet incl.", paper: "Plastic", time: "10 Mins", img: "assets/spiral.png" },
    { id: 506, name: "Lamination (A4)", price: 20, cat: "xerox", subcat: "doc", desc: "Protection.", paper: "Plastic", time: "5 Mins", img: "assets/lamin.jpg" }
];

let cart = JSON.parse(localStorage.getItem('genz_cart') || '[]');
let user = JSON.parse(localStorage.getItem('genz_user') || 'null');
let products = [];
let currentCategory = 'all';
let isLoginMode = true;
const DELIVERY_FEE = 40;

document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.getAttribute('data-page');
    if (page === 'home') products = masterDB.slice(0, 6);
    else if (page === 'books') products = masterDB.filter(p => p.cat === 'books');
    else if (page === 'food') products = masterDB.filter(p => p.cat === 'food');
    else if (page === 'study') products = masterDB.filter(p => p.cat === 'study');
    else if (page === 'xerox') products = masterDB.filter(p => p.cat === 'xerox');

    renderGrid();
    updateCartUI();
    checkLoginStatus();
    init3DTilt();
});

function renderGrid(searchTerm = "") {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const filtered = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const authorMatch = p.author ? p.author.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const matchesCat = currentCategory === 'all' || p.subcat === currentCategory;
        return (nameMatch || authorMatch) && matchesCat;
    });
    
    if(filtered.length === 0) {
        grid.innerHTML = '<div style="color:var(--text-secondary); grid-column: 1/-1; text-align:center;">No items found.</div>';
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        const qty = cartItem ? cartItem.qty : 0;
        let btnHtml = qty > 0 ? 
            `<div class="qty-wrapper"><button class="qty-btn" onclick="updateQty(${p.id}, -1)">-</button><span class="qty-display">${qty}</span><button class="qty-btn" onclick="updateQty(${p.id}, 1)">+</button></div>` :
            `<button class="add-btn-init" onclick="addToCart(${p.id})">ADD</button>`;

        return `
        <div class="product-card">
            <div class="product-img-box" onclick="openProductModal(${p.id})"><img src="${p.img}" alt="${p.name}"></div>
            <div class="card-info">
                <div class="card-cat">${p.cat.toUpperCase()}</div>
                <h3 class="card-title" onclick="openProductModal(${p.id})">${p.name}</h3>
                ${p.author ? `<div class="card-author">By ${p.author}</div>` : ''}
            </div>
            <div class="price-row"><span style="font-weight:700;">₹${p.price}</span>${btnHtml}</div>
        </div>`;
    }).join('');
}

function viewAllProducts() {
    products = masterDB;
    document.querySelector('.section-title').innerText = "All Products";
    document.querySelector('.section-header a').style.display = 'none';
    renderGrid();
}

function filterCategory(subcat, btn) {
    currentCategory = subcat;
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    renderGrid(document.getElementById('search-input').value);
}

function filterProducts() {
    renderGrid(document.getElementById('search-input').value);
}

function addToCart(id) {
    const p = masterDB.find(x => x.id === id);
    if (!p) return;
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty++; else cart.push({ ...p, qty: 1 });
    saveCart(); refreshApp(); showToast("Added to Cart");
}

function updateQty(id, change) {
    const idx = cart.findIndex(c => c.id === id);
    if (idx === -1) return;
    cart[idx].qty += change;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart(); refreshApp();
}

function refreshApp() {
    if(document.getElementById('product-grid')) renderGrid(document.getElementById('search-input').value);
    updateCartUI();
}

function saveCart() { localStorage.setItem('genz_cart', JSON.stringify(cart)); }

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if(countEl) countEl.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    
    if(container) {
        if(cart.length === 0) {
            container.innerHTML = `<div style="text-align:center; margin-top:50px; color:#aaa;">Empty.</div>`;
            if(totalEl) totalEl.innerText = '₹0';
            return;
        }
        container.innerHTML = cart.map(item => `
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px; align-items:center;">
                <div style="display:flex; gap:10px; align-items:center;">
                    <img src="${item.img}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
                    <div><div style="font-weight:700; font-size:0.9rem;">${item.name}</div><div style="font-size:0.8rem; color:#666;">₹${item.price} x ${item.qty}</div></div>
                </div>
                <div class="qty-wrapper"><button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button><span class="qty-display">${item.qty}</span><button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button></div>
            </div>`).join('');
        if(totalEl) totalEl.innerText = '₹' + cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Student Login" : "Create Account";
    document.getElementById('auth-action-btn').innerText = isLoginMode ? "LOGIN" : "SIGN UP";
    document.getElementById('auth-toggle-link').innerHTML = isLoginMode ? `Don't have an account? <span onclick="toggleAuthMode()">Sign up</span>` : `Already have account? <span onclick="toggleAuthMode()">Login</span>`;
}

function handleAuth() {
    const email = document.getElementById('auth-email').value;
    if(!email) return alert("Enter email");
    user = { email: email };
    localStorage.setItem('genz_user', JSON.stringify(user));
    checkLoginStatus(); closeModal('auth-modal'); showToast("Success!");
}

function checkLoginStatus() {
    const btn = document.getElementById('nav-login-btn');
    if(!btn) return;
    if(user) {
        btn.innerText = "Logout"; btn.classList.add('logged-in');
        btn.onclick = () => { user = null; localStorage.removeItem('genz_user'); checkLoginStatus(); showToast("Logged Out"); };
    } else {
        btn.innerText = "Login"; btn.classList.remove('logged-in');
        btn.onclick = () => { isLoginMode=true; toggleAuthMode(); toggleAuthMode(); openAuthModal(); };
    }
}

function startCheckout() {
    if(cart.length === 0) return alert("Empty Cart");
    if(!user) { toggleCart(); openAuthModal(); return; }
    const sub = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('co-subtotal').innerText = '₹' + sub;
    document.getElementById('co-delivery').innerText = '₹' + DELIVERY_FEE;
    document.getElementById('co-final').innerText = '₹' + (sub + DELIVERY_FEE);
    toggleCart(); document.getElementById('checkout-modal').classList.add('active');
}

function selectPayment(el) {
    document.querySelectorAll('.payment-option').forEach(e => { e.classList.remove('selected'); e.querySelector('input').checked = false; });
    el.classList.add('selected'); el.querySelector('input').checked = true;
}

function placeOrder() {
    if(!document.getElementById('co-address').value) return alert("Address required");
    const btn = document.getElementById('place-order-btn');
    btn.innerText = "PROCESSING..."; btn.disabled = true;
    setTimeout(() => {
        alert("Order Placed!"); cart = []; saveCart(); refreshApp(); closeModal('checkout-modal'); btn.innerText = "PLACE ORDER"; btn.disabled = false;
    }, 1500);
}

function openProductModal(id) {
    const p = masterDB.find(x => x.id === id); if(!p) return;
    document.getElementById('pm-img').src = p.img;
    document.getElementById('pm-title').innerText = p.name;
    document.getElementById('pm-cat').innerText = p.cat;
    document.getElementById('pm-desc').innerText = p.desc;
    document.getElementById('pm-price').innerText = `₹${p.price}`;
    document.getElementById('pm-mrp').innerText = `₹${p.mrp || p.price + 50}`;
    
    const setMeta = (l, v, txt, val) => { 
        const r = document.getElementById(l).parentElement; 
        if(val) { document.getElementById(l).innerText = txt; document.getElementById(v).innerText = val; r.style.display = 'block'; } 
        else r.style.display = 'none'; 
    };

    if(p.cat === 'xerox') { setMeta('pm-l1','pm-v1','Paper',p.paper); setMeta('pm-l2','pm-v2','Time',p.time); }
    else if(p.cat === 'books') { setMeta('pm-l1','pm-v1','Year',p.mfd); setMeta('pm-l2','pm-v2','Pub',p.pub); }
    else if(p.cat === 'study') { setMeta('pm-l1','pm-v1','Brand',p.brand); setMeta('pm-l2','pm-v2','Warranty',p.war); }
    else { setMeta('pm-l1','pm-v1','Mfd',p.mfd); setMeta('pm-l2','pm-v2','Exp',p.exp); }

    const btn = document.getElementById('pm-add-btn');
    if(btn) { btn.onclick = () => { addToCart(p.id); closeModal('product-modal'); }; btn.innerText = p.cat === 'xerox' ? "ADD TO JOB" : "ADD TO CART"; }
    document.getElementById('product-modal').classList.add('active');
}

function openAuthModal() { document.getElementById('auth-modal').classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function toggleCart() { document.getElementById('cart-drawer').classList.toggle('open'); document.getElementById('drawer-overlay').classList.toggle('active'); }
function showToast(m) { const t = document.getElementById('toast'); t.innerText = m; t.classList.add('active'); setTimeout(() => t.classList.remove('active'), 2000); }
function init3DTilt() {
    const w = document.querySelector('.hero-3d-wrapper'), c = document.querySelector('.tilt-card');
    if(!w || !c) return;
    w.addEventListener('mousemove', e => {
        const r = w.getBoundingClientRect(), x = (e.clientX - r.left - r.width/2)/20, y = (e.clientY - r.top - r.height/2)/-20;
        c.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });
    w.addEventListener('mouseleave', () => c.style.transform = `rotateY(0deg) rotateX(0deg)`);
}
function simulateUpload() {
    const z = document.querySelector('.upload-zone'); if(!z) return;
    z.innerHTML = `<strong>Uploading...</strong>`;
    setTimeout(() => { showToast("Uploaded!"); z.innerHTML = `<strong>doc.pdf</strong>`; }, 1500);
}