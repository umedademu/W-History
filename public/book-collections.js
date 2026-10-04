import {bookChapters} from './book-chapters.js?v=0.068';
import {modernLessons, modernSeries} from './modern-volumes.js?v=0.128';

// 章・回の番号は各巻の中で扱う。従来の教材の識別名は維持する。
export const bookCollections = [
  {id:'ancient', title:'古代・中世・近世', chapters:bookChapters},
  {id:'modern', title:'近代・現代', chapters:[
    ...[{number:1,title:'国民国家の形成'},{number:2,title:'列強の侵略とアジアの変革'},{number:3,title:'帝国主義と第一次世界大戦'},{number:4,title:'戦間期と第二次世界大戦'}].map(chapter=>{
      const volumes=modernSeries.filter(volume=>volume.chapter===chapter.number);
      const lessonNumbers=new Set(volumes.map(volume=>volume.lesson));
      return {...chapter,lessons:modernLessons.filter(lesson=>lessonNumbers.has(lesson.lesson)),volumes};
    })
  ]}
];
