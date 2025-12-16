
import leoImg from "../data/Leo_child.png";
import avaImg from "../data/ava.png";
import avaOutsideImg from "../data/ava_outside.png";
import avaHomeImg from "../data/ava_home.png";
import avaSchoolImg from "../data/ava_school.png";

import avaOutsideHeadImg from "../data/ava_outside_head.png";
import avaOutsideChestImg from "../data/ava_outside_chest.png";
import avaOutsideStomachImg from "../data/ava_outside_stomach.png";
import avaOutsideLegImg from "../data/ava_outside_leg.png";
import avaOutsideThroatImg from "../data/ava_outside_throat.png";

import avaOutsideStomachSevereImg from "../data/ava_ouside_stomach_severe.png";
import avaOutsideEmergencyImg from "../data/ava_outside_emergency.png";


export const HEROES = [
  {
    id: "leo_child",
    label: "Leo",
    ageGroup: "5-12",
    region: "western",
    description: "An 8-year-old Western boy, playful but gentle.",
    basePrompt:
      "A soft, non-vibrant cartoon-style illustration of a 6-year-old boy standing alone in a neutral hero pose, facing forward. The boy wears a simple, child-friendly superhero-inspired outfit with a small emblem and light cape. Simple, minimal background.",
    imageUrl: leoImg
  },
  {
    id: "ava_child",
    label: "Ava",
    ageGroup: "5-12",
    region: "western",
    description: "An 8-year-old Western girl, bright and calm.",
    basePrompt:
      "A soft, non-vibrant cartoon-style illustration of a 6-year-old girl standing alone in a neutral hero pose, facing forward. The girl wears a simple, child-friendly superhero-inspired outfit with a small emblem and light cape. Simple, minimal background.",
    imageUrl: avaImg
  }
];

// id:ava_child ,scenaro:outside ,imageUrl

export const HERO_SCENARIO_ = {
  ava_child: {
    outside: {
      imageUrl: avaOutsideImg
    },
    home: {
      imageUrl: avaHomeImg
    },
    school: {
      imageUrl: avaSchoolImg
    }
  }
};


export const HERO_SCENARIO_SYMPTOMS = {
  ava_child: {
    outside: {
      head: {
        imageUrl: avaOutsideHeadImg
      },
      chest: {
        imageUrl: avaOutsideChestImg
      },
      stomach: {
        imageUrl: avaOutsideStomachImg
      },
      leg: {
        imageUrl: avaOutsideLegImg
      },
      throat: {
        imageUrl: avaOutsideThroatImg
      },
      emergency:{
        imageUrl: avaOutsideEmergencyImg
      }
    }
  }
};


export const HERO_SCENARIO_SYMPTOM_WITH_SRVERITY = {
  ava_child: {
    outside: {
      stomach: {
        severe: {
          imageUrl: avaOutsideStomachSevereImg
        }
      }
    }
  }
};
