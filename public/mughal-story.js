import { sourceEdition } from "./source-edition.js?v=0.053";
import { places, zones } from "./mughal-scenes.js?v=0.053";
import { mountStory } from "./history-story.js?v=0.053";

const scenes=sourceEdition["mughal"];
mountStory({ places, zones, scenes, imageDirectory: "mughal" });
