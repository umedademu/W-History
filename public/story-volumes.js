// 書籍の第6章・第20回と第21回の目次に合わせた公開教材。
// 原文照合用の区分と場面は保持し、表示時に同じ節の内容をつなぐ。
export const series = [
  { id: "islam-origin", label: "イスラーム教の成立〜正統カリフ時代", number: "01", lesson: 20, part: 1, sections: ["islam-origin"] },
  { id: "umayyad-abbasid", label: "ウマイヤ朝とアッバース朝", number: "02", lesson: 20, part: 2, sections: ["umayyad-abbasid"] },
  { id: "regional-dynasties", label: "3カリフの並立とイスラーム世界の変容", number: "03", lesson: 20, part: 3, sections: ["regional-dynasties", "seljuq"] },
  { id: "western-dynasties", label: "地方政権の興亡", number: "04", lesson: 20, part: 4, sections: ["western-dynasties", "african-kingdoms"] },
  { id: "timur", label: "ティムール朝", number: "05", lesson: 21, part: 1, sections: ["timur", "timur-after"] },
  { id: "safavid", label: "サファヴィー朝", number: "06", lesson: 21, part: 2, sections: ["safavid"] },
  { id: "ottoman", label: "オスマン帝国", number: "07", lesson: 21, part: 3, sections: ["ottoman", "ottoman-expansion", "ottoman-height"] },
  { id: "mughal", label: "ムガル帝国", number: "08", lesson: 21, part: 4, sections: ["mughal"] },
  { id: "islamic-culture", label: "イスラーム文化", number: "09", lesson: 21, part: 5, sections: ["islamic-culture"] }
];

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
