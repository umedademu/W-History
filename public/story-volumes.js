import {bookChapters} from './book-chapters.js?v=0.068';
// 書籍の章・回・節の順に並べる。章内の番号は章ごとに振り直す。
export const series=bookChapters.flatMap(chapter=>chapter.volumes);

const pageRange = (start, length) => Array.from({ length }, (_, i) => start + i);
export const splitVolumes = [
  { id: "regional-dynasties", source: "regional-dynasties", pages: pageRange(0, 16) },
  { id: "western-dynasties", source: "regional-dynasties", pages: pageRange(16, 19) },
  { id: "ottoman", source: "ottoman", pages: pageRange(0, 27) }
].map(volume => ({ ...volume, title: series.find(item => item.id === volume.id).label }));

export function volumeScenes(edition, id) {
  const volume = series.find(item => item.id === id);
  if (!volume) throw new Error('教材が見つかりません: ' + id);
  return volume.sections.flatMap(section => edition[section]);
}

export function selectVolume(source, scenes, pathname) {
  const id = pathname.split('/').pop().replace(/-story\.html$/, '');
  const volume = splitVolumes.find(v => v.id === id && v.source === source);
  if (!volume) throw new Error('教材が見つかりません: ' + id);
  return { ...volume, scenes: volume.pages.map(i => scenes[i]) };
}

// 旧教材の入口から、統合後も同じ本文へ移動できるようにする。
export function initialPageIndex(length, hash) {
  const page = Number(/^#page-(\d+)$/.exec(hash)?.[1]);
  return Number.isSafeInteger(page) && page >= 1 && page <= length ? page - 1 : 0;
}

export function volumeNavigation(volume) {
  const next = series[series.findIndex(v => v.id === volume.id) + 1];
  return { nextLabel: next ? '次の教材へ →' : '教材一覧へ →', finish: () => location.assign(next ? '/' + next.id + '-story.html' : '/') };
}
