document.addEventListener("DOMContentLoaded", () => {
    const selectors = Array.from(document.querySelectorAll("[data-catch-select]"));
    const popups = Array.from(document.querySelectorAll("[data-catch-popup]"));
    const backdrop = document.querySelector("[data-panel-backdrop]");
    const panel = document.querySelector("[data-panel]");
    const openPanel = document.querySelector("[data-open-panel]");
    const closePanel = document.querySelector("[data-close-panel]");
    const pageContent = document.querySelector("#page-content");
    let lastSelector = selectors[0] || null;

    function selectCatch(id) {
        popups.forEach((popup) => {
            popup.hidden = popup.dataset.catchId !== id;
        });
        selectors.forEach((selector) => {
            selector.setAttribute("aria-pressed", String(selector.dataset.catchId === id));
        });
    }

    selectors.forEach((selector) => {
        selector.addEventListener("click", () => {
            lastSelector = selector;
            selectCatch(selector.dataset.catchId);
        });
    });

    document.querySelectorAll("[data-close-popup]").forEach((button) => {
        button.addEventListener("click", () => {
            selectCatch(null);
            if (lastSelector) lastSelector.focus();
        });
    });

    function hidePanel() {
        backdrop.hidden = true;
        pageContent.inert = false;
        openPanel.focus();
    }

    openPanel.addEventListener("click", () => {
        backdrop.hidden = false;
        pageContent.inert = true;
        closePanel.focus();
    });
    closePanel.addEventListener("click", hidePanel);
    backdrop.addEventListener("click", (event) => {
        if (event.target === backdrop) hidePanel();
    });

    document.addEventListener("keydown", (event) => {
        if (!backdrop.hidden && event.key === "Escape") {
            event.preventDefault();
            hidePanel();
        } else if (!backdrop.hidden && event.key === "Tab") {
            const focusable = Array.from(panel.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        } else if (event.key === "Escape" && popups.some((popup) => !popup.hidden)) {
            selectCatch(null);
            if (lastSelector) lastSelector.focus();
        }
    });
});