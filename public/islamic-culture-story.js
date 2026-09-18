import { sourceEdition } from "./source-edition.js?v=0.064";
import { places, zones } from "./islamic-culture-scenes.js?v=0.031";
import { mountStory } from "./history-story.js?v=0.068";

import {volumeNavigation} from './story-volumes.js?v=0.068';

const chapterNavigation=volumeNavigation({id:'islamic-culture'});
const scenes=sourceEdition["islamic-culture"];
mountStory({ places, zones, scenes, chapterNavigation, imageDirectory: "islamic-culture" });
