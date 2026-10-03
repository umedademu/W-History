// 回ごとの原文・地理・図・画像配置を専用の入口にまとめる。
import {modernEdition as firstEdition, modernPlaces as firstPlaces, sourcePages as firstPages} from './modern-c01-l01-edition.js?v=0.120';
import {modernEdition as secondEdition, modernPlaces as secondPlaces, sourcePages as secondPages} from './modern-c01-l02-edition.js?v=0.120';
import {modernEdition as thirdEdition, modernPlaces as thirdPlaces, sourcePages as thirdPages} from './modern-c01-l03-edition.js?v=0.120';
import {modernVisualEdition as firstVisuals, modernIllustrationFor as firstIllustration} from './modern-story-visuals.js?v=0.120';
import {modernVisualEdition as secondVisuals, modernIllustrationFor as secondIllustration} from './modern-story-visuals-02.js?v=0.120';
import {modernVisualEdition as thirdVisuals, modernIllustrationFor as thirdIllustration} from './modern-story-visuals-03.js?v=0.120';
import {modernDiagramFor as firstDiagram, modernReferencePages as firstReferences} from './modern-story-support.js?v=0.120';
import {modernDiagramFor as secondDiagram, modernReferencePages as secondReferences} from './modern-story-support-02.js?v=0.120';
import {modernDiagramFor as thirdDiagram, modernReferencePages as thirdReferences} from './modern-story-support-03.js?v=0.120';

import {modernEdition as fourthEdition, modernPlaces as fourthPlaces, sourcePages as fourthPages} from './modern-c01-l04-edition.js?v=0.120';
import {modernVisualEdition as fourthVisuals, modernIllustrationFor as fourthIllustration} from './modern-story-visuals-04.js?v=0.120';
import {modernDiagramFor as fourthDiagram, modernReferencePages as fourthReferences} from './modern-story-support-04.js?v=0.120';

import {modernEdition as fifthEdition, modernPlaces as fifthPlaces, sourcePages as fifthPages} from './modern-c01-l05-edition.js?v=0.120';
import {modernVisualEdition as fifthVisuals, modernIllustrationFor as fifthIllustration} from './modern-story-visuals-05.js?v=0.120';
import {modernDiagramFor as fifthDiagram, modernReferencePages as fifthReferences} from './modern-story-support-05.js?v=0.120';

import {modernEdition as sixthEdition, modernPlaces as sixthPlaces, sourcePages as sixthPages} from './modern-c01-l06-edition.js?v=0.120';
import {modernVisualEdition as sixthVisuals, modernIllustrationFor as sixthIllustration} from './modern-story-visuals-06.js?v=0.120';
import {modernDiagramFor as sixthDiagram, modernReferencePages as sixthReferences} from './modern-story-support-06.js?v=0.120';

import {modernEdition as seventhEdition, modernPlaces as seventhPlaces, sourcePages as seventhPages} from './modern-c02-l07-edition.js?v=0.120';
import {modernVisualEdition as seventhVisuals, modernIllustrationFor as seventhIllustration} from './modern-story-visuals-07.js?v=0.120';
import {modernDiagramFor as seventhDiagram, modernReferencePages as seventhReferences} from './modern-story-support-07.js?v=0.120';

import {modernEdition as eighthEdition, modernPlaces as eighthPlaces, sourcePages as eighthPages} from './modern-c02-l08-edition.js?v=0.120';
import {modernVisualEdition as eighthVisuals, modernIllustrationFor as eighthIllustration} from './modern-story-visuals-08.js?v=0.120';
import {modernDiagramFor as eighthDiagram, modernReferencePages as eighthReferences} from './modern-story-support-08.js?v=0.120';

import {modernEdition as ninthEdition, modernPlaces as ninthPlaces, sourcePages as ninthPages} from './modern-c02-l09-edition.js?v=0.120';
import {modernVisualEdition as ninthVisuals, modernIllustrationFor as ninthIllustration} from './modern-story-visuals-09.js?v=0.120';
import {modernDiagramFor as ninthDiagram, modernReferencePages as ninthReferences} from './modern-story-support-09.js?v=0.120';

import {modernEdition as tenthEdition, modernPlaces as tenthPlaces, sourcePages as tenthPages} from './modern-c02-l10-edition.js?v=0.120';
import {modernVisualEdition as tenthVisuals, modernIllustrationFor as tenthIllustration} from './modern-story-visuals-10.js?v=0.120';
import {modernDiagramFor as tenthDiagram, modernReferencePages as tenthReferences} from './modern-story-support-10.js?v=0.120';

const lessons = {
  1:{places:firstPlaces,illustration:firstIllustration,diagram:firstDiagram,references:firstReferences},
  2:{places:secondPlaces,illustration:secondIllustration,diagram:secondDiagram,references:secondReferences},
  3:{places:thirdPlaces,illustration:thirdIllustration,diagram:thirdDiagram,references:thirdReferences},
  4:{places:fourthPlaces,illustration:fourthIllustration,diagram:fourthDiagram,references:fourthReferences},
  5:{places:fifthPlaces,illustration:fifthIllustration,diagram:fifthDiagram,references:fifthReferences},
  6:{places:sixthPlaces,illustration:sixthIllustration,diagram:sixthDiagram,references:sixthReferences},
  7:{places:seventhPlaces,illustration:seventhIllustration,diagram:seventhDiagram,references:seventhReferences},
  8:{places:eighthPlaces,illustration:eighthIllustration,diagram:eighthDiagram,references:eighthReferences},
  9:{places:ninthPlaces,illustration:ninthIllustration,diagram:ninthDiagram,references:ninthReferences},
  10:{places:tenthPlaces,illustration:tenthIllustration,diagram:tenthDiagram,references:tenthReferences}
};
const lessonFor = scene => {
  const lesson=lessons[scene.sourceText.lesson];
  if(!lesson)throw new Error('未登録の近代教材: '+scene.sourceText.lesson);
  return lesson;
};
export const modernEdition = {...firstEdition, ...secondEdition, ...thirdEdition, ...fourthEdition, ...fifthEdition, ...sixthEdition, ...seventhEdition, ...eighthEdition, ...ninthEdition, ...tenthEdition};
export const modernVisualEdition = {...firstVisuals, ...secondVisuals, ...thirdVisuals, ...fourthVisuals, ...fifthVisuals, ...sixthVisuals, ...seventhVisuals, ...eighthVisuals, ...ninthVisuals, ...tenthVisuals};
export const sourcePages = {...firstPages, ...secondPages, ...thirdPages, ...fourthPages, ...fifthPages, ...sixthPages, ...seventhPages, ...eighthPages, ...ninthPages, ...tenthPages};
export const modernPlacesFor = scene => lessonFor(scene).places;
export const modernIllustrationFor = scene => lessonFor(scene).illustration(scene);
export const modernDiagramFor = scene => lessonFor(scene).diagram(scene);
export const modernReferencePages = (scene, volume, index) => lessonFor(scene).references(scene, volume, index);
