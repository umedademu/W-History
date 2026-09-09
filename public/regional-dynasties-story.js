import { sourceEdition } from "./source-edition.js?v=0.051";
import { places, zones } from "./regional-dynasties-scenes.js?v=0.051";
import { mountStory } from "./history-story.js?v=0.051";
import { selectVolume, volumeNavigation } from "./story-volumes.js?v=0.051";

const scenes=['regional-dynasties','seljuq','western-dynasties','african-kingdoms'].flatMap(id=>sourceEdition[id]);
const selection = selectVolume("regional-dynasties", scenes, location.pathname);
const chapterNavigation = volumeNavigation(selection);
mountStory({ places, zones, scenes:selection.scenes, imageDirectory: "regional-dynasties", chapterNavigation });
