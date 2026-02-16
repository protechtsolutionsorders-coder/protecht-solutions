const products = [
    {
        id: "rvs-304-3000x1500",
        title: "Standard Backsplash AISI 304",
        price: 369.99,
        image: "images/rvs-spec-sheet.jpg",
        material: "Stainless Steel AISI 304 - Brushed Finish",
        desc: "Professional-grade stainless steel backsplash. Heat-resistant, corrosion-resistant, and easy to clean.\n\nSize: 3000 x 1500 mm\nThickness: 1.0 mm\nFinish: Brushed"
    },
    {
        id: "rvs-316-3000x1500",
        title: "Premium Backsplash AISI 316",
        price: 499.99,
        image: "images/rvs-spec-sheet.jpg",
        material: "Stainless Steel AISI 316 - Marine Grade",
        desc: "Highest corrosion resistance. Ideal for coastal areas or high-humidity environments.\n\nSize: 3000 x 1500 mm\nThickness: 1.0 mm\nFinish: Brushed"
    },
    {
        id: "rvs-304-2000x1000",
        title: "Compact Backsplash AISI 304",
        price: 249.99,
        image: "images/rvs-spec-sheet.jpg",
        material: "Stainless Steel AISI 304 - Brushed Finish",
        desc: "Perfect for smaller kitchens or accents. Same industrial quality in a compact size.\n\nSize: 2000 x 1000 mm\nThickness: 1.0 mm\nFinish: Brushed"
    }
];

// State
let cart = JSON.parse(localStorage.getItem('metallum_apple_cart')) || [];
const stripe = Stripe('pk_live_51SzzzzQECx6xOqcU366GElFvHtQ2ZYIUpj1OCbBXcISlsV1CbOFEE1IEEU8AXpVIpuVBCWZIlOotOEFYIs0ojOSq00orS8vc5b');
// DOM
const productGrid = document.getElementById('product-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total-price');

// Init
function init() {
    renderShelf();
    updateCartUI();
    handleSuccess();

    // Listeners ...
    setupListeners();
    checkUrlParams();
}

function handleSuccess() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true' && params.get('session_id')) {
        const sessionId = params.get('session_id');

        // Notify server to verify session and send email (Fallback for local dev)
        fetch(`/verify-session/${sessionId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log("Order verified and email triggered.");
                    alert("¡Gracias por tu compra! Hemos enviado un correo de confirmación a benjazpz@gmail.com");
                }
            })
            .catch(err => console.error("Verification failed:", err));

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
        alert("Payment Successful! Thank you for your order.");
        localStorage.removeItem('metallum_apple_cart');
        cart = [];
        updateCartUI();
        window.history.replaceState(null, '', window.location.pathname);
    }
    if (urlParams.get('canceled')) {
        alert("Payment Canceled.");
        window.history.replaceState(null, '', window.location.pathname);
    }
}

// Render Products (Apple Shelf Style)
function renderShelf() {
    productGrid.innerHTML = products.map(p => `
        <div class="product-item">
            <h3 class="p-title">${p.title}</h3>
            <p class="p-price">From $${p.price}</p>
            <img src="${p.image}" alt="${p.title}">
            <div>
                <button class="btn-buy-small" onclick="openModal('${p.id}')">Buy</button>
            </div>
        </div>
    `).join('');
}

// Modal
window.openModal = function (id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    document.getElementById('modal-img').src = p.image;
    document.getElementById('modal-title').innerText = p.title;
    document.getElementById('modal-price').innerText = `$${p.price.toFixed(2)}`;
    document.getElementById('modal-desc').innerText = p.desc;
    document.getElementById('modal-material').innerText = p.material;

    const modal = document.getElementById('product-modal');
    modal.classList.add('active');

    document.getElementById('modal-add-btn').onclick = () => {
        addToCart(p);
        closeModal();
        setTimeout(openCart, 300); // Wait for modal fade out
    };
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
}

// Cart Logic
function addToCart(product) {
    const existing = cart.find(x => x.id === product.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('metallum_apple_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalQty = cart.reduce((a, b) => a + b.qty, 0);
    cartCount.innerText = totalQty;

    // Hide count if 0
    cartCount.style.display = totalQty > 0 ? 'inline-block' : 'none';

    if (cart.length === 0) {
        document.getElementById('cart-items').innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Your bag is empty.</p>';
        cartTotal.innerText = "$0.00";
    } else {
        document.getElementById('cart-items').innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}">
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="font-weight:600;">${item.title}</span>
                        <span style="font-weight:600;">$${item.price}</span>
                    </div>
                    <div style="font-size:0.9rem; color:#888;">Qty: ${item.qty}</div>
                </div>
                <div style="cursor:pointer; color:#4f46e5; font-size:0.9rem;" onclick="removeFromCart('${item.id}')">Remove</div>
            </div>
        `).join('');

        const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
        cartTotal.innerText = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }
}

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
}

// Listeners
function setupListeners() {
    document.querySelector('.close-modal').onclick = closeModal;
    document.querySelector('.close-cart').onclick = closeCart;
    cartOverlay.onclick = closeCart;
    document.getElementById('cart-btn').onclick = (e) => { e.preventDefault(); openCart(); };


    // Real Stripe Checkout
    document.getElementById('checkout-btn').onclick = async () => {
        if (cart.length === 0) return alert("Your bag is empty.");
        const btn = document.getElementById('checkout-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Processing...';
        btn.disabled = true;

        try {
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart: cart })
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Payment Error: " + (data.error || "Unknown Error"));
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        } catch (err) {
            console.error(err);
            alert("Could not connect to server. Is it running?");
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

// Global
window.removeFromCart = removeFromCart;
document.addEventListener('DOMContentLoaded', init);
