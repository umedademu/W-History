import {modernLessons as fifthLessons, modernSeries as fifthSeries} from './modern-lesson-05-volumes.js?v=0.115';
import {modernLessons as fourthLessons, modernSeries as fourthSeries} from './modern-lesson-04-volumes.js?v=0.115';
import {modernLessons as thirdLessons, modernSeries as thirdSeries} from './modern-lesson-03-volumes.js?v=0.115';
import {modernLessons as secondLessons, modernSeries as secondSeries} from './modern-lesson-02-volumes.js?v=0.115';
// 近代・現代 第1章第1回の5節。原文の節名と掲載順を保持。
const firstLessons = [
  {
    "lesson": 1,
    "title": "ウィーン体制とその崩壊"
  }
];
const firstSeries = [
  {
    "id": "modern-c01-l01-p01",
    "label": "ウィーン体制の成立",
    "lesson": 1,
    "part": 1,
    "book": "modern",
    "chapter": 1,
    "number": "01",
    "sections": [
      "modern-c01-l01-p01"
    ],
    "period": "1814〜1818年",
    "description": "ウィーン体制の成立について、原文に沿って背景と出来事のつながりをたどります。"
  },
  {
    "id": "modern-c01-l01-p02",
    "label": "ウィーン体制の動揺",
    "lesson": 1,
    "part": 2,
    "book": "modern",
    "chapter": 1,
    "number": "02",
    "sections": [
      "modern-c01-l01-p02"
    ],
    "period": "1820年代",
    "description": "ウィーン体制の動揺について、原文に沿って背景と出来事のつながりをたどります。"
  },
  {
    "id": "modern-c01-l01-p03",
    "label": "ラテンアメリカの独立",
    "lesson": 1,
    "part": 3,
    "book": "modern",
    "chapter": 1,
    "number": "03",
    "sections": [
      "modern-c01-l01-p03"
    ],
    "period": "1804〜1830年",
    "description": "ラテンアメリカの独立について、原文に沿って背景と出来事のつながりをたどります。"
  },
  {
    "id": "modern-c01-l01-p04",
    "label": "七月革命とその影響",
    "lesson": 1,
    "part": 4,
    "book": "modern",
    "chapter": 1,
    "number": "04",
    "sections": [
      "modern-c01-l01-p04"
    ],
    "period": "1821〜1834年",
    "description": "七月革命とその影響について、原文に沿って背景と出来事のつながりをたどります。"
  },
  {
    "id": "modern-c01-l01-p05",
    "label": "1848年革命（二月革命とその影響）",
    "lesson": 1,
    "part": 5,
    "book": "modern",
    "chapter": 1,
    "number": "05",
    "sections": [
      "modern-c01-l01-p05"
    ],
    "period": "1848〜1852年",
    "description": "1848年革命（二月革命とその影響）について、原文に沿って背景と出来事のつながりをたどります。"
  }
];

export const modernLessons = [...firstLessons, ...secondLessons, ...thirdLessons, ...fourthLessons, ...fifthLessons];
export const modernSeries = [...firstSeries, ...secondSeries, ...thirdSeries, ...fourthSeries, ...fifthSeries].map((volume,index)=>({...volume,number:String(index+1).padStart(2,'0')}));
