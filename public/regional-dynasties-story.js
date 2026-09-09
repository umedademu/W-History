import { places, zones, scenes } from "./regional-dynasties-scenes.js?v=0.047";
import { mountStory } from "./history-story.js?v=0.047";
import { selectChapter, mountChapter } from "./story-chapters.js?v=0.047";

const selection = selectChapter("regional-dynasties", scenes, location.search);
const chapterNavigation = mountChapter(selection);
mountStory({ places, zones, scenes:selection.scenes, imageDirectory: "regional-dynasties", chapterNavigation });
