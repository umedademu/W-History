// 第6章の公開教材。原文照合用の旧区分はsectionsに保持する。
export const islamicLessons=[{lesson:20,title:'イスラーム世界の形成'},{lesson:21,title:'イスラーム専制帝国の繁栄'}];
export const islamicSeries=[
  { id: "islam-origin", label: "イスラーム教の成立〜正統カリフ時代", number: "01", lesson: 20, part: 1, sections: ["islam-origin"] },
  { id: "umayyad-abbasid", label: "ウマイヤ朝とアッバース朝", number: "02", lesson: 20, part: 2, sections: ["umayyad-abbasid"] },
  { id: "regional-dynasties", label: "3カリフの並立とイスラーム世界の変容", number: "03", lesson: 20, part: 3, sections: ["regional-dynasties", "seljuq"] },
  { id: "western-dynasties", label: "地方政権の興亡", number: "04", lesson: 20, part: 4, sections: ["western-dynasties", "african-kingdoms"] },
  { id: "timur", label: "ティムール朝", number: "05", lesson: 21, part: 1, sections: ["timur", "timur-after"] },
  { id: "safavid", label: "サファヴィー朝", number: "06", lesson: 21, part: 2, sections: ["safavid"] },
  { id: "ottoman", label: "オスマン帝国", number: "07", lesson: 21, part: 3, sections: ["ottoman", "ottoman-expansion", "ottoman-height"] },
  { id: "mughal", label: "ムガル帝国", number: "08", lesson: 21, part: 4, sections: ["mughal"] },
  { id: "islamic-culture", label: "イスラーム文化", number: "09", lesson: 21, part: 5, sections: ["islamic-culture"] }
].map(v=>({...v,chapter:6}));
