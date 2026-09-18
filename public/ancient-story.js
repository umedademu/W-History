import {ancientEdition,ancientPlaces} from './ancient-edition.js?v=0.066';
import {ancientSeries} from './ancient-volumes.js?v=0.066';
import {mountStory} from './history-story.js?v=0.066';
import {volumeNavigation} from './story-volumes.js?v=0.066';

const id=location.pathname.split('/').pop().replace(/-story\.html$/,'');
const volume=ancientSeries.find(v=>v.id===id);
mountStory({places:ancientPlaces,zones:{},scenes:ancientEdition[id],imageDirectory:'ancient',
  chapterNavigation:volumeNavigation(volume),
  baseMap:{href:'/ottoman-world-map.svg',width:1440,height:720,project:([lon,lat])=>[(lon+180)*4,(90-lat)*4]}});
