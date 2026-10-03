// 回ごとの原文と表示計画を、専用の入口へまとめる。
import {modernEdition as firstEdition, modernPlaces as firstPlaces, sourcePages as firstPages} from './modern-c01-l01-edition.js?v=0.112';
import {modernEdition as secondEdition, modernPlaces as secondPlaces, sourcePages as secondPages} from './modern-c01-l02-edition.js?v=0.112';
import {modernVisualEdition as firstVisuals, modernIllustrationFor as firstIllustration} from './modern-story-visuals.js?v=0.112';
import {modernVisualEdition as secondVisuals, modernIllustrationFor as secondIllustration} from './modern-story-visuals-02.js?v=0.112';
import {modernDiagramFor as firstDiagram, modernReferencePages as firstReferences} from './modern-story-support.js?v=0.112';
import {modernDiagramFor as secondDiagram, modernReferencePages as secondReferences} from './modern-story-support-02.js?v=0.112';

export const modernEdition = {...firstEdition, ...secondEdition};
export const modernVisualEdition = {...firstVisuals, ...secondVisuals};
export const sourcePages = {...firstPages, ...secondPages};
export const modernPlacesFor = scene => scene.sourceText.lesson === 2 ? secondPlaces : firstPlaces;
export const modernIllustrationFor = scene => (scene.sourceText.lesson === 2 ? secondIllustration : firstIllustration)(scene);
export const modernDiagramFor = scene => (scene.sourceText.lesson === 2 ? secondDiagram : firstDiagram)(scene);
export const modernReferencePages = (scene, volume, index) => (scene.sourceText.lesson === 2 ? secondReferences : firstReferences)(scene, volume, index);
