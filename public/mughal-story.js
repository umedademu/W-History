import { places, zones, scenes } from "./mughal-scenes.js?v=0.006";
import { mountStory } from "./history-story.js?v=0.006";

mountStory({ places, zones, scenes, imageDirectory: "mughal" });
