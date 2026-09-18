import { sourceEdition } from "./source-edition.js?v=0.064";
import { places, zones } from "./mughal-scenes.js?v=0.064";
import { mountStory } from "./history-story.js?v=0.068";

import {volumeNavigation} from './story-volumes.js?v=0.068';

const chapterNavigation=volumeNavigation({id:'mughal'});
const scenes=sourceEdition["mughal"];
mountStory({ places, zones, scenes, chapterNavigation, imageDirectory: "mughal" });
