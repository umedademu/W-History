import { places, zones, scenes } from "./mughal-scenes.js?v=0.031";
import { mountStory } from "./history-story.js?v=0.045";

mountStory({ places, zones, scenes, imageDirectory: "mughal" });
