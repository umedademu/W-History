import { places, zones, scenes } from "./mughal-scenes.js?v=0.049";
import { mountStory } from "./history-story.js?v=0.049";

mountStory({ places, zones, scenes, imageDirectory: "mughal" });
