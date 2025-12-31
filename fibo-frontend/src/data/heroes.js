
const leoImg = "/support/Leo_child.png";
const avaImg = "/support/ava.png";
const sosImg = "/support/sos_img.png";







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
    imageUrl: avaImg,
  }
];
export const SOS_IMAGE = sosImg;
  
export const HERO_SCENARIO_ = {
  leo_child: {
    outside: { imageUrl: "/support/leo_outside.png" },
    school:  { imageUrl: "/support/leo_school.png" },
    home:    { imageUrl: "/support/leo_home.png" },
  },

  ava_child: {
    home:    { imageUrl: "/support/ava_home.png" },
    outside: { imageUrl: "/support/ava_outside.png" },
    school:  { imageUrl: "/support/ava_school.png" },
  },
};



export const HERO_SCENARIO_SYMPTOMS = {
  leo_child: {
    outside: {
      head: { imageUrl: "/support/leo_outside_head.png" },
      chest: { imageUrl: "/support/leo_outside_chest.png" },
      stomach: { imageUrl: "/support/leo_outside_stomach.png" },
      breathing_or_choking: {
        imageUrl: "/support/leo_outside_breathing_choking.png",
      },
    },

    school: {
      head: { imageUrl: "/support/leo_school_head.png" },
      chest: { imageUrl: "/support/leo_school_chest.png" },
      stomach: { imageUrl: "/support/leo_school_stomach.png" },
      breathing_or_choking: {
        imageUrl: "/support/leo_school_breathing_choking.png",
      },
    },

    home: {
      head: { imageUrl: "/support/leo_home_head.png" },
      chest: { imageUrl: "/support/leo_home_chest.png" },
      stomach: { imageUrl: "/support/leo_home_stomach.png" },
      breathing_or_choking: {
        imageUrl: "/support/leo_home_breathing_choking.png",
      },
    },
  },

  ava_child: {
    outside: {
      head: { imageUrl: "/support/ava_outside_head.png" },
      chest: { imageUrl: "/support/ava_outside_chest.png" },
      stomach: { imageUrl: "/support/ava_outside_stomach.png" },
      breathing_or_choking: {
        imageUrl: "/support/ava_outside_breathing_choking.png",
      },
    },

    home: {
      head: { imageUrl: "/support/ava_home_head.png" },
      chest: { imageUrl: "/support/ava_home_chest.png" },
      stomach: { imageUrl: "/support/ava_home_stomach.png" },
      breathing_or_choking: {
        imageUrl: "/support/ava_home_breathing_choking.png",
      },
    },

    school: {
      head: { imageUrl: "/support/ava_school_head.png" },
      chest: { imageUrl: "/support/ava_school_chest.png" },
      stomach: { imageUrl: "/support/ava_school_stomach.png" },
      breathing_or_choking: {
        imageUrl: "/support/ava_school_breathing_choking.png",
      },
    },
  },
};




export const HERO_SCENARIO_SYMPTOM_WITH_SRVERITY = {
  leo_child: {
    outside: {
      head: {
        severe: { imageUrl: "/support/leo_outside_head_severe.png" },
      },
      chest: {
        severe: { imageUrl: "/support/leo_outside_chest_severe.png" },
      },
      stomach: {
        severe: { imageUrl: "/support/leo_outside_stomach_severe.png" },
      },
    },

    school: {
      head: {
        severe: { imageUrl: "/support/leo_school_head_severe.png" },
      },
      chest: {
        severe: { imageUrl: "/support/leo_school_chest_severe.png" },
      },
      stomach: {
        severe: { imageUrl: "/support/leo_school_stomach_severe.png" },
      },
    },

    home: {
      head: {
        severe: { imageUrl: "/support/leo_home_head_severe.png" },
      },
      chest: {
        severe: { imageUrl: "/support/leo_home_chest_severe.png" },
      },
      stomach: {
        severe: { imageUrl: "/support/leo_home_stomach_severe.png" },
      },
    },
  },

  ava_child: {
    outside: {
      head: {
        severe: { imageUrl: "/support/ava_outside_head_severe.png" },
      },
      chest: {
        severe: { imageUrl: "/support/ava_outside_chest_severe.png" },
      },
      stomach: {
        severe: { imageUrl: "/support/ava_outside_stomach_severe.png" },
      },
    },

    school: {
      head: {
        severe: { imageUrl: "/support/ava_school_head_severe.png" },
      },
      chest: {
        severe: { imageUrl: "/support/ava_school_chest_severe.png" },
      },
      stomach: {
        severe: { imageUrl: "/support/ava_school_stomach_severe.png" },
      },
    },

    home: {
      head: {
        severe: { imageUrl: "/support/ava_home_head_severe.png" },
      },
      chest: {
        severe: { imageUrl: "/support/ava_home_chest_severe.png" },
      },
      stomach: {
        severe: { imageUrl: "/support/ava_home_stomach_severe.png" },
      },
    },
  },
};

