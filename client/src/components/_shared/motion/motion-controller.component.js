import { useEffect } from "react";

const motionRules = [
  ["h1, h2", "headline"],
  [".eyebrow", "eyebrow"],
  [".small-rule, .eyebrow--light > span", "rule"],
  [".inside-intro-pair-main, .ventadour-news-photo-main", "photo-back"],
  [".inside-intro-pair-overlap, .ventadour-news-photo-overlap", "photo-front"],
  [".editorial-arch-badge", "badge"],
  [".editorial-arch-leaves, .hero-leaf, .story-leaf, .cuisine-leaf, .location-leaf, .printed-menu-leaf", "botanical"],
  [".editorial-photo, .hero-arch, .cuisine-fish, .cuisine-dessert, .story-chef, .story-sign, .location-photo, .reservation-hero-image, .ventadour-news-image", "image"],
  [".quote-form, .contact-details-form", "form"],
  [".hero-copy, .hero-intro, .hero-actions, .hero-values, .hero-visual, .hero-aside, .cuisine-copy, .story-intro, .story-copy, .location-copy, .inside-intro-copy, .menu-philosophy-head, .menu-philosophy-body, .chef-editorial-copy, .catering-services-head, .cocktail-section-copy, .wedding-section-heading, .professionals-copy, .quote-section-intro, .contact-details-intro, .contact-detail-list, .contact-visit-copy, .ventadour-news-copy, .reservation-hero-copy, .reservation-flow-heading, .reservation-progress, .reservation-summary, .inside-outro-inner", "copy"],
  [".hero-value, .catering-service, .editorial-list li, .wedding-moments > div, .menu-template-course, .a-la-carte-group, .ventadour-news-entry", "stagger"],
  [".reservation-step-content", "step"],
];

const parallaxGroupSelector = ".inside-intro-pair, .ventadour-news-photo-pair";
const pagesWithPlayedMotion = new Set();

export default function MotionController() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return undefined;

    let activePath = window.location.pathname;
    let activePathHasPlayedMotion = false;
    const activeParallaxGroups = new Set();
    let parallaxFrame = 0;

    const syncPagePath = () => {
      const nextPath = window.location.pathname;
      if (nextPath === activePath) return;

      if (activePathHasPlayedMotion) pagesWithPlayedMotion.add(activePath);
      activePath = nextPath;
      activePathHasPlayedMotion = false;

      if (pagesWithPlayedMotion.has(activePath)) {
        document.querySelectorAll("[data-motion]").forEach((node) => {
          if (node.dataset.motionPath !== activePath) return;
          observer.unobserve(node);
          node.classList.add("is-in-view");
        });
      }
    };

    const updateParallax = () => {
      parallaxFrame = 0;
      if (window.innerWidth <= 900 || reducedMotion.matches) return;

      activeParallaxGroups.forEach((group) => {
        const bounds = group.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
        const travel = (0.5 - progress) * 34;
        group.querySelectorAll("[data-parallax-speed]").forEach((photo) => {
          const speed = Number(photo.dataset.parallaxSpeed) || 0;
          const image = photo.querySelector("img");
          if (image) image.style.setProperty("--parallax-y", `${travel * speed}px`);
        });
      });
    };

    const scheduleParallax = () => {
      if (!parallaxFrame && window.innerWidth > 900 && !reducedMotion.matches) {
        parallaxFrame = window.requestAnimationFrame(updateParallax);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.hasAttribute("data-parallax-group")) {
          if (entry.isIntersecting) activeParallaxGroups.add(entry.target);
          else activeParallaxGroups.delete(entry.target);
          if (entry.isIntersecting) scheduleParallax();
          return;
        }

        if (entry.isIntersecting) {
          entry.target.classList.add("is-in-view");
          if (entry.target.dataset.motionPath === activePath) activePathHasPlayedMotion = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });

    const observeNode = (node) => {
      if (node.hasAttribute("data-parallax-group")) return;
      if (!node.dataset.motionPath) node.dataset.motionPath = window.location.pathname;
      if (!node.dataset.motion || node.classList.contains("is-in-view")) return;
      if (pagesWithPlayedMotion.has(node.dataset.motionPath)) {
        node.classList.add("is-in-view");
        return;
      }
      observer.observe(node);
    };

    const unobserveTree = (root) => {
      if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
      if (root.dataset.motion || root.hasAttribute("data-parallax-group")) {
        observer.unobserve(root);
        activeParallaxGroups.delete(root);
      }
      root.querySelectorAll("[data-motion], [data-parallax-group]").forEach((node) => {
        observer.unobserve(node);
        activeParallaxGroups.delete(node);
      });
    };

    const scan = (root) => {
      if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
      syncPagePath();
      const elements = [root];
      motionRules.forEach(([selector, type]) => {
        const matches = [];
        if (root.matches(selector)) matches.push(root);
        root.querySelectorAll(selector).forEach((element) => matches.push(element));
        matches.forEach((element) => {
          if (!element.dataset.motion) element.dataset.motion = type;
          elements.push(element);
        });
      });

      if (root.matches(parallaxGroupSelector)) elements.push(root);
      root.querySelectorAll(parallaxGroupSelector).forEach((group) => elements.push(group));
      elements.forEach((group) => {
        if (!group.matches(parallaxGroupSelector) || group.hasAttribute("data-parallax-group")) return;
        const photos = group.querySelectorAll(".inside-intro-pair-main, .inside-intro-pair-overlap, .ventadour-news-photo-main, .ventadour-news-photo-overlap");
        if (photos.length < 2) return;
        group.setAttribute("data-parallax-group", "");
        photos[0].dataset.parallaxSpeed = "-0.55";
        photos[1].dataset.parallaxSpeed = "0.75";
        observer.observe(group);
      });
      elements.forEach(observeNode);
    };

    scan(document.body);
    document.documentElement.classList.add("motion-ready");

    const mutations = new MutationObserver((records) => {
      syncPagePath();
      records.forEach((record) => {
        record.addedNodes.forEach(scan);
        record.removedNodes.forEach(unobserveTree);
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("resize", scheduleParallax, { passive: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener("scroll", scheduleParallax);
      window.removeEventListener("resize", scheduleParallax);
      if (parallaxFrame) window.cancelAnimationFrame(parallaxFrame);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
