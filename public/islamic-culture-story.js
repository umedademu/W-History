import { places, zones, scenes } from "./islamic-culture-scenes.js?v=0.019";
import { mountStory } from "./history-story.js?v=0.009";

mountStory({ places, zones, scenes, imageDirectory: "islamic-culture" });
