const STORAGE_KEY = "markdownnote:data";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// Markdown helpers
const helpers = {
  bold: (t) => `**${t}**`,
  italic: (t) => `_${t}_`,
  link: (t, u) => `[${t}](${u})`,
  image: (a, u) => `![${a}](${u})`,
  list: (items, ol = false) => {
    const tag = ol ? "ol" : "ul";
    return items.map(i => `<li>${i}</li>`).join("");
  }
};

// State
let html = localStorage.getItem(STORAGE_KEY) || "# Catatan Baru";
let preview = marked(html);

// Renderers
const renderers = {
  text: () => {
    const note = $("#note");
    const preview = $("#preview");
    note.value = html;
    marked.parse(html, { renderer: new marked.Renderer() }, (err, content) => {
      if (err) return;
      preview.innerHTML = content;
    });
  }
};

function initMarked() {
  // Initialize marked with basic renderer
  marked.setOptions {
    renderer: new marked.Renderer()
  };
}

function save() { localStorage.setItem(STORAGE_KEY, $("#note").value); }
function load() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { $("#note").value = saved; updatePreview(); }
}
function updatePreview() {
  const html = $("#note").value;
  marked.parse(html, {}, (err, content) => {
    if (err) { $("#preview").innerHTML = "<p>Error parsing Markdown</p>"; return; }
    $("#preview").innerHTML = content;
  });
}
function exportMD() { const blob = new Blob([$("#note").value], { type: "text/markdown" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "catatan.md"; a.click(); URL.revokeObjectURL(url); }
function exportHTML() { const blob = new Blob([$("#preview").innerHTML], { type: "text/html" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "catatan.html"; a.click(); URL.revokeObjectURL(url); }

function initEvents() {
  $("#note").addEventListener("input", () => {
    save();
    updatePreview();
  });
  $("#exportMd").addEventListener("click", exportMD);
  $("#exportHtml").addEventListener("click", exportHTML);
}

document.addEventListener("DOMContentLoaded", () => {
  load();
  initEvents();
});