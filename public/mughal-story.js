import { sourceEdition } from "./source-edition.js?v=0.051";
import { places, zones } from "./mughal-scenes.js?v=0.051";
import { mountStory } from "./history-story.js?v=0.051";

const scenes=sourceEdition["mughal"];
mountStory({ places, zones, scenes, imageDirectory: "mughal" });
