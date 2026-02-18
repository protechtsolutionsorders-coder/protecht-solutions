const translations = {
    en: {
        nav_overview: "Overview",
        nav_products: "Products",
        nav_installation: "Installation",
        nav_faq: "FAQ",
        nav_contact: "Contact",
        hero_title: "ProTech Solutions<br><span style='font-size: 0.7em; font-weight: 300;'>Premium Stainless Steel</span>",
        hero_subtitle: "Professional-grade stainless steel backsplashes for modern kitchens.",
        hero_cta: "View Products <i class='fas fa-chevron-right'></i>",
        hero_desc: "High-quality AISI 304 brushed finish for professional kitchens.",
        footer_rights: "All rights reserved.",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms of Service",
        footer_legal: "Legal Notice",
        cart_title: "Your Order",
        cart_total: "Total",
        checkout_btn: "Proceed to Checkout",
        size_label: "Size",
        material_label: "Material",
        // Product specific
        product_title: "Professional AISI 304 Stainless Steel Sheet",
        product_desc: "Premium AISI 304 stainless steel backsplash sheet with professional dual finish. One side features a refined brushed texture, the other a mirror-polished surface. Laser protection film applied on polished side for scratch-free delivery. Certified for professional kitchen environments and direct food contact.",
        feat_iso: "ISO Standard",
        feat_heat: "Heat Resistant",
        feat_food: "Food Certified",
        feat_dual: "Dual Surface",
        mat_desc: "1 Side Brushed / 1 Side Polished Mirror"
    },
    es: {
        nav_overview: "Inicio",
        nav_products: "Productos",
        nav_installation: "Instalación",
        nav_faq: "Preguntas",
        nav_contact: "Contacto",
        hero_title: "ProTech Solutions<br><span style='font-size: 0.7em; font-weight: 300;'>Acero Inox Premium</span>",
        hero_subtitle: "Planchas de acero inoxidable profesional para cocinas modernas.",
        hero_cta: "Ver Productos <i class='fas fa-chevron-right'></i>",
        hero_desc: "Acabado cepillado AISI 304 de alta calidad para cocinas profesionales.",
        footer_rights: "Todos los derechos reservados.",
        footer_privacy: "Política de Privacidad",
        footer_terms: "Términos de Servicio",
        footer_legal: "Aviso Legal",
        cart_title: "Tu Pedido",
        cart_total: "Total",
        checkout_btn: "Finalizar Compra",
        size_label: "Medida",
        material_label: "Material",
        // Product specific
        product_title: "Plancha Inox AISI 304 Profesional",
        product_desc: "Plancha antisalpicaduras de acero inoxidable AISI 304 premium con doble acabado profesional. Una cara con textura cepillada refinada, la otra pulida espejo. Film protector láser en la cara pulida. Certificado para entornos de cocina profesional y contacto con alimentos.",
        feat_iso: "Estándar ISO",
        feat_heat: "Resistente al Calor",
        feat_food: "Certificado Alimentario",
        feat_dual: "Doble Acabado",
        mat_desc: "1 Cara Cepillada / 1 Cara Espejo"
    },
    nl: {
        nav_overview: "Overzicht",
        nav_products: "Producten",
        nav_installation: "Installatie",
        nav_faq: "FAQ",
        nav_contact: "Contact",
        hero_title: "ProTech Solutions<br><span style='font-size: 0.7em; font-weight: 300;'>Premium RVS Staal</span>",
        hero_subtitle: "Professionele RVS achterwanden voor moderne keukens.",
        hero_cta: "Bekijk Producten <i class='fas fa-chevron-right'></i>",
        hero_desc: "Hoogwaardige AISI 304 geborstelde afwerking voor professionele keukens.",
        footer_rights: "Alle rechten voorbehouden.",
        footer_privacy: "Privacybeleid",
        footer_terms: "Algemene Voorwaarden",
        footer_legal: "Wettelijke Vermelding",
        cart_title: "Uw Bestelling",
        cart_total: "Totaal",
        checkout_btn: "Afrekenen",
        size_label: "Afmeting",
        material_label: "Materiaal",
        // Product specific
        product_title: "Professionele AISI 304 RVS Plaat",
        product_desc: "Premium AISI 304 RVS achterwand met professionele dubbele afwerking. Eén zijde met verfijnde geborstelde structuur, de andere spiegelgepolijst. Laserbeschermfolie aangebracht op gepolijste zijde. Gecertificeerd voor professionele keukens en voedselcontact.",
        feat_iso: "ISO Standaard",
        feat_heat: "Hittebestendig",
        feat_food: "Voedselveilig",
        feat_dual: "Dubbel Oppervlak",
        mat_desc: "1 Zijde Geborsteld / 1 Zijde Spiegel"
    }
};

let currentLang = localStorage.getItem('protech_lang') || 'en';

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('protech_lang', lang);
    document.documentElement.lang = lang;

    // Update active flag
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(lang));
    });

    // Update simple text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Update Product Data (Live)
    // We update the product array in memory so re-renders pick it up
    products[0].title = translations[lang].product_title;
    products[0].desc = translations[lang].product_desc;
    products[0].material = translations[lang].mat_desc;
    products[0].features[0].text = translations[lang].feat_iso;
    products[0].features[1].text = translations[lang].feat_heat;
    products[0].features[2].text = translations[lang].feat_food;
    products[0].features[3].text = translations[lang].feat_dual;

    // Refresh Views
    renderProducts();
    updateCart(); // Update cart text if needed (checkout button)
}

const products = [
    {
        id: "rvs-304-premium",
        title: "Professional AISI 304 Stainless Steel Sheet", // Will be overwritten by init

        price: 369.99,
        image: "images/rvs-spec-sheet.jpg",
        material: "1 Side Brushed / 1 Side Polished Mirror",
        desc: "Premium AISI 304 stainless steel backsplash sheet with professional dual finish. One side features a refined brushed texture, the other a mirror-polished surface. Laser protection film applied on polished side for scratch-free delivery. Certified for professional kitchen environments and direct food contact.",
        features: [
            { icon: "fa-certificate", text: "ISO Standard" },
            { icon: "fa-fire-burner", text: "Heat Resistant" },
            { icon: "fa-utensils", text: "Food Certified" },
            { icon: "fa-universal-access", text: "Dual Surface" }
        ],
        sizes: [
            { label: "3000 x 1500 mm", area: "4.5 m²" },
            { label: "2000 x 1000 mm", area: "2.0 m²" }
        ],
        stock: 50
    }
];

let selectedSizeIndex = -1; // No preselection - user must choose
let currentOpenProductId = null;

// Load cart and FIX any items with undefined uniqueId
let cart = JSON.parse(localStorage.getItem('metallum_apple_cart')) || [];

// MIGRATION: Fix old cart items without uniqueId
cart = cart.map((item, index) => {
    if (!item.uniqueId || item.uniqueId === 'undefined') {
        const size = item.selectedSize || '3000x1500mm';
        item.uniqueId = `${item.id || 'product'}-${size.replace(/\s+/g, '')}-${Date.now()}-${index}`;
        console.log('Fixed cart item uniqueId:', item.uniqueId);
    }
    return item;
});

// Save fixed cart
localStorage.setItem('metallum_apple_cart', JSON.stringify(cart));
const stripe = Stripe('pk_live_51SzzzzQECx6xOqcU366GElFvHtQ2ZYIUpj1OCbBXcISlsV1CbOFEE1IEEU8AXpVIpuVBCWZIlOotOEFYIs0ojOSq00orS8vc5b');

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total-price');

// Customizer Elements
const custWidth = document.getElementById('cust-width');
const custHeight = document.getElementById('cust-height');
const custMaterial = document.getElementById('cust-material');
const valWidth = document.getElementById('cust-width-num');
const valHeight = document.getElementById('cust-height-num');
const priceDisplay = document.getElementById('cust-price');
const platePreview = document.getElementById('plate-preview');
const labelW = document.getElementById('label-w');
const labelH = document.getElementById('label-h');

// Initialize
function init() {
    renderShelf();
    updateCartUI();
    handleSuccess();
    initCustomizer();
    setupListeners();
    initScrollAnimations();
    setupLogoFallback();
}

function setupLogoFallback() {
    const logos = document.querySelectorAll('.brand-logo, .footer-brand img');
    logos.forEach(img => {
        img.onerror = () => {
            img.style.display = 'none';
            const parent = img.parentElement;
            if (parent) {
                const text = document.createElement('span');
                text.innerHTML = '<i class="fas fa-shield-alt"></i> ProTech Solutions';
                text.style.fontWeight = '600';
                text.style.fontSize = parent.classList.contains('logo') ? '1.2rem' : '1rem';
                if (parent.classList.contains('footer-brand')) text.style.color = '#fff';
                parent.insertBefore(text, img);
            }
        };
    });
}

function handleSuccess() {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (params.get('success') === 'true' && sessionId) {
        // Clear cart
        localStorage.removeItem('metallum_apple_cart');
        cart = [];
        updateCartUI();

        // Fetch session details to get shipping info
        fetch(`/session-details/${sessionId}`)
            .then(res => res.json())
            .then(data => {
                // Update shipping info in modal
                updateShippingInfo(data.shipping);

                // Show Professional Modal
                const successModal = document.getElementById('success-modal');
                if (successModal) {
                    successModal.classList.add('active');
                }
            })
            .catch(err => {
                console.error('Error fetching session:', err);
                // Show modal anyway, just without specific shipping details
                const successModal = document.getElementById('success-modal');
                if (successModal) {
                    successModal.classList.add('active');
                }
            });

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function updateShippingInfo(shipping) {
    const pickupBox = document.querySelector('.pickup-locations-box');
    if (!pickupBox || !shipping) return;

    const shippingName = shipping.name || '';
    const address = shipping.address;

    // Check if it's a pickup (no address or shipping option name contains "Pickup")
    const isPickup = !address || (shippingName && shippingName.toLowerCase().includes('pickup'));

    if (isPickup) {
        // Show pickup location based on which one was selected
        if (shippingName.includes('Mechelen') || shippingName.includes('Blarenberglaan')) {
            pickupBox.innerHTML = `
                <h3><i class="fas fa-location-dot"></i> Pickup Location</h3>
                <p class="pickup-addr">📍 Blarenberglaan 6, 2800 Mechelen (GGM Gastro)</p>
                <p style="margin-top: 10px; color: #666; font-size: 14px;">Your order will be ready for pickup in 3-5 business days.</p>
            `;
        } else if (shippingName.includes('Hechtel') || shippingName.includes('Overpelterbaan')) {
            pickupBox.innerHTML = `
                <h3><i class="fas fa-location-dot"></i> Pickup Location</h3>
                <p class="pickup-addr">📍 Overpelterbaan 66, 3941 Hechtel-EKSEL</p>
                <p style="margin-top: 10px; color: #666; font-size: 14px;">Your order will be ready for pickup in 3-5 business days.</p>
            `;
        }
    } else {
        // Show delivery address
        const addr = address;
        const fullAddress = `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.postal_code} ${addr.city}, ${addr.country}`;

        pickupBox.innerHTML = `
            <h3><i class="fas fa-truck"></i> Delivery Address</h3>
            <p class="pickup-addr">📦 ${fullAddress}</p>
            <p style="margin-top: 10px; color: #666; font-size: 14px;">Your order will be delivered in 3-5 business days.</p>
        `;
    }
}

window.closeSuccessModal = function () {
    document.getElementById('success-modal').classList.remove('active');
}

// Visual Customizer
function initCustomizer() {
    if (!custWidth) return;
    const custWidthNum = document.getElementById('cust-width-num');
    const custHeightNum = document.getElementById('cust-height-num');

    const updateUI = (source) => {
        let w, h;

        if (source === 'range') {
            w = parseInt(custWidth.value);
            h = parseInt(custHeight.value);
            custWidthNum.value = w;
            custHeightNum.value = h;
        } else {
            w = parseInt(custWidthNum.value) || 500;
            h = parseInt(custHeightNum.value) || 300;
            custWidth.value = w;
            custHeight.value = h;
        }

        const material = custMaterial.value;

        // Visual labels
        labelW.innerText = `${w}mm`;
        labelH.innerText = `${h}mm`;

        // Scale Visual Plate
        const scale = 0.1;
        platePreview.style.width = `${w * scale}px`;
        platePreview.style.height = `${h * scale}px`;

        // Price Calc (Aligned with Catalog: €85 per m2 for 304 Brushed + base €25 fee)
        const areaM2 = (w / 1000) * (h / 1000);
        const rate = material === '304' ? 85 : 85;
        const total = (areaM2 * rate) + 25;

        priceDisplay.innerText = `€${total.toFixed(2)}`;
    };

    custWidth.oninput = () => updateUI('range');
    custHeight.oninput = () => updateUI('range');
    custWidthNum.oninput = () => updateUI('num');
    custHeightNum.oninput = () => updateUI('num');
    custMaterial.onchange = () => updateUI('range');

    updateUI('range'); // Init call
}

window.requestCustomQuote = function () {
    const w = custWidth.value;
    const h = custHeight.value;
    const mat = custMaterial.options[custMaterial.selectedIndex].text;
    const price = priceDisplay.innerText;

    const subject = encodeURIComponent(`Bespoke Design Request: ${w}x${h}mm`);
    const body = encodeURIComponent(`I am interested in a custom backsplash:\n\nMaterial: ${mat}\nDimensions: ${w}mm x ${h}mm\nEstimated Price: ${price}\n\nPlease contact me to finalize.`);
    window.location.href = `mailto:protechtsolutions.orders@gmail.com?subject=${subject}&body=${body}`;
}

// Render Products
function renderShelf() {
    if (!productGrid) return;
    productGrid.innerHTML = products.map(p => `
        <div class="product-item stagger-item">
            ${p.stock < 20 ? '<span class="stock-badge">Low Stock</span>' : ''}
            <h3 class="p-title">${p.title}</h3>
            <p class="p-price">From €${p.price}</p>
            <img src="${p.image}" alt="${p.title}">
            <div>
                <button class="btn-buy-small" onclick="openModal('${p.id}')">Buy</button>
            </div>
        </div>
    `).join('');
}

// Modal
window.openModal = function (id) {
    currentOpenProductId = id;
    const p = products.find(x => x.id === id);
    if (!p) return;

    document.getElementById('modal-img').src = p.image;
    document.getElementById('modal-title').innerText = p.title;
    document.getElementById('modal-price').innerText = `€${p.price.toFixed(2)}`;
    document.getElementById('modal-desc').innerText = p.desc;
    document.getElementById('modal-material').innerText = p.material;

    // Features
    const featureContainer = document.getElementById('modal-features');
    if (p.features) {
        featureContainer.innerHTML = p.features.map(f => `
            <div class="feature-tag"><i class="fas ${f.icon}"></i> ${f.text}</div>
        `).join('');
    }

    // Render Size Options
    const sizeOptions = document.getElementById('size-options');
    sizeOptions.innerHTML = p.sizes.map((s, idx) => `
        <div class="variant-box ${idx === selectedSizeIndex ? 'active' : ''}" onclick="selectSize(${idx})">
            ${s.label}
        </div>
    `).join('');

    updateModalDimensions(p);

    // Update stock info
    const shippingInfo = document.querySelector('.shipping-info');
    if (p.stock < 20) {
        shippingInfo.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i> <span style="color: #ef4444; font-weight: 600;">Only ${p.stock} units left!</span>`;
    } else {
        shippingInfo.innerHTML = `<i class="fas fa-box"></i> In stock, ships: 1 business day`;
    }

    const modal = document.getElementById('product-modal');
    modal.classList.add('active');

    const modalAddBtn = document.getElementById('modal-add-btn');
    modalAddBtn.onclick = () => {
        // Check if size is selected
        const activeSize = document.querySelector('.variant-box.active');
        if (!activeSize) {
            // Scroll to size selector and highlight it
            const sizeSelector = document.getElementById('modal-variant-selector');
            if (sizeSelector) {
                sizeSelector.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Add pulsing animation to draw attention
                sizeSelector.style.animation = 'pulse 0.6s ease-in-out 2';
                setTimeout(() => {
                    sizeSelector.style.animation = '';
                }, 1200);
            }
            return; // Don't add to cart yet
        }
        // Size is selected, proceed with adding to cart
        window.addToCart();
    };

    // Initialize Modal Spin
    initModal3D();
}

window.closeModal = function () {
    document.getElementById('product-modal').classList.remove('active');
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('active');
}

window.selectSize = function (idx) {
    selectedSizeIndex = idx;
    const boxes = document.querySelectorAll('.variant-box');
    boxes.forEach((b, i) => {
        if (i === idx) b.classList.add('active');
        else b.classList.remove('active');
    });

    updateModalDimensions(products.find(p => p.id === currentOpenProductId));
}

function updateModalDimensions(p) {
    if (!p) return; // Guard clause

    // If no size selected yet, show placeholder
    if (selectedSizeIndex === -1 || !p.sizes[selectedSizeIndex]) {
        document.getElementById('modal-dims').innerHTML = `
            <span style="color: #888;">Select a size above</span>
        `;
        return;
    }

    const size = p.sizes[selectedSizeIndex];
    document.getElementById('modal-dims').innerHTML = `
        ${size.area} (${size.label}) <br> 
        <div class="bonus-tag">Includes Free Laser Film</div>
    `;
}

// Cart Logic
window.addToCart = function () {
    const p = products.find(prod => prod.id === currentOpenProductId);
    const size = p.sizes[selectedSizeIndex];

    // Add size to the item
    const cartItem = {
        ...p,
        selectedSize: size.label,
        uniqueId: `${p.id}-${size.label.replace(/\s+/g, '')}`
    };

    const existing = cart.find(item => item.uniqueId === cartItem.uniqueId);
    if (existing) {
        existing.qty++;
    } else {
        cartItem.qty = 1;
        cart.push(cartItem);
    }

    localStorage.setItem('metallum_apple_cart', JSON.stringify(cart));
    updateCartUI();
    closeModal();
    openCart();

    // Feedback Animation
    showToast('Added to bag');
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.classList.remove('pulse');
        void badge.offsetWidth; // Trigger reflow
        badge.classList.add('pulse');
    }
};

function showToast(msg) {
    let toast = document.getElementById('toast-feedback');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-feedback';
        toast.className = 'toast-feedback';
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 2500);
}

function initModal3D() {
    const visual = document.querySelector('.modal-visual');
    const img = document.getElementById('modal-img');
    if (!visual || !img) return;

    // Reset transform on start
    img.style.transform = `rotateY(0deg)`;

    visual.onmousemove = (e) => {
        const rect = visual.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // Calculate rotation based on horizontal position (Nike-style spin)
        // Mapping horizontal position to a -180 to 180 or -90 to 90 spin
        const percent = x / rect.width;
        const rotateY = (percent - 0.5) * 60; // 60 degree total swing for subtlety

        img.style.transform = `rotateY(${rotateY}deg) scale(1.05)`;
    };

    visual.onmouseleave = () => {
        img.style.transform = `rotateY(0deg) scale(1)`;
    };
}

function init3DEffects() {
    // Legacy removed for stability
}

function removeFromCart(id) {
    cart = cart.filter(x => x.uniqueId !== id);
    saveCart();
    updateCartUI();
}

window.updateQty = function (id, delta) {
    const item = cart.find(x => x.uniqueId === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
    } else {
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('metallum_apple_cart', JSON.stringify(cart));
}

function updateCartUI() {
    if (!cartCount || !cartTotal) return;
    const totalQty = cart.reduce((a, b) => a + b.qty, 0);
    cartCount.innerText = totalQty;
    cartCount.style.display = totalQty > 0 ? 'inline-block' : 'none';

    const itemsContainer = document.getElementById('cart-items');
    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Your bag is empty.</p>';
        cartTotal.innerText = "€0.00";
    } else {
        itemsContainer.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <img src="${item.image}">
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="font-weight:600;">${item.title}</span>
                        <span style="font-weight:600;">€${item.price.toFixed(2)}</span>
                    </div>
                    <div style="font-size:0.85rem; color:#888;">Size: ${item.selectedSize || 'Standard'}</div>
                    <div class="qty-controls" style="margin-top:8px;">
                        <button class="qty-btn" data-action="minus" data-id="${item.uniqueId}" type="button">-</button>
                        <span style="font-weight:600; min-width:20px; text-align:center;">${item.qty}</span>
                        <button class="qty-btn" data-action="plus" data-id="${item.uniqueId}" type="button">+</button>
                    </div>
                    <button class="remove-item" data-action="remove" data-id="${item.uniqueId}" type="button">Remove</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((a, b) => a + (b.price * b.qty), 0);
        cartTotal.innerText = `€${total.toFixed(2)}`;

        // RE-ATTACH event listeners after HTML update (CRITICAL FIX)
        attachCartListeners();
    }
}

// Separate function to attach cart listeners
function attachCartListeners() {
    const itemsContainer = document.getElementById('cart-items');
    if (!itemsContainer) return;

    // Remove old listener if exists
    const newContainer = itemsContainer.cloneNode(true);
    itemsContainer.parentNode.replaceChild(newContainer, itemsContainer);

    // Add fresh listener
    newContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const id = btn.dataset.id;
        const action = btn.dataset.action;

        console.log('Cart action:', action, id);

        if (action === 'plus') window.updateQty(id, 1);
        else if (action === 'minus') window.updateQty(id, -1);
        else if (action === 'remove') window.removeFromCart(id);
    });
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
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) closeBtn.onclick = closeModal;

    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) closeCartBtn.onclick = closeCart;

    if (cartOverlay) cartOverlay.onclick = closeCart;

    // Modal overlay click-to-close
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) modalOverlay.onclick = closeModal;

    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.onclick = (e) => { e.preventDefault(); openCart(); };
    }

    // Event Delegation for Cart (Fixes First Item Bug)
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const id = btn.dataset.id;
            const action = btn.dataset.action;

            console.log('Cart button clicked:', action, id); // Debug

            if (action === 'plus') window.updateQty(id, 1);
            else if (action === 'minus') window.updateQty(id, -1);
            else if (action === 'remove') window.removeFromCart(id);
        });
    }

    // Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = async () => {
            if (cart.length === 0) return alert("Your bag is empty.");
            const originalText = checkoutBtn.innerHTML;
            checkoutBtn.innerHTML = 'Processing...';
            checkoutBtn.disabled = true;

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
                    alert("Error: " + (data.error || "Please try again later."));
                    checkoutBtn.innerHTML = originalText;
                    checkoutBtn.disabled = false;
                }
            } catch (err) {
                console.error(err);
                alert("Connection failed.");
                checkoutBtn.innerHTML = originalText;
                checkoutBtn.disabled = false;
            }
        };
    }
}

// Premium Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');

                // If it's a grid/shelf, trigger its children with stagger
                if (entry.target.classList.contains('product-shelf') || entry.target.classList.contains('faq-grid')) {
                    const children = entry.target.querySelectorAll('.product-item, .faq-item');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('reveal-active');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe sections and special elements
    document.querySelectorAll('.reveal, .product-shelf, .faq-grid, .feature-big, .content-section').forEach(el => {
        observer.observe(el);
    });
}

// Global Exports
window.removeFromCart = removeFromCart;
document.addEventListener('DOMContentLoaded', () => {
    init();
    changeLanguage(currentLang);
});
