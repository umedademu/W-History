import { sourceEdition } from "./source-edition.js?v=0.063";
import { places, zones } from "./islam-origin-scenes.js?v=0.063";
import { mountStory } from "./history-story.js?v=0.063";

const scenes=sourceEdition["islam-origin"];
mountStory({ places, zones, scenes, imageDirectory: "islam-origin" });
