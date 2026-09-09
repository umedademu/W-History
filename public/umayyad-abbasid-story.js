import { sourceEdition } from "./source-edition.js?v=0.050";
import { places, zones } from "./umayyad-abbasid-scenes.js?v=0.050";
import { mountStory } from "./history-story.js?v=0.050";

const scenes=sourceEdition["umayyad-abbasid"];
mountStory({ places, zones, scenes, imageDirectory: "umayyad-abbasid" });
