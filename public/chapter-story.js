import {series,volumeNavigation} from './story-volumes.js?v=0.080';
import {mountStory} from './history-story.js?v=0.080';
const id=location.pathname.split('/').pop().replace(/-story\.html$/,'');
const volume=series.find(v=>v.id===id);
const {chapterEdition,chapterPlaces}=await import('./chapter-'+String(volume.chapter).padStart(2,'0')+'-edition.js?v=0.080');
mountStory({places:chapterPlaces,zones:{},scenes:chapterEdition[id],imageDirectory:'ancient',chapterNavigation:volumeNavigation(volume),baseMap:{href:'/ottoman-world-map.svg',width:1440,height:720,project:([lon,lat])=>[(lon+180)*4,(90-lat)*4]}});
