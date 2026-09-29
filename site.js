const themeToggle = document.getElementById("theme-toggle");
const themeKey = "ardent-theme";

function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {}
}

function applyTheme(theme) {
  const dark = theme === "dark";
  document.body.classList.toggle("theme-dark", dark);
  document.querySelectorAll("[data-brand-mark]").forEach((mark) => {
    mark.src = dark ? mark.dataset.darkSrc : mark.dataset.lightSrc;
  });
  themeToggle.firstElementChild.className = `icon icon-${dark ? "sun" : "moon"}`;
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${dark ? "light" : "dark"} theme`,
  );
  themeToggle.title = themeToggle.getAttribute("aria-label");
  themeToggle.setAttribute("aria-pressed", String(dark));
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark ? "#111612" : "#f7f8f7");
}

const savedTheme = readPreference(themeKey);
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";
applyTheme(savedTheme || preferredTheme);
themeToggle.addEventListener("click", () => {
  const next = document.body.classList.contains("theme-dark")
    ? "light"
    : "dark";
  applyTheme(next);
  savePreference(themeKey, next);
});

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
    const target = document.querySelector(link.hash);
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

const stageTabs = [...document.querySelectorAll(".flow-tab")];
function selectStage(tab, focus = false) {
  stageTabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden =
      !selected;
  });
  if (focus) tab.focus();
}
stageTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectStage(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % stageTabs.length;
    if (event.key === "ArrowLeft")
      next = (index + stageTabs.length - 1) % stageTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = stageTabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectStage(stageTabs[next], true);
    }
  });
});

const demoFeed = [
  {
    type: "exec",
    type_label: "EXEC",
    agent: "agent-7f2ac9e1",
    detail: "Aave V3 supply - Ethereum Sepolia",
    hash: "0x7f2ac9e1...d41a",
    status: "ok",
    confirm: "Confirmed",
  },
  {
    type: "reg",
    type_label: "WALLET",
    agent: "agent-aa1482bd",
    detail: "Smart wallet resolved - Base Sepolia",
    hash: "0xaa1482bd...14f2",
    status: "ok",
    confirm: "Ready",
  },
  {
    type: "relay",
    type_label: "RELAY",
    agent: "agent-5c081a3f",
    detail: "GMX V2 order - Arbitrum Sepolia",
    hash: "0x5c081a3f...b6c1",
    status: "pending",
    confirm: "Pending",
  },
  {
    type: "exec",
    type_label: "SIM",
    agent: "agent-9d337c2a",
    detail: "Full UserOperation simulation",
    hash: "0x9d337c2a...7a10",
    status: "ok",
    confirm: "Passed",
  },
  {
    type: "exec",
    type_label: "EXEC",
    agent: "agent-2e77b5c3",
    detail: "Compound III supply - Base Sepolia",
    hash: "0x2e77b5c3...f114",
    status: "ok",
    confirm: "Confirmed",
  },
  {
    type: "reg",
    type_label: "READ",
    agent: "agent-1b29e4a2",
    detail: "Morpho market discovery - Base Sepolia",
    hash: "0x1b29e4a2...0d88",
    status: "ok",
    confirm: "Complete",
  },
];

const feedBody = document.getElementById("feed-body");
const feedMode = document.getElementById("feed-mode");
const configuredApiBase =
  window.ARDENT_API_BASE || readPreference("ARDENT_API_BASE");
const defaultApiBase = ["localhost", "127.0.0.1", ""].includes(
  window.location.hostname,
)
  ? ""
  : "https://api.ardentresearch.xyz";
const apiBase = (configuredApiBase || defaultApiBase).replace(/\/$/, "");

const registrationDialog = document.getElementById("registration-dialog");
const registrationClose = document.getElementById("registration-close");
const registrationForm = document.getElementById("registration-form");
const registrationLabel = document.getElementById("registration-label");
const registrationSubmit = document.getElementById("registration-submit");
const registrationError = document.getElementById("registration-error");
const registrationSuccess = document.getElementById("registration-success");
const generatedKey = document.getElementById("generated-key");
const copyGeneratedKey = document.getElementById("copy-generated-key");
let registrationRequest;

function resetRegistration() {
  registrationRequest?.abort();
  registrationRequest = undefined;
  generatedKey.textContent = "";
  registrationSuccess.hidden = true;
  registrationForm.hidden = false;
  registrationForm.reset();
  registrationError.style.display = "none";
  registrationSubmit.disabled = false;
  registrationSubmit.textContent = "Generate API key";
}
registrationDialog.addEventListener("close", () => {
  if (!registrationDialog.open) resetRegistration();
});

function openRegistration() {
  setMenu(false);
  if (typeof registrationDialog.showModal === "function") {
    registrationDialog.showModal();
  } else {
    registrationDialog.setAttribute("open", "");
  }
  if (!registrationForm.hidden) registrationLabel.focus();
}

function closeRegistration() {
  resetRegistration();
  if (typeof registrationDialog.close === "function") {
    registrationDialog.close();
  } else {
    registrationDialog.removeAttribute("open");
  }
}

document.querySelectorAll(".register-trigger").forEach((trigger) => {
  trigger.addEventListener("click", openRegistration);
});
registrationClose.addEventListener("click", closeRegistration);
registrationDialog.addEventListener("click", (event) => {
  const bounds = registrationDialog.getBoundingClientRect();
  if (
    event.target === registrationDialog &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  )
    closeRegistration();
});

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  registrationError.style.display = "none";
  const label = registrationLabel.value.trim();
  if (!label) {
    registrationError.textContent =
      "Add a label so you can identify this key later.";
    registrationError.style.display = "block";
    registrationLabel.focus();
    return;
  }

  registrationSubmit.disabled = true;
  const controller = new AbortController();
  registrationRequest = controller;
  const originalLabel = registrationSubmit.textContent;
  registrationSubmit.textContent = "Generating";
  try {
    const response = await fetch(`${apiBase}/api-keys`, {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ label }),
    });
    const payload = await response.json().catch(() => ({}));
    if (controller.signal.aborted || registrationRequest !== controller) return;
    if (!response.ok) {
      throw new Error(
        payload.message ||
          payload.error ||
          "Could not generate an API key right now.",
      );
    }
    if (
      typeof payload.api_key !== "string" ||
      !payload.api_key.startsWith("ak_")
    ) {
      throw new Error(
        "The API returned an invalid key response. Please try again.",
      );
    }

    generatedKey.textContent = payload.api_key;
    registrationForm.hidden = true;
    registrationSuccess.hidden = false;
    registrationSuccess.focus();
  } catch (error) {
    if (controller.signal.aborted) return;
    registrationError.textContent =
      error.message || "Could not generate an API key right now.";
    registrationError.style.display = "block";
  } finally {
    if (registrationRequest === controller) {
      registrationRequest = undefined;
      registrationSubmit.disabled = false;
      registrationSubmit.textContent = originalLabel;
    }
  }
});

copyGeneratedKey.addEventListener("click", async () => {
  const key = generatedKey.textContent;
  const originalLabel = copyGeneratedKey.firstChild.textContent;
  try {
    if (!navigator.clipboard) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(key);
    copyGeneratedKey.firstChild.textContent = "Copied ";
  } catch (_) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(generatedKey);
    selection.removeAllRanges();
    selection.addRange(range);
    copyGeneratedKey.firstChild.textContent = "Selected ";
  }
  setTimeout(() => {
    copyGeneratedKey.firstChild.textContent = originalLabel;
  }, 1800);
});

let renderedItems = [];
let pollTimer;
let retryTimer;
let pollFailures = 0;
const seenItems = new Set();

function normalizeFeedItem(raw) {
  return {
    type: ["exec", "reg", "relay"].includes(raw.type) ? raw.type : "exec",
    typeLabel: raw.typeLabel || raw.type_label || "EXEC",
    agent: raw.agent || "agent-unknown",
    detail: raw.detail || "Execution update",
    hash: raw.hash || "pending",
    status: raw.status === "ok" ? "ok" : "pending",
    confirm: raw.confirm || "Pending",
  };
}

function appendText(parent, className, value) {
  const node = document.createElement("div");
  node.className = className;
  node.textContent = value;
  parent.appendChild(node);
}

function renderFeedItem(raw) {
  const item = normalizeFeedItem(raw);
  const row = document.createElement("div");
  row.className = "feed-item";
  const type = document.createElement("div");
  type.className = `feed-type ${item.type}`;
  type.textContent = item.typeLabel;
  const info = document.createElement("div");
  appendText(info, "feed-agent", item.agent);
  appendText(info, "feed-detail", item.detail);
  const status = document.createElement("div");
  status.className = "feed-status";
  appendText(status, "feed-hash", item.hash);
  appendText(status, `feed-confirm ${item.status}`, item.confirm);
  row.append(type, info, status);
  feedBody.insertBefore(row, feedBody.firstChild);
  renderedItems.push(row);
  if (renderedItems.length > 8) renderedItems.shift()?.remove();
}

function setFeedMode(mode, label) {
  feedMode.className = `feed-mode ${mode}`;
  feedMode.textContent = label;
}

function feedKey(item) {
  return `${item.hash}|${item.agent}|${item.detail}`;
}

function seed(items) {
  feedBody.innerHTML = "";
  renderedItems = [];
  seenItems.clear();
  items
    .slice()
    .reverse()
    .forEach((item) => {
      seenItems.add(feedKey(item));
      renderFeedItem(item);
    });
}

async function fetchFeed() {
  const response = await fetch(`${apiBase}/feed/recent?limit=8`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Feed unavailable: ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload.items)) throw new Error("Invalid feed payload");
  return payload.items.map(normalizeFeedItem);
}

function startDemo() {
  clearInterval(pollTimer);
  pollTimer = undefined;
  setFeedMode("demo", "Demo");
  seed(demoFeed);

  if (!retryTimer) {
    retryTimer = setInterval(async () => {
      try {
        const items = await fetchFeed();
        if (!items.length) return;
        clearInterval(retryTimer);
        retryTimer = undefined;
        setFeedMode("", "Live");
        seed(items);
        startLivePolling();
      } catch (_) {}
    }, 15000);
  }
}

async function pollLiveFeed() {
  const items = await fetchFeed();
  pollFailures = 0;
  setFeedMode("", "Live");
  items
    .slice()
    .reverse()
    .forEach((item) => {
      const key = feedKey(item);
      if (!seenItems.has(key)) {
        seenItems.add(key);
        renderFeedItem(item);
      }
    });
}

function startLivePolling() {
  clearInterval(pollTimer);
  pollFailures = 0;
  pollTimer = setInterval(async () => {
    try {
      await pollLiveFeed();
    } catch (_) {
      pollFailures += 1;
      if (pollFailures >= 3) startDemo();
    }
  }, 8000);
}

async function bootFeed() {
  try {
    const items = await fetchFeed();
    if (!items.length) return startDemo();
    setFeedMode("", "Live");
    seed(items);
    startLivePolling();
  } catch (_) {
    startDemo();
  }
}
bootFeed();

const betaForm = document.getElementById("beta-form");
const formSubmit = document.getElementById("form-submit");
const formError = document.getElementById("form-error");

betaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.style.display = "none";
  const email = document.getElementById("f-email").value.trim();
  const project = document.getElementById("f-project").value.trim();
  if (
    !email ||
    !document.getElementById("f-email").validity.valid ||
    !project
  ) {
    formError.textContent = "Add a valid email and project name.";
    formError.style.display = "block";
    return;
  }

  formSubmit.disabled = true;
  const original = formSubmit.textContent;
  formSubmit.textContent = "Submitting";
  try {
    const data = new FormData(betaForm);
    data.append("name", project);
    data.append("source", "ardent-ai-research-site");
    data.append("_subject", "New Jusso Beta on Arc interest");
    if (!data.get("message"))
      data.set("message", "Interested in the Jusso Beta on Arc.");
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    const payload = await response.json();
    if (!response.ok || !payload.success) {
      throw new Error(
        payload.message || "Submission failed. Please try again.",
      );
    }
    betaForm.style.display = "none";
    document.getElementById("form-success").style.display = "block";
  } catch (error) {
    formError.textContent = error.message || "Could not submit right now.";
    formError.style.display = "block";
  } finally {
    formSubmit.disabled = false;
    formSubmit.textContent = original;
  }
});
