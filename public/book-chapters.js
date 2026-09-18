import {ancientSeries,ancientLessons} from './ancient-volumes.js?v=0.068';
import {islamicSeries,islamicLessons} from './islamic-volumes.js?v=0.068';
import {chapterSeries as series2,chapterLessons as lessons2} from './chapter-02-volumes.js?v=0.068';
import {chapterSeries as series3,chapterLessons as lessons3} from './chapter-03-volumes.js?v=0.068';
import {chapterSeries as series4,chapterLessons as lessons4} from './chapter-04-volumes.js?v=0.068';
import {chapterSeries as series5,chapterLessons as lessons5} from './chapter-05-volumes.js?v=0.068';
import {chapterSeries as series7,chapterLessons as lessons7} from './chapter-07-volumes.js?v=0.068';

export const bookChapters=[
  {number:1,title:'オリエント・インドの古代文明',lessons:ancientLessons,volumes:ancientSeries},
  {number:2,title:'古代の地中海世界',lessons:lessons2,volumes:series2},
  {number:3,title:'古代の東アジア',lessons:lessons3,volumes:series3},
  {number:4,title:'中世ヨーロッパ',lessons:lessons4,volumes:series4},
  {number:5,title:'東アジア世界の変容',lessons:lessons5,volumes:series5},
  {number:6,title:'イスラーム世界',lessons:islamicLessons,volumes:islamicSeries},
  {number:7,title:'近代ヨーロッパの幕開け',lessons:lessons7,volumes:series7}
];
export const addedChapterNumbers=[2,3,4,5,7];
