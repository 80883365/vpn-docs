const body = document.body;
const menuButton = document.querySelector("[data-menu-button]");
const overlay = document.querySelector("[data-overlay]");

function closeNav() {
  body.classList.remove("nav-open");
}

if (menuButton) {
  menuButton.addEventListener("click", () => {
    body.classList.toggle("nav-open");
  });
}

if (overlay) {
  overlay.addEventListener("click", closeNav);
}

document.querySelectorAll(".sidebar a, .doc-nav a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

const searchInput = document.querySelector("[data-doc-search]");
if (searchInput) {
  const query = new URLSearchParams(window.location.search).get("q") || "";
  const targets = [...document.querySelectorAll("[data-searchable]")];
  searchInput.value = query;

  const applyFilter = (value) => {
    const normalized = value.trim().toLowerCase();
    targets.forEach((item) => {
      const text = item.dataset.searchable.toLowerCase();
      item.hidden = normalized && !text.includes(normalized);
    });
  };

  applyFilter(query);

  searchInput.addEventListener("input", (event) => {
    applyFilter(event.target.value);
  });
}

const tocLinks = [...document.querySelectorAll(".toc-links a")];
if (tocLinks.length) {
  const sections = tocLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (!visible) {
        return;
      }

      tocLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => observer.observe(section));
}
