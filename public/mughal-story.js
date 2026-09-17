import { sourceEdition } from "./source-edition.js?v=0.057";
import { places, zones } from "./mughal-scenes.js?v=0.057";
import { mountStory } from "./history-story.js?v=0.057";

const scenes=sourceEdition["mughal"];
mountStory({ places, zones, scenes, imageDirectory: "mughal" });
