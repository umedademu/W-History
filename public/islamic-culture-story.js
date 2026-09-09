import { places, zones, scenes } from "./islamic-culture-scenes.js?v=0.031";
import { mountStory } from "./history-story.js?v=0.047";

mountStory({ places, zones, scenes, imageDirectory: "islamic-culture" });
