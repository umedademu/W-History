import { sourceEdition } from "./source-edition.js?v=0.051";
import { places, zones } from "./islam-origin-scenes.js?v=0.051";
import { mountStory } from "./history-story.js?v=0.051";

const scenes=sourceEdition["islam-origin"];
mountStory({ places, zones, scenes, imageDirectory: "islam-origin" });
