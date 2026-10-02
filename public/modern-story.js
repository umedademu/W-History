import {modernEdition, modernPlaces, sourcePages} from './modern-c01-l01-edition.js?v=0.110';
import {modernSeries} from './modern-volumes.js?v=0.110';
import {volumeNavigation} from './story-volumes.js?v=0.110';
import {modernDiagramFor, modernReferencePages} from './modern-story-support.js?v=0.110';
import {mountStory} from './history-story.js?v=0.110';

const id = location.pathname.split('/').pop().replace(/-story\.html$/, '');
const volume = modernSeries.find(item => item.id === id);
if (!volume) throw new Error('教材が見つかりません: ' + id);
const scenes = modernEdition[id];
function showReference(scene, index) {
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

mountStory({places:modernPlaces, zones:{}, scenes, imageDirectory:'ancient', chapterNavigation:volumeNavigation(volume),
  baseMap:{href:'/ottoman-world-map.svg', width:1440, height:720, project:([lon,lat])=>[(lon+180)*4,(90-lat)*4]},
  onSceneChange:showReference});
