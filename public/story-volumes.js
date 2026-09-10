// 共有の場面データから、独立した各教材の読む順番を定義する。
export const splitVolumes = [
  {
    "title": "イスラーム世界の分裂と三カリフ",
    "pages": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "description": "西方での三カリフの並立から、東方のイラン人政権とイクター制へ。原文の本文に沿ってたどります。",
    "source": "regional-dynasties",
    "id": "regional-dynasties"
  },
  {
    "title": "トルコ人の台頭とセルジューク朝",
    "pages": [
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15
    ],
    "description": "トルコ人のイスラーム化から、セルジューク朝の成立・統治・分裂までを原文の本文でたどります。",
    "source": "regional-dynasties",
    "id": "seljuq"
  },
  {
    "title": "西方・エジプト・北インドの諸王朝",
    "pages": [
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28
    ],
    "description": "北アフリカとイベリア半島、エジプト、北インドの順に、各地の王朝をたどります。",
    "source": "regional-dynasties",
    "id": "western-dynasties"
  },
  {
    "title": "アフリカの諸王国と交易",
    "pages": [
      29,
      30,
      31,
      32,
      33,
      34
    ],
    "description": "古代のナイル流域から、西・東・南部アフリカの王国と交易へ進みます。",
    "source": "regional-dynasties",
    "id": "african-kingdoms"
  },
  {
    "title": "オスマン帝国 — 建国とバルカン進出",
    "pages": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
    ],
    "description": "アナトリアの小国家からバルカンへ。軍制の整備、アンカラの敗北と復活をたどります。",
    "source": "ottoman",
    "id": "ottoman"
  },
  {
    "title": "オスマン帝国 — 都の征服とイスラーム世界への拡大",
    "pages": [
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16
    ],
    "description": "コンスタンティノープル征服と多宗教の統治から、セリム1世の東方・エジプト征服へ進みます。",
    "source": "ottoman",
    "id": "ottoman-expansion"
  },
  {
    "title": "オスマン帝国 — 最盛期とその後",
    "pages": [
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26
    ],
    "description": "スレイマン1世の最盛期から、軍制・国際関係の変化とチューリップ時代をたどります。",
    "source": "ottoman",
    "id": "ottoman-height"
  }
];

export const series = [
  {
    "id": "islam-origin",
    "label": "イスラーム成立",
    "number": "01"
  },
  {
    "id": "umayyad-abbasid",
    "label": "ウマイヤ・アッバース",
    "number": "02"
  },
  {
    "id": "regional-dynasties",
    "label": "イスラーム世界の分裂と三カリフ",
    "number": "03"
  },
  {
    "id": "seljuq",
    "label": "トルコ人の台頭とセルジューク朝",
    "number": "04"
  },
  {
    "id": "western-dynasties",
    "label": "西方・エジプト・北インドの諸王朝",
    "number": "05"
  },
  {
    "id": "african-kingdoms",
    "label": "アフリカの諸王国と交易",
    "number": "06"
  },
  {
    "id": "timur",
    "label": "ティムールの遠征とその後",
    "number": "07"
  },
  {
    "id": "safavid",
    "label": "サファヴィー",
    "number": "08"
  },
  {
    "id": "ottoman",
    "label": "オスマン帝国 — 建国とバルカン進出",
    "number": "09"
  },
  {
    "id": "ottoman-expansion",
    "label": "オスマン帝国 — 都の征服とイスラーム世界への拡大",
    "number": "10"
  },
  {
    "id": "ottoman-height",
    "label": "オスマン帝国 — 最盛期とその後",
    "number": "11"
  },
  {
    "id": "mughal",
    "label": "ムガル",
    "number": "12"
  },
  {
    "id": "islamic-culture",
    "label": "イスラーム文化",
    "number": "13"
  }
];

export function selectVolume(source, scenes, pathname) {
  const id = pathname.split('/').pop().replace(/-story\.html$/, '');
  const volume = splitVolumes.find(v => v.id === id && v.source === source);
  if (!volume) throw new Error('教材が見つかりません: ' + id);
  return {...volume, scenes:volume.pages.map(i => scenes[i])};
}

export function volumeNavigation(volume) {
  const next = series[series.findIndex(v => v.id === volume.id)+1];
  return {nextLabel:next ? '次の教材へ →' : '教材一覧へ →', finish:() => location.assign(next ? '/' + next.id + '-story.html' : '/')};
}
