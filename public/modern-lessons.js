// 回ごとの原文・地理・図・画像配置を専用の入口にまとめる。
import {modernEdition as firstEdition, modernPlaces as firstPlaces, sourcePages as firstPages} from './modern-c01-l01-edition.js?v=0.113';
import {modernEdition as secondEdition, modernPlaces as secondPlaces, sourcePages as secondPages} from './modern-c01-l02-edition.js?v=0.113';
import {modernEdition as thirdEdition, modernPlaces as thirdPlaces, sourcePages as thirdPages} from './modern-c01-l03-edition.js?v=0.113';
import {modernVisualEdition as firstVisuals, modernIllustrationFor as firstIllustration} from './modern-story-visuals.js?v=0.113';
import {modernVisualEdition as secondVisuals, modernIllustrationFor as secondIllustration} from './modern-story-visuals-02.js?v=0.113';
import {modernVisualEdition as thirdVisuals, modernIllustrationFor as thirdIllustration} from './modern-story-visuals-03.js?v=0.113';
import {modernDiagramFor as firstDiagram, modernReferencePages as firstReferences} from './modern-story-support.js?v=0.113';
import {modernDiagramFor as secondDiagram, modernReferencePages as secondReferences} from './modern-story-support-02.js?v=0.113';
import {modernDiagramFor as thirdDiagram, modernReferencePages as thirdReferences} from './modern-story-support-03.js?v=0.113';

const lessons = {
  1:{places:firstPlaces,illustration:firstIllustration,diagram:firstDiagram,references:firstReferences},
  2:{places:secondPlaces,illustration:secondIllustration,diagram:secondDiagram,references:secondReferences},
  3:{places:thirdPlaces,illustration:thirdIllustration,diagram:thirdDiagram,references:thirdReferences}
};
const lessonFor = scene => {
  const lesson=lessons[scene.sourceText.lesson];
  if(!lesson)throw new Error('未登録の近代教材: '+scene.sourceText.lesson);
  return lesson;
};
export const modernEdition = {...firstEdition, ...secondEdition, ...thirdEdition};
export const modernVisualEdition = {...firstVisuals, ...secondVisuals, ...thirdVisuals};
export const sourcePages = {...firstPages, ...secondPages, ...thirdPages};
export const modernPlacesFor = scene => lessonFor(scene).places;
export const modernIllustrationFor = scene => lessonFor(scene).illustration(scene);
export const modernDiagramFor = scene => lessonFor(scene).diagram(scene);
export const modernReferencePages = (scene, volume, index) => lessonFor(scene).references(scene, volume, index);
