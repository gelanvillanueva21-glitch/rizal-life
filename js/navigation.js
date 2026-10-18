const sections = [...document.querySelectorAll(".section-anchor")],
  menu = document.querySelector("#chapter-menu"),
  scrim = document.querySelector("#menu-scrim"),
  toggle = document.querySelector("#menu-toggle"),
  close = document.querySelector("#menu-close"),
  links = [...document.querySelectorAll("[data-section]")],
  prev = document.querySelector("#prev-section"),
  next = document.querySelector("#next-section"),
  label = document.querySelector(".progress-label"),
  bar = document.querySelector("#progress-bar");
let activeIndex = 0,
  quizLocked = false;
function setMenu(open) {
  menu.classList.toggle("open", open);
  scrim.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  toggle.setAttribute("aria-expanded", String(open));
}
function setActive(index) {
  activeIndex = Math.max(0, Math.min(index, sections.length - 1));
  const current = sections[activeIndex];
  links.forEach((link) =>
    link.classList.toggle("active", link.dataset.section === current.id),
  );
  label.textContent = `${String(activeIndex + 1).padStart(2, "0")} / 07`;
  bar.style.width = `${((activeIndex + 1) / sections.length) * 100}%`;
  prev.disabled = activeIndex === 0 || quizLocked;
  next.disabled = activeIndex === sections.length - 1 || quizLocked;
}
function goTo(index) {
  if (!quizLocked) sections[index]?.scrollIntoView({ behavior: "smooth" });
}
toggle.addEventListener("click", () =>
  setMenu(!menu.classList.contains("open")),
);
close.addEventListener("click", () => setMenu(false));
scrim.addEventListener("click", () => setMenu(false));
links.forEach((link) =>
  link.addEventListener("click", (event) => {
    if (quizLocked) {
      event.preventDefault();
      return;
    }
    setMenu(false);
  }),
);
prev.addEventListener("click", () => goTo(activeIndex - 1));
next.addEventListener("click", () => goTo(activeIndex + 1));
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(sections.indexOf(entry.target));
    }),
  { rootMargin: "-35% 0px -55% 0px" },
);
sections.forEach((section) => observer.observe(section));
export function lockNavigation() {
  quizLocked = true;
  setMenu(false);
  toggle.disabled = true;
  prev.disabled = true;
  next.disabled = true;
}
export function unlockNavigation() {
  quizLocked = false;
  toggle.disabled = false;
  setActive(activeIndex);
}
setActive(0);
