import { places, zones, scenes } from "./mughal-scenes.js?v=0.046";
import { mountStory } from "./history-story.js?v=0.046";

mountStory({ places, zones, scenes, imageDirectory: "mughal" });
