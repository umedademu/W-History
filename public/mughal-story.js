import { places, zones, scenes } from "./mughal-scenes.js?v=0.020";
import { mountStory } from "./history-story.js?v=0.009";

mountStory({ places, zones, scenes, imageDirectory: "mughal" });
