const menuToggle = document.getElementById("menu-toggle");
const mobileNav = document.getElementById("mobile-nav");

function setMenu(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  menuToggle.firstElementChild.className = `icon icon-${open ? "close" : "menu"}`;
  mobileNav.classList.toggle("open", open);
  mobileNav.setAttribute("aria-hidden", String(!open));
  mobileNav.inert = !open;
}

menuToggle.addEventListener("click", () =>
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
);
mobileNav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    setMenu(false);
    const target = link.hash ? document.querySelector(link.hash) : null;
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }),
);
window.addEventListener(
  "resize",
  () => window.innerWidth > 860 && setMenu(false),
);
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    setMenu(false);
    menuToggle.focus();
  }
});

// Pin only when the full scene fits; small screens and reduced motion keep all steps in flow.
const story = document.querySelector(".payment-story");
const stage = story.querySelector(".story-stage");
const scenes = [...story.querySelectorAll(".story-scene")];
const progressItems = [...story.querySelectorAll(".story-progress > span")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let scrollEnabled = false;
let framePending = false;
let activeIndex = -1;
let stageTop = 0;

function setStage(index) {
  if (index === activeIndex) return;
  activeIndex = index;
  scenes.forEach((scene, i) => {
    scene.classList.toggle("is-active", i === index);
  });
  progressItems.forEach((item, i) => {
    item.classList.toggle("is-active", i === index);
    item.classList.toggle("is-complete", i < index);
  });
}

function updateStory() {
  framePending = false;
  if (!scrollEnabled) return;
  const distance = story.offsetHeight - stage.offsetHeight;
  const progress = Math.max(
    0,
    Math.min(1, (stageTop - story.getBoundingClientRect().top) / distance),
  );
  setStage(Math.min(scenes.length - 1, Math.floor(progress * scenes.length)));
}

function queueStoryUpdate() {
  if (framePending || !scrollEnabled) return;
  framePending = true;
  requestAnimationFrame(updateStory);
}

function configureStory() {
  const headerHeight = document.querySelector(".site-header").offsetHeight;
  stageTop = headerHeight + 16;
  story.style.setProperty("--stage-top", `${stageTop}px`);
  // Measure in the enhanced layout, then fall back if zoom or viewport height makes it too tall.
  story.classList.add("is-scrolling");
  scrollEnabled =
    !reducedMotion.matches &&
    stage.offsetHeight + stageTop + 24 <= window.innerHeight;
  if (scrollEnabled) {
    stageTop =
      headerHeight +
      Math.max(16, (window.innerHeight - headerHeight - stage.offsetHeight) / 2);
    story.style.setProperty("--stage-top", `${stageTop}px`);
  }
  story.classList.toggle("is-scrolling", scrollEnabled);
  if (scrollEnabled) updateStory();
}

window.addEventListener("scroll", queueStoryUpdate, { passive: true });
window.addEventListener("resize", configureStory);
window.addEventListener("pageshow", configureStory);
reducedMotion.addEventListener("change", configureStory);
document.fonts.ready.then(configureStory);
configureStory();
