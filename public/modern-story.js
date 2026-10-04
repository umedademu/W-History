import {modernPlacesFor, sourcePages, modernDiagramFor, modernReferencePages, modernVisualEdition, modernIllustrationFor} from './modern-lessons.js?v=0.128';
import {modernSeries} from './modern-volumes.js?v=0.128';
import {initialPageIndex, volumeNavigation} from './story-volumes.js?v=0.128';
import {mountStory} from './history-story.js?v=0.128';

const id = location.pathname.split('/').pop().replace(/-story\.html$/, '');
const volume = modernSeries.find(item => item.id === id);
if (!volume) throw new Error('教材が見つかりません: ' + id);
const scenes = modernVisualEdition[id];
function showIllustration(scene) {
  const panel = document.getElementById('modern-illustration');
  const illustration = modernIllustrationFor(scene);
  panel.replaceChildren();
  panel.hidden = !illustration;
  if (!illustration) return;
  const heading = document.createElement('h3');
  heading.textContent = illustration.title;
  const note = document.createElement('p');
  note.className = 'illustration-note';
  note.textContent = '本文に沿う模式図';
  const groups = document.createElement('div');
  groups.className = 'illustration-groups';
  for (const group of illustration.groups) {
    const section = document.createElement('section');
    section.className = 'illustration-group';
    const title = document.createElement('h4');
    title.textContent = group.label;
    section.append(title);
    const figures = document.createElement('div');
    figures.className = 'illustration-figures';
    for (const item of group.figures) {
      const figure = document.createElement('figure');
      figure.className = 'illustration-figure' + (item.wide ? ' illustration-figure-wide' : '');
      const picture = document.createElement('img');
      const key = item.image.includes('/') ? item.image : 'modern-c01-l01/' + item.image;
      picture.src = '/images/' + key + (/\.(png|svg)$/.test(key) ? '' : '.png');
      picture.alt = item.name;
      picture.width = 192;
      picture.height = 192;
      const caption = document.createElement('figcaption');
      const name = document.createElement('strong');
      name.className = 'illustration-name';
      name.textContent = item.name;
      caption.append(name);
      if (item.caption) {
        const explanation = document.createElement('span');
        explanation.className = 'illustration-caption';
        explanation.textContent = item.caption;
        caption.append(explanation);
      }
      figure.append(picture, caption);
      figures.append(figure);
    }
    section.append(figures);
    groups.append(section);
  }
  panel.append(heading, note, groups);
}
function showReference(scene, index) {
  showIllustration(scene);
  const pages = modernReferencePages(scene, volume, index);
  document.getElementById('source-page-label').textContent = '原書 ' + scene.sourceText.sourcePages.join('・') + 'ページ';
  const details = document.getElementById('source-reference');
  details.open = false;
  document.getElementById('source-reference-body').innerHTML = pages.map(page => sourcePages[page]).join('');
  const panel = document.getElementById('modern-diagram');
  panel.replaceChildren();
  const diagram = modernDiagramFor(scene);
  panel.hidden = !diagram;
  if (diagram) {
    const heading = document.createElement('h3');
    heading.textContent = diagram.title;
    const note = document.createElement('p');
    note.className = 'diagram-note';
    note.textContent = '原書' + diagram.page + 'ページと本文に沿う関係図';
    const grid = document.createElement('div');
    grid.className = 'diagram-groups';
    for (const [title, ...lines] of diagram.columns) {
      const group = document.createElement('section');
      const name = document.createElement('h4');
      name.textContent = title;
      group.append(name);
      for (const line of lines) {
        const item = document.createElement('p');
        item.textContent = line;
        group.append(item);
      }
      grid.append(group);
    }
    panel.append(heading, note, grid);
  }
  history.replaceState(null, '', '#page-' + (index + 1));
}

mountStory({places:modernPlacesFor(scenes[0]), zones:{}, scenes, imageDirectory:'modern-c'+String(volume.chapter).padStart(2,'0')+'-l'+String(volume.lesson).padStart(2,'0'), chapterNavigation:volumeNavigation(volume),
  baseMap:{href:'/ottoman-world-map.svg', width:1440, height:720, project:([lon,lat])=>[(lon+180)*4,(90-lat)*4]},
  onSceneChange:showReference});

// 同じ教材内の場面リンクや戻る操作でも、表示を番号に合わせる。
window.addEventListener('hashchange', () => {
  const index = initialPageIndex(scenes.length, location.hash);
  document.querySelector(`button[data-scene="${index}"]`)?.click();
});
