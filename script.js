/* ============================================================
   Kada London — three signature animations
   1. Logo cinematic intro
   2. Scroll-scrubbed dual-reel cinema
   3. Sticky category menu (vertical flow)
   ============================================================ */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const EASE = "power3.inOut";
const DURATION = { fast: 0.3, base: 0.6, slow: 1.1 };

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;
const hasGsap = typeof gsap !== "undefined";
if (hasGsap && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

const MENU_PANELS = [
  {
    id: "soups",
    title: "Soups",
    items: [
      { name: "Sinigang", price: "19.50", meta: "Pork or Beef" },
      { name: "Bulalo", price: "25.00", meta: "Beef" },
      { name: "Lomi", price: "20.00", meta: "Pork Mix" },
    ],
  },
  {
    id: "favs",
    title: "Kada Favs",
    items: [
      { name: "Kare Kare", price: "19.99", meta: "" },
      { name: "Sizzling Sisig", price: "18.99", meta: "" },
      { name: "Lechon Kawali", price: "16.99", meta: "" },
      { name: "Torta Talong", price: "15.00", meta: "" },
      { name: "Special Pancit Canton", price: "16.99", meta: "" },
      { name: "Pinakbet", price: "15.99", meta: "" },
      { name: "Seafood Bicol Express", price: "18.99", meta: "" },
      { name: "Pork Humba", price: "17.99", meta: "" },
    ],
  },
  {
    id: "skewers",
    title: "BBQ Skewers",
    items: [
      { name: "Belly", price: "3.00", meta: "Pork" },
      { name: "Intestine", price: "2.00", meta: "Pork" },
      { name: "Hotdog", price: "2.00", meta: "Pork" },
      { name: "Heart", price: "2.00", meta: "Pork" },
      { name: "Liver", price: "2.00", meta: "Chicken · Halal" },
      { name: "Gizzard", price: "2.00", meta: "Chicken · Halal" },
      { name: "Betamax", price: "2.00", meta: "Seasonal · Halal" },
      { name: "Chicken Feet", price: "2.80", meta: "Halal" },
      { name: "Chicken Tail", price: "2.00", meta: "Halal" },
      { name: "Inasal", price: "9.00", meta: "Halal" },
      { name: "Steak w/ Mango Chimichurri", price: "4.00", meta: "Beef · Halal" },
      { name: "Breast", price: "3.50", meta: "Lamb · Halal" },
      { name: "Prawns", price: "4.00", meta: "" },
      { name: "Butter Bath Corn", price: "2.00", meta: "" },
    ],
  },
  {
    id: "sharing",
    title: "Sharing",
    items: [
      { name: "Chicken Skin Nachos", price: "8.50", meta: "" },
      { name: "Chicharon Bulaklak", price: "8.50", meta: "" },
      { name: "Loaded Tocino Fries", price: "9.50", meta: "" },
      { name: "Loaded Sisig Fries", price: "9.50", meta: "" },
      { name: "Wings (5 Pcs)", price: "8.00", meta: "" },
      { name: "OG Wing Platter (20 Pcs)", price: "17.99", meta: "" },
      { name: "BBQ Taster Platter", price: "30.00", meta: "Add inasal £8" },
      { name: "Pinoy Feast", price: "75.00", meta: "Good for 2–3" },
      { name: "Rice", price: "3.00", meta: "" },
      { name: "Fried Rice", price: "5.50", meta: "" },
      { name: "Lumpia (7 Pcs)", price: "8.50", meta: "" },
    ],
  },
  {
    id: "desserts",
    title: "Desserts",
    items: [
      { name: "Ube Ice Cream", price: "3.00", meta: "Per scoop" },
      { name: "Turon & Ice Cream", price: "6.99", meta: "" },
      { name: "Halo-Halo", price: "9.00", meta: "Seasonal" },
    ],
  },
  {
    id: "drinks",
    title: "Drinks",
    items: [
      { name: "Ube Colada", price: "12.00", meta: "Cocktail" },
      { name: "Calamansi Mojito", price: "12.00", meta: "Cocktail" },
      { name: "Guava Margarita", price: "12.00", meta: "Cocktail" },
      { name: "Pineapple & Pandan Spritz", price: "12.00", meta: "Cocktail" },
      { name: "Ube Nolada", price: "5.00", meta: "Mocktail" },
      { name: "Pandan Spritz", price: "5.50", meta: "Mocktail" },
      { name: "Wine", price: "7.00", meta: "175ml / bottle" },
      { name: "Prosecco", price: "7.00", meta: "Glass / bottle" },
      { name: "Spirits", price: "6.50+", meta: "Single" },
      { name: "Coke / Lemonade", price: "3.50", meta: "" },
      { name: "Juice", price: "4.00", meta: "" },
      { name: "Still Water", price: "4.95", meta: "750ml" },
      { name: "Sparkling Water", price: "5.00", meta: "750ml" },
    ],
  },
];

const CINEMA_BEATS = [
  { index: "01", title: "Off the grill", text: "Skewers brushed with smoke, char, and calamansi — street food lifted to the table." },
  { index: "02", title: "The kitchen", text: "Sizzling plates, shared bowls, and the hum of a room that already feels like home." },
  { index: "03", title: "Come hungry", text: "Pinoy Feast for the crew. Ube colada for the toast. London, soon." },
];

/* ---------- text splitting ---------- */
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", words.join(" "));
  el.textContent = "";
  words.forEach((w, i) => {
    const span = document.createElement("span");
    span.className = "word";
    span.setAttribute("aria-hidden", "true");
    span.textContent = w;
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
}

$$("[data-split-words]").forEach((el) => {
  if (el.closest(".cinema")) return;
  splitWords(el);
});
$$("[data-hover-flip] > span").forEach((s) => s.parentElement.setAttribute("data-text", s.textContent));

/* ---------- build menu ---------- */
const MENU_COLS = new Set(["favs", "skewers", "sharing", "drinks"]);

function buildMenu() {
  const nav = $("#menuNav");
  const body = $("#menuBody");
  if (!nav || !body) return;

  nav.innerHTML = MENU_PANELS.map((panel, i) => `
    <button class="menu__nav-btn${i === 0 ? " is-active" : ""}" type="button"
      data-target="${panel.id}" aria-current="${i === 0 ? "true" : "false"}">
      ${panel.title}
    </button>
  `).join("");

  body.innerHTML = MENU_PANELS.map((panel, i) => `
    <section class="menu__category reveal" id="menu-${panel.id}" data-category="${panel.id}">
      <div class="menu__category-head">
        <span class="menu__category-num">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="menu__category-title">${panel.title}</h3>
      </div>
      <ul class="menu__items${MENU_COLS.has(panel.id) ? " menu__items--cols" : ""}">
        ${panel.items.map((item) => `
          <li class="menu__item">
            <span class="menu__item-name">${item.name}</span>
            ${item.meta ? `<span class="menu__item-meta">${item.meta}</span>` : ""}
            <span class="menu__item-price">£${item.price}</span>
          </li>
        `).join("")}
      </ul>
    </section>
  `).join("");
}

buildMenu();

function initMenu() {
  const nav = $("#menuNav");
  const buttons = $$(".menu__nav-btn", nav);
  const categories = $$(".menu__category");
  if (!nav || !buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(`menu-${btn.dataset.target}`);
      if (!target) return;
      buttons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-current", b === btn ? "true" : "false");
      });
      if (lenis) lenis.scrollTo(target, { offset: -96, duration: 1.2 });
      else target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  });

  if (!hasGsap || prefersReduced) return;

  categories.forEach((cat) => {
    ScrollTrigger.create({
      trigger: cat,
      start: "top 42%",
      end: "bottom 42%",
      onEnter: () => setActiveNav(cat.dataset.category),
      onEnterBack: () => setActiveNav(cat.dataset.category),
    });
  });

  function setActiveNav(id) {
    buttons.forEach((b) => {
      const on = b.dataset.target === id;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-current", on ? "true" : "false");
    });
  }
}

/* ---------- mobile nav ---------- */
const menuToggle = $("#menuToggle");
const mobileMenu = $("#mobileMenu");

function closeMenu() {
  menuToggle?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  mobileMenu?.classList.remove("is-open");
  mobileMenu?.setAttribute("aria-hidden", "true");
}

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  mobileMenu?.classList.toggle("is-open", open);
  mobileMenu?.setAttribute("aria-hidden", String(!open));
});
$$(".mobile-menu a").forEach((a) => a.addEventListener("click", closeMenu));

/* ---------- Lenis ---------- */
let lenis = null;
if (!prefersReduced && hasGsap && typeof Lenis !== "undefined") {
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis.on("scroll", () => ScrollTrigger.update());
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.5 });
    else target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
  });
});

const nav = $("#nav");
window.addEventListener("scroll", () => {
  nav?.classList.toggle("is-scrolled", window.scrollY > 40);
}, { passive: true });

/* ---------- video helpers ---------- */
function primeVideo(video) {
  if (!video) return Promise.resolve();
  video.muted = true;
  video.playsInline = true;
  return new Promise((resolve) => {
    const ready = () => {
      video.removeEventListener("loadeddata", ready);
      video.currentTime = 0.05;
      resolve();
    };
    if (video.readyState >= 2) {
      video.currentTime = 0.05;
      resolve();
      return;
    }
    video.addEventListener("loadeddata", ready);
    video.load();
  });
}
/* ---------- ANIMATION 1 · Logo intro ---------- */
const INTRO_STEPS = ["Warming the grill", "Loading the reels", "Setting the table"];

function runIntro() {
  const intro = $("#intro");
  const countEl = $("#introCount");
  const labelEl = $("#introLabel");
  const ring = $("#introRing");
  const logo = $(".intro__mark");
  const city = $(".intro__city");
  const heroVideo = $("#heroVideo");

  if (!intro || prefersReduced || !hasGsap) {
    intro?.remove();
    nav?.classList.add("is-visible");
    heroVideo?.play().catch(() => {});
    initExperience();
    return;
  }

  function finishIntro() {
    const out = gsap.timeline({
      onComplete: () => {
        intro.remove();
        nav?.classList.add("is-visible");
        heroVideo?.play().catch(() => {});
        initExperience();
      },
    });
    out
      .to(intro, { yPercent: -100, duration: 1.15, ease: "power4.inOut" })
      .to(".hero .reveal", { opacity: 1, y: 0, duration: DURATION.slow, stagger: 0.12, ease: EASE, clearProps: "transform" }, "-=0.65")
      .from(".hero__video", { scale: 1.06, duration: 2, ease: "power2.out" }, "-=1.3");
  }

  gsap.timeline()
    .to(ring, { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out", transformOrigin: "50% 50%" })
    .to([logo, city], { opacity: 1, duration: 1, ease: "power3.out" }, 0.15)
    .from(logo, { scale: 1.06, duration: 1.1, ease: "power3.out", transformOrigin: "50% 50%" }, 0.15)
    .to(countEl, { opacity: 1, duration: 0.4 }, 0.45);

  let progress = 0;
  const minDuration = 2400;
  const start = performance.now();

  (function tickCount() {
    progress = Math.min(100, progress + Math.random() * 14 + 6);
    if (countEl) countEl.textContent = String(Math.floor(progress));
    const step = Math.min(INTRO_STEPS.length - 1, Math.floor(progress / 34));
    if (labelEl) labelEl.textContent = INTRO_STEPS[step];
    if (progress < 100) {
      setTimeout(tickCount, 70 + Math.random() * 60);
    } else {
      const wait = Math.max(0, minDuration - (performance.now() - start));
      setTimeout(finishIntro, wait + 200);
    }
  })();
}

function pauseCinemaVideos(...videos) {
  videos.forEach((v) => { if (v) v.pause(); });
}

function playCinemaVideo(video) {
  if (!video) return;
  video.muted = true;
  const p = video.play();
  if (p?.catch) p.catch(() => {});
}

/* ---------- ANIMATION 2 · Cinematic playback (not scroll-scrub) ---------- */
function initCinema() {
  if (!hasGsap || prefersReduced) return;

  const section = $(".cinema__scroll");
  const videoA = $("#cinemaVideoA");
  const videoB = $("#cinemaVideoB");
  const bgA = $(".cinema__bg--a");
  const bgB = $(".cinema__bg--b");
  if (!section || !videoA || !videoB) return;

  const els = {
    titleEl: $("#cinemaTitle"),
    textEl: $("#cinemaText"),
    indexEl: $("#cinemaIndex"),
    progressEl: $("#cinemaProgress"),
  };

  let reelBStarted = false;

  const updateCopy = (p) => {
    const beat = p < 0.45 ? 0 : p < 0.78 ? 1 : 2;
    const beatData = CINEMA_BEATS[beat];
    if (els.indexEl) els.indexEl.textContent = beatData.index;
    if (els.textEl) els.textEl.textContent = beatData.text;
    if (els.titleEl) els.titleEl.textContent = beatData.title;
    if (els.progressEl) els.progressEl.style.width = `${p * 100}%`;
  };

  const setReel = (which) => {
    const showA = which === "a";
    videoA.style.opacity = showA ? "1" : "0";
    videoB.style.opacity = showA ? "0" : "1";
    if (bgA) bgA.style.opacity = showA ? "1" : "0";
    if (bgB) bgB.style.opacity = showA ? "0" : "1";
  };

  const pin = $(".cinema__pin");

  Promise.all([primeVideo(videoA), primeVideo(videoB)]).then(() => {
    setReel("a");
    updateCopy(0);

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=2600",
      pin: ".cinema__pin",
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        reelBStarted = false;
        videoB.pause();
        videoA.currentTime = 0;
        setReel("a");
        playCinemaVideo(videoA);
        if (pin) pin.style.opacity = "1";
      },
      onEnterBack: () => {
        reelBStarted = false;
        videoB.pause();
        videoA.currentTime = 0;
        setReel("a");
        playCinemaVideo(videoA);
        if (pin) pin.style.opacity = "1";
      },
      onLeave: () => pauseCinemaVideos(videoA, videoB),
      onLeaveBack: () => pauseCinemaVideos(videoA, videoB),
      onUpdate: (self) => {
        const p = self.progress;
        updateCopy(p);

        if (pin) {
          const fade = p > 0.82 ? Math.max(0, 1 - (p - 0.82) / 0.18) : 1;
          pin.style.opacity = String(fade);
        }

        if (p < 0.4) {
          setReel("a");
          reelBStarted = false;
        } else if (p < 0.55) {
          const t = (p - 0.4) / 0.15;
          videoA.style.opacity = String(1 - t);
          videoB.style.opacity = String(t);
          if (bgA) bgA.style.opacity = String(1 - t * 0.85);
          if (bgB) bgB.style.opacity = String(t * 0.85);
          if (!reelBStarted && t > 0.12) {
            reelBStarted = true;
            videoB.currentTime = 0;
            playCinemaVideo(videoB);
          }
        } else {
          setReel("b");
          if (!reelBStarted) {
            reelBStarted = true;
            videoB.currentTime = 0;
            playCinemaVideo(videoB);
          }
        }
      },
    });
  });
}

/* ---------- ANIMATION 3 · removed — menu is vertical scroll ---------- */

/* ---------- scroll reveals ---------- */
function initReveals() {
  if (!hasGsap || prefersReduced) return;

  gsap.to("#pageProgress", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.35 },
  });

  gsap.utils.toArray(".reveal").forEach((el) => {
    if (el.closest(".hero") || el.closest(".cinema") || el.classList.contains("story__photo")) return;
    gsap.to(el, {
      opacity: 1, y: 0, duration: DURATION.base, ease: EASE,
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
    });
  });

  gsap.utils.toArray("[data-split-words]").forEach((el) => {
    if (el.closest(".cinema")) return;
    const words = el.querySelectorAll(".word");
    if (!words.length) return;
    gsap.from(words, {
      y: "110%", duration: 0.85, ease: EASE, stagger: 0.05,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  gsap.utils.toArray(".story__line").forEach((el) => {
    gsap.from(el, {
      y: "110%", duration: 0.9, ease: EASE,
      scrollTrigger: { trigger: el.closest(".story"), start: "top 78%" },
    });
  });

  gsap.utils.toArray(".story__photo").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: DURATION.slow,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
      },
    );
  });

  ScrollTrigger.refresh();
}

function initExperience() {
  initCinema();
  initMenu();
  initReveals();
}

/* ---------- reduced motion ---------- */
if (prefersReduced || !hasGsap) {
  $("#intro")?.remove();
  nav?.classList.add("is-visible");
  $$(".reveal").forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
  $("#heroVideo")?.play().catch(() => {});
  initExperience();
} else {
  runIntro();
}

window.addEventListener("load", () => ScrollTrigger?.refresh());
