const tabs = [...document.querySelectorAll('[data-book-tab]')];
const panels = [...document.querySelectorAll('[data-book-panel]')];
const available = id => tabs.some(tab => tab.dataset.bookTab === id);
const query = new URL(location.href).searchParams.get('book');
let saved;
try { saved = localStorage.getItem('w-history-book'); } catch {}
const fragmentBook = location.hash.startsWith('#modern-') ? 'modern' : /^#(?:ancient-|chapter-|lesson-)/.test(location.hash) ? 'ancient' : null;
const initial = available(query) ? query : fragmentBook ?? (available(saved) ? saved : 'ancient');

function select(id, updateUrl = false) {
  for (const tab of tabs) {
    const active = tab.dataset.bookTab === id;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  }
  for (const panel of panels) panel.hidden = panel.dataset.bookPanel !== id;
  try { localStorage.setItem('w-history-book', id); } catch {}
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('book', id);
    url.hash = id + '-book';
    history.replaceState(null, '', url);
  }
}

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => select(tab.dataset.bookTab, true));
  tab.addEventListener('keydown', event => {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    tabs[next].focus();
    select(tabs[next].dataset.bookTab, true);
  });
}
select(initial);
document.querySelector('[data-book-tabs]').hidden = false;
