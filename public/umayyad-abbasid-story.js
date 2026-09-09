import { places, zones, scenes } from "./umayyad-abbasid-scenes.js?v=0.048";
import { mountStory } from "./history-story.js?v=0.048";

mountStory({ places, zones, scenes, imageDirectory: "umayyad-abbasid" });
