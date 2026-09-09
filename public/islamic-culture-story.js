import { sourceEdition } from "./source-edition.js?v=0.051";
import { places, zones } from "./islamic-culture-scenes.js?v=0.031";
import { mountStory } from "./history-story.js?v=0.051";

const scenes=sourceEdition["islamic-culture"];
mountStory({ places, zones, scenes, imageDirectory: "islamic-culture" });
