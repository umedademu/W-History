import { sourceEdition } from "./source-edition.js?v=0.064";
import { places, zones } from "./umayyad-abbasid-scenes.js?v=0.064";
import { mountStory } from "./history-story.js?v=0.068";

import {volumeNavigation} from './story-volumes.js?v=0.068';

const chapterNavigation=volumeNavigation({id:'umayyad-abbasid'});
const scenes=sourceEdition["umayyad-abbasid"];
mountStory({ places, zones, scenes, chapterNavigation, imageDirectory: "umayyad-abbasid" });
