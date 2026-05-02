/* ══════════════════════════════════════════════
     THREE.JS — FLOATING COFFEE BEANS SCENE
  ══════════════════════════════════════════════ */
  const canvas = document.getElementById('c3d');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
  cam.position.z = 20;

  // Lighting
  scene.add(new THREE.AmbientLight(0xC9A96E, 0.25));
  const pl1 = new THREE.PointLight(0xC9A96E, 2, 60);
  pl1.position.set(10, 10, 10); scene.add(pl1);
  const pl2 = new THREE.PointLight(0x9A5A2A, 1, 40);
  pl2.position.set(-10, -6, 5); scene.add(pl2);

  // Coffee bean meshes (torus = donut ≈ bean shape)
  const beans = [];
  const bGeo = new THREE.TorusGeometry(.38, .16, 8, 20);
  const bMat = new THREE.MeshStandardMaterial({ color:0x3D1F0A, roughness:.65, metalness:.08 });

  for (let i = 0; i < 130; i++) {
    const m = new THREE.Mesh(bGeo, bMat);
    m.position.set(
      (Math.random()-.5)*64,
      (Math.random()-.5)*42,
      (Math.random()-.5)*32 - 6
    );
    m.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    const s = .28 + Math.random()*.75;
    m.scale.setScalar(s);
    scene.add(m);
    beans.push({
      m, sx:(Math.random()-.5)*.003, sy:(Math.random()-.5)*.002,
      rs:(Math.random()-.5)*.012, fo:Math.random()*Math.PI*2
    });
  }

  let mx=0, my=0, t=0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX/window.innerWidth - .5) * .55;
    my = (e.clientY/window.innerHeight - .5) * .55;
  });

  (function tick() {
    requestAnimationFrame(tick);
    t += .005;
    beans.forEach(b => {
      b.m.rotation.x += b.rs;
      b.m.rotation.y += b.rs * .7;
      b.m.position.y += Math.sin(t + b.fo) * .005;
      b.m.position.x += b.sx;
      if (b.m.position.x > 32) b.m.position.x = -32;
      if (b.m.position.x < -32) b.m.position.x = 32;
      if (b.m.position.y > 21) b.m.position.y = -21;
      if (b.m.position.y < -21) b.m.position.y = 21;
    });
    cam.position.x += (mx*3 - cam.position.x)*.022;
    cam.position.y += (-my*3 - cam.position.y)*.022;
    renderer.render(scene, cam);
  })();

  window.addEventListener('resize', () => {
    cam.aspect = window.innerWidth/window.innerHeight;
    cam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ══════════════════════════════════════════════
     CUSTOM CURSOR
  ══════════════════════════════════════════════ */
  const cur = document.getElementById('cur');
  const curR = document.getElementById('curRing');
  let cx=0,cy=0,rx=0,ry=0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cur.style.left = cx+'px'; cur.style.top = cy+'px';
  });
  (function animCur() {
    rx += (cx-rx)*.12; ry += (cy-ry)*.12;
    curR.style.left = rx+'px'; curR.style.top = ry+'px';
    requestAnimationFrame(animCur);
  })();

  function addHover(sel) {
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', () => { cur.classList.add('hover'); curR.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); curR.classList.remove('hover'); });
    });
  }
  addHover('a,button,.cat-card,.bs-card,.m-card,.loc-card');

  /* ══════════════════════════════════════════════
     NAVBAR SCROLL
  ══════════════════════════════════════════════ */
  window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ══════════════════════════════════════════════
     SPA ROUTING
  ══════════════════════════════════════════════ */
  let cur_page = 'home';

  function go(page, filter) {
    if (page === cur_page && !filter) return;
    const pt = document.getElementById('pt');
    gsap.to(pt, {
      clipPath:'inset(0 0 0% 0)', duration:.5, ease:'power3.inOut',
      onComplete() {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-'+page).classList.add('active');
        cur_page = page;
        document.querySelectorAll('.nl').forEach(l => l.classList.toggle('active', l.dataset.p===page));
        window.scrollTo(0,0);
        if (filter) fMenu(filter);
        gsap.to(pt, {
          clipPath:'inset(0 0 100% 0)', duration:.5, ease:'power3.inOut', delay:.08,
          onComplete() {
            initReveal();
            addHover('a,button,.cat-card,.bs-card,.m-card,.loc-card');
            if (page==='home') heroAnim();
          }
        });
      }
    });
  }

  /* ══════════════════════════════════════════════
     HERO ANIMATION
  ══════════════════════════════════════════════ */
  function heroAnim() {
    gsap.timeline({ delay:.25 })
      .to('#hEye',  { opacity:1, y:0, duration:.8, ease:'power3.out' })
      .to('#hTtl',  { opacity:1, y:0, duration:1,  ease:'power3.out' }, '-=.4')
      .to('#hSub',  { opacity:1, y:0, duration:.8, ease:'power3.out' }, '-=.5')
      .to('#hAct',  { opacity:1, y:0, duration:.8, ease:'power3.out' }, '-=.4')
      .to('#scInd', { opacity:1, duration:.8, ease:'power3.out' },       '-=.2');
  }

  /* ══════════════════════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════════════════════ */
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e,i) => {
        if (e.isIntersecting) {
          gsap.to(e.target, { opacity:1, y:0, duration:.8, delay:i*.07, ease:'power3.out' });
          io.unobserve(e.target);
        }
      });
    }, { threshold:.1 });

    document.querySelectorAll('#page-'+cur_page+' .rv').forEach(el => io.observe(el));

    // Counter
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const tgt = parseInt(e.target.dataset.c);
          gsap.to({v:0}, {
            v:tgt, duration:2, ease:'power2.out',
            onUpdate() { e.target.textContent = Math.round(this.targets()[0].v); }
          });
          cio.unobserve(e.target);
        }
      });
    }, { threshold:.5 });
    document.querySelectorAll('[data-c]').forEach(el => cio.observe(el));
  }

  /* ══════════════════════════════════════════════
     HERO PARALLAX
  ══════════════════════════════════════════════ */
  window.addEventListener('scroll', () => {
    const img = document.querySelector('.h-img-wrap img');
    if (img) img.style.transform = `scale(1.06) translateY(${window.scrollY*.14}px)`;
  });

  /* ══════════════════════════════════════════════
     MENU FILTER
  ══════════════════════════════════════════════ */
  function fMenu(f, btn) {
    document.querySelectorAll('.m-tab').forEach(t => t.classList.remove('active'));
    const tab = btn || document.querySelector(`.m-tab[data-f="${f}"]`);
    if (tab) tab.classList.add('active');

    document.querySelectorAll('.m-card').forEach(c => {
      const show = f==='all' || c.dataset.cat===f;
      c.classList.toggle('vis', show);
      if (show) gsap.fromTo(c, { opacity:0, y:20 }, { opacity:1, y:0, duration:.4, ease:'power2.out' });
    });
  }

  /* ══════════════════════════════════════════════
     MOBILE MENU
  ══════════════════════════════════════════════ */
  function toggleNav() {
    const links = document.getElementById('nLinks');
    if (links.style.display==='flex') {
      links.style.display='none';
    } else {
      Object.assign(links.style, {
        display:'flex', flexDirection:'column',
        position:'fixed', top:'80px', left:'0', right:'0',
        background:'rgba(8,5,3,.97)', backdropFilter:'blur(20px)',
        padding:'40px', gap:'24px',
        borderBottom:'1px solid rgba(201,169,110,.15)', zIndex:'999'
      });
    }
  }

  /* ══════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════ */
  heroAnim();
  setTimeout(initReveal, 400);

  /* ══════════════════════════════════════════════
     CART FUNCTIONALITY
  ══════════════════════════════════════════════ */
  let cart = JSON.parse(localStorage.getItem('paragon_cart')) || [];

  function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update cart count badge
    const badge = document.getElementById('cartCount');
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);

    // Update cart body
    const body = document.getElementById('cartBody');
    const footer = document.getElementById('cartFooter');
    
    if (cart.length === 0) {
      body.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p></div>';
      footer.style.display = 'none';
    } else {
      body.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.img}" alt="${item.name}">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-cat">${item.cat}</div>
            <div class="cart-item-foot">
              <div class="cart-qty">
                <button onclick="updateQty(${idx}, -1)">−</button>
                <span>${item.qty}</span>
                <button onclick="updateQty(${idx}, 1)">+</button>
              </div>
              <div class="cart-item-price">Rs. ${item.price * item.qty}</div>
            </div>
          </div>
        </div>
        <button class="cart-remove" onclick="removeFromCart(${idx})">Remove</button>
      `).join('');
      footer.style.display = 'block';
    }

    // Update total
    document.getElementById('cartTotal').textContent = 'Rs. ' + total.toLocaleString();
    
    // Save to localStorage
    localStorage.setItem('paragon_cart', JSON.stringify(cart));
  }

  function addToCart(card) {
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    const img = card.dataset.img;
    const cat = card.querySelector('.m-cat').textContent;

    // Check if item already exists
    const existing = cart.find(item => item.name === name);
    
    if (existing) {
      existing.qty += 1;
      showToast(`${name} quantity updated`);
    } else {
      cart.push({ name, price, img, cat, qty: 1 });
      showToast(`${name} added to cart`);
    }

    updateCartUI();
  }

  function removeFromCart(idx) {
    const item = cart[idx];
    cart.splice(idx, 1);
    updateCartUI();
    showToast(`${item.name} removed from cart`);
  }

  function updateQty(idx, change) {
    cart[idx].qty += change;
    if (cart[idx].qty <= 0) {
      removeFromCart(idx);
    } else {
      updateCartUI();
    }
  }

  function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function checkout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const items = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
    
    alert(`🎉 Order Placed Successfully!\n\nItems: ${items}\n\nTotal: Rs. ${total.toLocaleString()}\n\nThank you for choosing Café Paragon!`);
    
    cart = [];
    updateCartUI();
    toggleCart();
  }

  // Initialize cart on page load
  updateCartUI();