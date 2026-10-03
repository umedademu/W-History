import {bookChapters} from './book-chapters.js?v=0.068';
import {modernLessons, modernSeries} from './modern-volumes.js?v=0.115';

// 章・回の番号は各巻の中で扱う。従来の教材の識別名は維持する。
export const bookCollections = [
  {id:'ancient', title:'古代・中世・近世', chapters:bookChapters},
  {id:'modern', title:'近代・現代', chapters:[
    {number:1, title:'国民国家の形成', lessons:modernLessons, volumes:modernSeries}
  ]}
];
