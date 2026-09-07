import { places, zones, scenes } from "./umayyad-abbasid-scenes.js?v=0.029";
import { mountStory } from "./history-story.js?v=0.035";

mountStory({ places, zones, scenes, imageDirectory: "umayyad-abbasid" });
