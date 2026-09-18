import { sourceEdition } from "./source-edition.js?v=0.064";
import { places, zones } from "./islam-origin-scenes.js?v=0.064";
import { mountStory } from "./history-story.js?v=0.068";

import {volumeNavigation} from './story-volumes.js?v=0.068';

const chapterNavigation=volumeNavigation({id:'islam-origin'});
const scenes=sourceEdition["islam-origin"];
mountStory({ places, zones, scenes, chapterNavigation, imageDirectory: "islam-origin" });
