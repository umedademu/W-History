import { places, zones, scenes } from "./regional-dynasties-scenes.js?v=0.049";
import { mountStory } from "./history-story.js?v=0.049";
import { selectVolume, volumeNavigation } from "./story-volumes.js?v=0.049";

const selection = selectVolume("regional-dynasties", scenes, location.pathname);
const chapterNavigation = volumeNavigation(selection);
mountStory({ places, zones, scenes:selection.scenes, imageDirectory: "regional-dynasties", chapterNavigation });
