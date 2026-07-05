(function () {
  "use strict";

  const assetBase = (() => {
    const pathName = window.location.pathname.replace(/\/+$/, '');
    if (pathName.includes('/portfolio')) return '/portfolio/';
    return '/';
  })();

  window.assetUrl = function assetUrl(path) {
    if (!path) return '';
    if (/^(https?:)?\/\//i.test(path)) return path;
    if (path.startsWith('/')) return path;
    return `${assetBase}${path.replace(/^\.?\//, '')}`;
  };

  // ── TOAST ─────────────────────────────────────────────────────────
  function toast(msg, type = 'ok', icon = 'fa-check-circle') {
    const wrap = document.getElementById('toastWrap');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
    wrap.appendChild(t);
    requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 3500);
  }

  // ── LOADER ────────────────────────────────────────────────────────
  const loader = document.getElementById('loader');
  const pctEl = document.getElementById('loaderPct');
  let pct = 0;
  const pi = setInterval(() => { pct = Math.min(pct + Math.random() * 18, 99); if (pctEl) pctEl.textContent = Math.round(pct) + '%'; }, 120);
  window.addEventListener('load', () => { clearInterval(pi); if (pctEl) pctEl.textContent = '100%'; setTimeout(() => loader.classList.add('out'), 1200); });

  document.getElementById('yr').textContent = new Date().getFullYear();

  // ── THEME ─────────────────────────────────────────────────────────
  const body = document.body;
  const themeIcon = document.getElementById('themeIcon');
  function applyTheme(dark) {
    body.classList.toggle('dark', dark);
    themeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    if (window.rebuildGlobe) window.rebuildGlobe();
  }
  const sv = localStorage.getItem('theme');
  applyTheme(sv ? sv === 'dark' : true);
  document.getElementById('themeBtn').addEventListener('click', () => applyTheme(!body.classList.contains('dark')));

  // ── MOBILE MENU ───────────────────────────────────────────────────
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');
  const ovl = document.getElementById('navOverlay');
  const toggleMenu = o => { nav.classList.toggle('open', o); ovl.classList.toggle('open', o); body.style.overflow = o ? 'hidden' : ''; ham.querySelector('i').className = o ? 'fas fa-times' : 'fas fa-bars'; };
  ham.addEventListener('click', () => toggleMenu(!nav.classList.contains('open')));
  ovl.addEventListener('click', () => toggleMenu(false));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // ── TYPEWRITER ────────────────────────────────────────────────────
  const phrases = ['HTML, CSS & PHP developer.', 'Leerjaar 2 @ GLU Utrecht.', 'Beschikbaar in Utrecht & Woerden.', 'Werkt graag met AI-tools.', 'Altijd aan het leren.'];
  let phi = 0, ci = 0, del = false;
  const twEl = document.getElementById('tw');
  function tick() {
    const p = phrases[phi]; twEl.textContent = del ? p.slice(0, --ci) : p.slice(0, ++ci);
    if (!del && ci === p.length) { del = true; setTimeout(tick, 1800); return; }
    if (del && ci === 0) { del = false; phi = (phi + 1) % phrases.length; setTimeout(tick, 220); return; }
    setTimeout(tick, del ? 42 : 85);
  }
  tick();

  // ── OBSERVERS ─────────────────────────────────────────────────────
  const revObs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) { x.target.classList.add('visible'); revObs.unobserve(x.target); } }), { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
  const flipObs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) { x.target.classList.add('flipped'); flipObs.unobserve(x.target); } }), { threshold: .2 });
  document.querySelectorAll('.flip-wrap').forEach(el => flipObs.observe(el));

  // ── SCROLL: bar + btt + nav + side dots ───────────────────────────
  const scrollBar = document.getElementById('scrollBar');
  const btt = document.getElementById('btt');
  const sects = Array.from(document.querySelectorAll('section[id]'));
  const navAs = document.querySelectorAll('.nav-links a');
  const sdots = document.querySelectorAll('.sd');
  window.addEventListener('scroll', () => {
    const pct2 = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    scrollBar.style.width = pct2 + '%';
    btt.classList.toggle('show', window.scrollY > 500);
    let cur = '';
    sects.forEach(s => { if (window.scrollY + 120 >= s.offsetTop) cur = s.id; });
    navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    sdots.forEach(d => d.classList.toggle('act', d.getAttribute('href') === '#' + cur));
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── KPI COUNT-UP ─────────────────────────────────────────────────
  const kpiObs = new IntersectionObserver(e => e.forEach(x => {
    if (!x.isIntersecting) return;
    const el = x.target, tgt = +el.dataset.count, suf = el.dataset.suffix || '', dur = 1600, t0 = performance.now();
    const step = now => { const p = Math.min((now - t0) / dur, 1); el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * tgt) + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); kpiObs.unobserve(el);
  }), { threshold: .6 });
  document.querySelectorAll('.kpi-num[data-count]').forEach(el => kpiObs.observe(el));

  // ── SKILL BARS ────────────────────────────────────────────────────
  const barObs = new IntersectionObserver(e => e.forEach(x => {
    if (!x.isIntersecting) return;
    x.target.querySelectorAll('.skill-fill').forEach((b, i) => setTimeout(() => b.style.width = b.dataset.w + '%', i * 80));
    barObs.unobserve(x.target);
  }), { threshold: .2 });
  document.querySelectorAll('.skills-grid').forEach(el => barObs.observe(el));



  // ── CONTACT FORM ─────────────────────────────────────────────────
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cname').value.trim();
    const email = document.getElementById('cemail').value.trim();
    const msg = document.getElementById('cmsg').value.trim();
    const fb = document.getElementById('formMsg');
    if (!name || !email || !msg) { fb.className = 'form-msg err'; fb.textContent = 'Please fill in all fields.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { fb.className = 'form-msg err'; fb.textContent = 'Please enter a valid email.'; return; }
    fb.className = 'form-msg ok'; fb.textContent = "✨ Sent! I'll reply within 24 hours.";
    e.target.reset(); setTimeout(() => fb.textContent = '', 4000);
    toast('Message sent! Talk soon 🚀', 'ok', 'fa-paper-plane');
  });
  document.getElementById('cvBtn').addEventListener('click', () => {
    toast('📄 samCV.pdf — downloading…', 'ok', 'fa-download');
  });

  // ── MARQUEE ───────────────────────────────────────────────────────
  const mItems = ['Beschikbaar voor opdrachten', 'Utrecht & Woerden', 'HTML · CSS · PHP', 'MySQL', 'JavaScript', 'AI-tools', 'Grafisch Lyceum Utrecht', 'Leerjaar 2', '2025'];
  const mi = document.getElementById('marqueeInner');
  const mkup = () => mItems.map(t => `<span class="marquee-item"><span class="marquee-dot"></span>${t}</span>`).join('');
  mi.innerHTML = mkup() + mkup();

  // ── MAGNETIC BUTTONS ─────────────────────────────────────────────
  document.querySelectorAll('.mag-wrap').forEach(wrap => {
    const btn = wrap.querySelector('.btn'); if (!btn) return;
    wrap.addEventListener('mousemove', e => { const r = wrap.getBoundingClientRect(); btn.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * .36}px,${(e.clientY - (r.top + r.height / 2)) * .36}px)`; });
    wrap.addEventListener('mouseleave', () => { btn.style.transition = 'transform .5s cubic-bezier(.25,1,.5,1)'; btn.style.transform = ''; setTimeout(() => btn.style.transition = '', 500); });
  });

  // ── PROJECTS HERO IMAGE (config)
  const projectsHero = {
    image: window.assetUrl('images/kiosk1.png'),
    alt: 'Projects banner'
  };
  const projectsHeroImg = document.getElementById('projectsHeroImg');
  if (projectsHeroImg) projectsHeroImg.src = projectsHero.image;

  // ── TILT CARDS ───────────────────────────────────────────────────
  document.querySelectorAll('.tilt-wrap').forEach(wrap => {
    const card = wrap.querySelector('.proj-card'); if (!card) return;
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, cx = r.width / 2, cy = r.height / 2;
      card.style.transform = `rotateX(${-((y - cy) / cy) * 12}deg) rotateY(${((x - cx) / cx) * 12}deg) scale3d(1.02,1.02,1.02)`;
      card.style.boxShadow = '0 20px 40px rgba(0,0,0,.18)';
      card.style.setProperty('--mx', Math.round(x / r.width * 100) + '%');
      card.style.setProperty('--my', Math.round(y / r.height * 100) + '%');
    });
    wrap.addEventListener('mouseleave', () => { card.style.transform = ''; card.style.boxShadow = ''; });
  });

  // ── TEXT SCRAMBLE (disabled)

  const schars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  document.querySelectorAll('.flip-inner').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const orig = el.dataset.orig || el.innerText; el.dataset.orig = orig;
      let frame = 0, total = 14;
      const run = () => { el.innerText = orig.split('').map((ch, i) => { if (ch === '\n' || ch === ' ') return ch; return frame / total > i / orig.length ? ch : schars[Math.floor(Math.random() * schars.length)]; }).join(''); if (++frame <= total) requestAnimationFrame(run); else el.innerText = orig; };
      run();
    });
  });

  // ── CURSOR + TRAIL ────────────────────────────────────────────────
  const dot = document.getElementById('cur-dot'), ring = document.getElementById('cur-ring'), spotlight = document.getElementById('spotlight');
  let mx = -300, my = -300, rx = -300, ry = -300;
  const TCOUNT = 14;
  const trails = Array.from({ length: TCOUNT }, (_, i) => {
    const t = document.createElement('div'); t.className = 'trail-dot';
    const s = Math.max(2, 7 - i * .45); t.style.cssText = `width:${s}px;height:${s}px;opacity:${.35 - i * .022}`;
    document.body.appendChild(t); return { el: t, x: -300, y: -300 };
  });
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; spotlight.style.setProperty('--sx', mx + 'px'); spotlight.style.setProperty('--sy', my + 'px'); }, { passive: true });
  (function rloop() {
    rx += (mx - rx) * .13; ry += (my - ry) * .13; ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    for (let i = trails.length - 1; i > 0; i--) { trails[i].x += (trails[i - 1].x - trails[i].x) * .45; trails[i].y += (trails[i - 1].y - trails[i].y) * .45; trails[i].el.style.left = trails[i].x + 'px'; trails[i].el.style.top = trails[i].y + 'px'; }
    trails[0].x += (mx - trails[0].x) * .55; trails[0].y += (my - trails[0].y) * .55; trails[0].el.style.left = trails[0].x + 'px'; trails[0].el.style.top = trails[0].y + 'px';
    requestAnimationFrame(rloop);
  })();
  document.querySelectorAll('a,button,.proj-card,.soc-link,input,textarea,.testi-card,.now-card,.srv-card,.pf-btn').forEach(el => { el.addEventListener('mouseenter', () => body.classList.add('c-hover')); el.addEventListener('mouseleave', () => body.classList.remove('c-hover')); });
  window.addEventListener('mousedown', e => { body.classList.add('c-click'); const rpl = document.createElement('div'); rpl.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;border:1.5px solid var(--accent);border-radius:50%;pointer-events:none;z-index:9993;animation:rippleOut .65s ease-out forwards`; document.body.appendChild(rpl); setTimeout(() => rpl.remove(), 700); });
  window.addEventListener('mouseup', () => body.classList.remove('c-click'));

  // ── HERO MESH ─────────────────────────────────────────────────────
  const mc = document.getElementById('meshCanvas');
  const mctx = mc.getContext('2d');
  let mW, mH, mPts = [], mMx = 0, mMy = 0, mT = 0;
  function initMesh() {
    mW = mc.offsetWidth; mH = mc.offsetHeight;
    mc.width = mW * devicePixelRatio; mc.height = mH * devicePixelRatio;
    mctx.scale(devicePixelRatio, devicePixelRatio);
    mPts = [];
    for (let r = 0; r <= 5; r++) for (let c = 0; c <= 8; c++) mPts.push({ bx: c / 8 * mW, by: r / 5 * mH, x: 0, y: 0, ox: (Math.random() - .5) * 28, oy: (Math.random() - .5) * 28 });
  }
  window.addEventListener('mousemove', e => { mMx = e.clientX; mMy = e.clientY; }, { passive: true });
  function drawMesh() {
    mctx.clearRect(0, 0, mW, mH); mT += .006;
    const dark = body.classList.contains('dark');
    const ac = dark ? [110, 96, 255] : [91, 76, 255];
    mPts.forEach((p, i) => {
      p.x = p.bx + p.ox + Math.sin(mT + i * .4) * 14; p.y = p.by + p.oy + Math.cos(mT + i * .3) * 10;
      const dx = p.x - mMx, dy = p.y - mMy, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) { p.x += dx / d * (130 - d) * .09; p.y += dy / d * (130 - d) * .09; }
    });
    const cols = 9;
    for (let i = 0; i < mPts.length; i++) {
      const r = Math.floor(i / cols), c2 = i % cols;
      if (c2 < cols - 1 && r < Math.floor(mPts.length / cols) - 1) {
        [[i, i + 1], [i, i + cols], [i, i + cols + 1]].forEach(([a, b]) => {
          if (!mPts[b]) return;
          mctx.beginPath(); mctx.moveTo(mPts[a].x, mPts[a].y); mctx.lineTo(mPts[b].x, mPts[b].y);
          mctx.strokeStyle = `rgba(${ac},${dark ? .07 : .04})`; mctx.lineWidth = 1; mctx.stroke();
        });
      }
      mctx.beginPath(); mctx.arc(mPts[i].x, mPts[i].y, 2, 0, Math.PI * 2);
      mctx.fillStyle = `rgba(${ac},${dark ? .16 : .1})`; mctx.fill();
    }
    requestAnimationFrame(drawMesh);
  }
  initMesh(); drawMesh();
  window.addEventListener('resize', initMesh);

  // ── THREE.JS GLOBE ────────────────────────────────────────────────
  (function () {
    if (typeof THREE === 'undefined') return;
    const mount = document.getElementById('globeMount'); if (!mount) return;
    const W = mount.clientWidth || 380, H = 290;
    const skills = ['HTML5', 'CSS3', 'PHP', 'MySQL', 'JavaScript', 'Python', 'AI tools', 'Git', 'Figma', 'Bootstrap', 'Tailwind', 'PHP/MySQL'];
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(55, W / H, .1, 100);
    camera.position.z = 2.8;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(devicePixelRatio); renderer.setSize(W, H); renderer.setClearColor(0, 0); mount.appendChild(renderer.domElement);
    function build() {
      while (scene.children.length) scene.remove(scene.children[0]);
      const dark = body.classList.contains('dark');
      const wc = dark ? '#2a3660' : '#c8c5f0', dc = dark ? '#9d8fff' : '#5b4cff', lc = dark ? '#9ba8c0' : '#555070';
      scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 18), new THREE.MeshBasicMaterial({ color: new THREE.Color(wc), wireframe: true, transparent: true, opacity: .28 })));
      const g = new THREE.Group(), N = skills.length, phi = Math.PI * (3 - Math.sqrt(5)), dg = new THREE.SphereGeometry(.042, 8, 8);
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), theta = phi * i, x = r * Math.cos(theta), z = r * Math.sin(theta);
        const dm = new THREE.Mesh(dg, new THREE.MeshBasicMaterial({ color: new THREE.Color(dc) }));
        dm.position.set(x * 1.07, y * 1.07, z * 1.07); g.add(dm);
        const cv = document.createElement('canvas'); cv.width = 128; cv.height = 30;
        const cx2 = cv.getContext('2d'); cx2.font = 'bold 14px Inter'; cx2.fillStyle = lc; cx2.textAlign = 'center'; cx2.fillText(skills[i], 64, 14);
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, opacity: .88 }));
        sp.position.set(x * 1.48, y * 1.48, z * 1.48); sp.scale.set(.46, .12, 1); g.add(sp);
      }
      scene.add(g); scene._g = g;
    }
    build(); window.rebuildGlobe = build;
    let drag = false, prev = {}, vel = { x: 0, y: 0 };
    renderer.domElement.addEventListener('mousedown', e => { drag = true; prev = { x: e.clientX, y: e.clientY }; vel = { x: 0, y: 0 }; });
    window.addEventListener('mousemove', e => { if (!drag) return; vel.y = (e.clientX - prev.x) * .007; vel.x = (e.clientY - prev.y) * .007; prev = { x: e.clientX, y: e.clientY }; });
    window.addEventListener('mouseup', () => drag = false);
    (function anim() { requestAnimationFrame(anim); if (scene._g) { if (!drag) { vel.x *= .93; vel.y *= .93; } scene._g.rotation.y += vel.y + (drag ? 0 : .003); scene._g.rotation.x += vel.x; } renderer.render(scene, camera); })();
    window.addEventListener('resize', () => { const nW = mount.clientWidth; camera.aspect = nW / H; camera.updateProjectionMatrix(); renderer.setSize(nW, H); });
  })();

})();

const projectData = {

  'kiosk': {
    title: 'Kiosk',
    desc: 'Kiosk bestelscherm waar je eten kan bestellen. Samenwerkopdracht op school met HTML, CSS, JavaScript, JSON en Node.',
    github: 'https://github.com/Samboterham/HamHalek',
    cover: 'images/kiosk.png',
    images: [
      'images/kiosk1.png',
      'images/kiosk2.png',
      'images/kiosk3.png',
      'images/kiosk4.png',
    ]
  },

  'archief': {
    title: 'Utrechts Archief Panorama',
    desc: 'Het Utrechts Archief kwam naar school met een opdracht: maak een panorama van de geschiedenis van het UA. In duo gebouwd met HTML, CSS, JavaScript en MySQL.',
    github: 'https://github.com/Samboterham/samalek',
    cover: 'images/ua.png',
    images: [
      'images/ua1.png',
      'images/ua2.png',
      'images/ua3.png',
      'images/ua4.png',
    ]
  },

  'festival': {
    title: 'U Festival App',
    desc: 'Een offline-werkende festival-app voor een zelf bedacht evenement. Gebouwd met HTML, CSS, JavaScript, JSON en Node.',
    github: 'https://github.com/Samboterham/u_festival_app',
    cover: 'images/uf.png',
    images: [
      'images/uf1.png',
      'images/uf2.png',
      'images/uf3.png',
      'images/uf4.png',
    ]
  },

  'hoveniers': {
    title: 'Hoveniers Website',
    desc: 'Website voor een hoveniersbedrijf met een portfolio van HH tuinprojecten en foto’s van het werk.',
    github: 'https://github.com/Samboterham/Hovenierswebsite_echte',
    cover: 'images/hh.png',
    images: [
      'images/hh1.png',
      'images/hh2.png',
      'images/hh3.png',
      'images/hh4.png',
    ]
  },

   'filmkiezer': {
    title: 'Filmkiezer',
    desc: 'Webapp waarmee je favoriete films kunt toevoegen, bekijken en beheren. Gebouwd met Django en SQLite.',
    github: 'https://github.com/Samboterham/djangoSite',
    cover: 'images/film1.png',
    images: [
      'images/film1.png',
      'images/film2.png',
      'images/film3.png',
       'images/film4.png'
    ]
  },

};

function applyProjectCovers() {
  document.querySelectorAll('.tilt-wrap[data-project]').forEach(wrap => {
    const projectId = wrap.dataset.project;
    const project = projectData[projectId];
    const thumb = wrap.querySelector('.proj-thumb');
    if (!project || !thumb) return;

    const cover = window.assetUrl(project.cover || project.images?.[0]);
    if (!cover) return;

    let coverImg = thumb.querySelector('.proj-thumb-img');
    if (!coverImg) {
      coverImg = document.createElement('img');
      coverImg.className = 'proj-thumb-img';
      thumb.prepend(coverImg);
    }

    coverImg.src = cover;
    coverImg.alt = `${project.title} cover`;
    thumb.classList.add('has-image');

    const icon = thumb.querySelector('i');
    if (icon) icon.style.display = 'none';
  });
}

applyProjectCovers();

// ── Modal logic (don't change below this line) ───────────────────
(function initModal() {
  const modal = document.getElementById('proj-modal');
  if (!modal) return;

  const pmTitle = modal.querySelector('.pm-title');
  const pmImg = modal.querySelector('.pm-img');
  const pmNoImg = modal.querySelector('.pm-no-img');
  const pmDesc = modal.querySelector('.pm-desc');
  const pmGithub = modal.querySelector('.pm-github');
  const pmDots = modal.querySelector('.pm-dots');
  const pmCounter = modal.querySelector('.pm-counter');
  const pmPrev = modal.querySelector('.pm-prev');
  const pmNext = modal.querySelector('.pm-next');

  let images = [], cur = 0;

  function showPhoto(index) {
    cur = index;
    if (images.length === 0) {
      pmImg.style.display = 'none';
      pmNoImg.style.display = 'block';
      pmPrev.classList.add('hide');
      pmNext.classList.add('hide');
      pmCounter.textContent = '';
      pmDots.innerHTML = '';
      return;
    }
    pmImg.style.display = 'block';
    pmNoImg.style.display = 'none';
    pmImg.classList.add('loading');

    const i = new Image();
    i.onload = () => { pmImg.src = images[cur]; pmImg.classList.remove('loading'); };
    i.onerror = () => {
      pmImg.style.display = 'none';
      pmNoImg.style.display = 'block';
      pmNoImg.querySelector('p:last-child').innerHTML =
        `Bestand niet gevonden: <code>${images[cur]}</code>`;
    };
    i.src = images[cur];

    pmPrev.classList.toggle('hide', cur === 0);
    pmNext.classList.toggle('hide', cur === images.length - 1);
    pmCounter.textContent = images.length > 1 ? `${cur + 1} / ${images.length}` : '';

    modal.querySelectorAll('.pm-dot').forEach((d, i) =>
      d.classList.toggle('act', i === cur));
  }

  function buildDots() {
    pmDots.innerHTML = images
      .map((_, i) => `<div class="pm-dot${i === 0 ? ' act' : ''}"></div>`)
      .join('');
    pmDots.querySelectorAll('.pm-dot').forEach((d, i) =>
      d.addEventListener('click', () => showPhoto(i)));
  }

  function openModal(id) {
    const p = projectData[id];
    if (!p) return;
    pmTitle.textContent = p.title;
    pmDesc.textContent = p.desc;
    pmGithub.href = p.github || '#';
    images = (p.images || []).map(window.assetUrl);
    cur = 0;
    buildDots();
    showPhoto(0);
    modal.classList.add('open');
    // make arrows dark on light images for specific projects
    if (id === 'filmkiezer') modal.classList.add('light-arrows'); else modal.classList.remove('light-arrows');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // reset scroll
    modal.querySelector('.pm-box').scrollTop = 0;
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.classList.remove('light-arrows');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    pmImg.src = '';
  }

  // Arrow buttons
  pmPrev.addEventListener('click', () => { if (cur > 0) showPhoto(cur - 1); });
  pmNext.addEventListener('click', () => { if (cur < images.length - 1) showPhoto(cur + 1); });

  // Close
  modal.querySelector('.pm-close').addEventListener('click', closeModal);
  modal.querySelector('.pm-backdrop').addEventListener('click', closeModal);

  // Keyboard
  window.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && cur > 0) showPhoto(cur - 1);
    if (e.key === 'ArrowRight' && cur < images.length - 1) showPhoto(cur + 1);
  });

  // Wire up project cards
  document.querySelectorAll('.tilt-wrap[data-project]').forEach(wrap => {
    wrap.addEventListener('click', () => openModal(wrap.dataset.project));
  });
})();