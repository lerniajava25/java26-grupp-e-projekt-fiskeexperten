const { readFileSync } = require("node:fs");
const { runInNewContext } = require("node:vm");
const { test } = require("node:test");
const assert = require("node:assert/strict");

function setup() {
    const document = {
        listeners: {},
        addEventListener(type, callback) { this.listeners[type] = callback; }
    };
    function element(id) {
        return {
            dataset: id ? { catchId: id } : {},
            hidden: false,
            attributes: {},
            listeners: {},
            addEventListener(type, callback) { this.listeners[type] = callback; },
            setAttribute(name, value) { this.attributes[name] = value; },
            focus() { document.activeElement = this; },
            click(target = this) { this.listeners.click({ target }); }
        };
    }
    const selectors = [element("1"), element("2")];
    const popups = [element("1"), element("2")];
    popups[1].hidden = true;
    const popupClose = element();
    const backdrop = element();
    backdrop.hidden = true;
    const panel = element();
    const open = element();
    const close = element();
    const input = element();
    const page = element();
    panel.querySelectorAll = () => [close, input];
    const lists = { "[data-catch-select]": selectors, "[data-catch-popup]": popups, "[data-close-popup]": [popupClose] };
    const elements = { "[data-panel-backdrop]": backdrop, "[data-panel]": panel, "[data-open-panel]": open, "[data-close-panel]": close, "#page-content": page };
    document.querySelectorAll = (selector) => lists[selector];
    document.querySelector = (selector) => elements[selector];
    runInNewContext(readFileSync("src/main/resources/static/js/karta.js", "utf8"), { document });
    document.listeners.DOMContentLoaded();
    return { document, selectors, popups, popupClose, backdrop, panel, open, close, input, page };
}

function key(document, key, shiftKey = false) {
    const event = { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; } };
    document.listeners.keydown(event);
    return event;
}

test("catch selections and popup close share state and restore focus", () => {
    const ui = setup();
    ui.selectors[1].click();
    assert.equal(ui.popups[0].hidden, true);
    assert.equal(ui.popups[1].hidden, false);
    assert.equal(ui.selectors[1].attributes["aria-pressed"], "true");
    ui.popupClose.click();
    assert.equal(ui.popups[1].hidden, true);
    assert.equal(ui.document.activeElement, ui.selectors[1]);
});

test("panel traps focus and closes with Escape and backdrop", () => {
    const ui = setup();
    ui.open.click();
    assert.equal(ui.backdrop.hidden, false);
    assert.equal(ui.page.inert, true);
    assert.equal(ui.document.activeElement, ui.close);
    assert.equal(key(ui.document, "Tab", true).prevented, true);
    assert.equal(ui.document.activeElement, ui.input);
    assert.equal(key(ui.document, "Tab").prevented, true);
    assert.equal(ui.document.activeElement, ui.close);
    key(ui.document, "Escape");
    assert.equal(ui.backdrop.hidden, true);
    assert.equal(ui.page.inert, false);
    assert.equal(ui.document.activeElement, ui.open);
    ui.open.click();
    ui.backdrop.click(ui.panel);
    assert.equal(ui.backdrop.hidden, false);
    ui.backdrop.click();
    assert.equal(ui.backdrop.hidden, true);
});