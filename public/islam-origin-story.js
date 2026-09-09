import { sourceEdition } from "./source-edition.js?v=0.050";
import { places, zones } from "./islam-origin-scenes.js?v=0.050";
import { mountStory } from "./history-story.js?v=0.050";

const scenes=sourceEdition["islam-origin"];
mountStory({ places, zones, scenes, imageDirectory: "islam-origin" });
