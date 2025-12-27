
import leoImg from "../data/Leo_child.png";
import avaImg from "../data/ava.png";
import sosImg from "../data/sos_img.png"





const FIBO_HERO_URLS = {
  leo_child:
    "https://v3b.fal.media/files/b/0a8737c6/Wpq_rUZFf-fY8vWE9gbsP_ca99c0a2c7cf430293e611c6ffcf2939.png",
  ava_child:
    "https://v3b.fal.media/files/b/0a8737c8/LTCKCSRXvYaz5lDeuoya1_d8414028abf843489248aec31d48e145.png",
};

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
    outside: { imageUrl: "https://v3b.fal.media/files/b/0a877980/O80TDtAatrs3yAlo8aYMf_b6c7804bbe834e0db39d194391041acc.png" },
    school:  { imageUrl: "https://v3b.fal.media/files/b/0a8779c5/SiR0PtHKBLzTjPjdkO5Jd_4a1f9f81e5764a4ea05a53d403148776.png" },
    home:    { imageUrl: "https://v3b.fal.media/files/b/0a8779dc/bxZi570n4tOwwyfKP-aY4_4e8e6f5ad7894f93b707310b97d74bae.png" },
  },

  ava_child: {
    home:    { imageUrl: "https://v3b.fal.media/files/b/0a8779f0/TyoRbKsxGNHK8eU7_XlfE_e7ada1e064384c1582edd4b19860c5c3.png" },
    outside: { imageUrl: "https://v3b.fal.media/files/b/0a877a13/FSFWaLIFzxMuCV2nb5WLf_a4f3057dc9244b6abdd516e604d90438.png" },
    school:  { imageUrl: "https://v3b.fal.media/files/b/0a877e44/vUCLFOmBCG4wGDjPg8irs_75f13edfc66d41b08c4775137a8043ba.png" },
  },
};



export const HERO_SCENARIO_SYMPTOMS = {
  leo_child: {
    outside: {
      head: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b09/UEG7ZTR-M_V_oxt-c1egN_58884abc5c7645eaa79c214428b5e807.png",
      },
      chest: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b15/mR1F9O41cs4oJYEGcJW_p_5f31232be15e4168a17c83233d7e2bc0.png",
      },
      stomach: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b1e/LbbdtZMdvs1B7DF2lGtyS_0aaebcd67b804d32ba526aaae7a91716.png",
      },
      breathing_or_choking: {
        imageUrl: "https://v3b.fal.media/files/b/0a878b61/R3TMuQplkWVjckj_YgpG2_764800757f6f415395778c3556cd5170.png",
      },
    },

    school: {
      head: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b59/6A3nMJOGVx-72aZo9nqMS_61e11aa091c9454f9599778092ddcca0.png",
      },
      chest: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b5d/a6b_1ImakzyGh5bYZQOLp_8c82c27e843a44629a916363e1dba255.png",
      },
      stomach: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b64/4FKiKiZlMop5relZOjd6r_50d8a9ed41eb4038a79ca407c720bcab.png",
      },
      breathing_or_choking: {
        imageUrl: "https://v3b.fal.media/files/b/0a878b72/BhUKLfts3qFO3rCl_tslz_fab7801106ad44008bf851a8a184be34.png",
      },
    },

    home: {
      head: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b53/slfe6BC_7K--c9153JKBl_a6937c2d393b4074be6ee40d6ee7f2c6.png",
      },
      chest: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b48/ZoRzsVexBaPED7GnEnvWD_7c68e9991bb44e2097d642f02063456e.png",
      },
      stomach: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b3e/Qv2lBpJgsMscULrK61LCX_cfecb4938ab548d39cb1a4bc658cc75e.png",
      },
      breathing_or_choking: {
        imageUrl: "https://v3b.fal.media/files/b/0a878b77/S8EBgz1vEaSt4_0u7xD_-_b9dd1b74f96340d1b893ee2fcea66460.png",
      },
    },
  },

  ava_child: {
    outside: {
      head: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b73/R0fN8fqc4inUPgc6sXF6__2814df1bebde4b4284d41702ccbfcfab.png",
      },
      chest: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b83/TtFTkY3eWw6xnx6Y9Iz5f_375a5c3015a24165bee058a64c1560be.png",
      },
      stomach: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b91/Aa6UrIDR_WkMik604pkEY_27733b16e6d148f6895725a2f563bfe9.png",
      },
      breathing_or_choking: {
        imageUrl: "https://v3b.fal.media/files/b/0a878b8b/TkkNHiGdVX_RfzQPMG3lg_3b4f18a4e95e411bbbe2d3b78dea712f.png",
      },
    },

    home: {
      head: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b7e/ahvs2-_1ACMdPzFIJ7ad6_186957b0e03744199c644f6f57cf654d.png",
      },
      chest: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b89/ZF1bc80eOMWHqsj7YDPNr_4a4a704327e4489eb7671373bbd4927c.png",
      },
      stomach: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b96/rBFAjnm8NwG525g6Vwpgw_2cca1f5585a44769aa41b618aeb08c88.png",
      },
      breathing_or_choking: {
        imageUrl: "https://v3b.fal.media/files/b/0a878b7f/ll7PtgA5ZH6yMC5ZCNWDo_823edc64a7f04c719f859f77ea052788.png",
      },
    },

    school: {
      head: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b7a/9HfbCzaT6r8tJGfYd3yLn_dfb4f7c20c9341a9a0696dbbac1e6cb9.png",
      },
      chest: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b8d/of_4lHRQr6V0sCFmCUEPF_384b164600964757a326fe53a6bf59f2.png",
      },
      stomach: {
        imageUrl: "https://v3b.fal.media/files/b/0a877b9d/aHS8PSi0Uvc0leit8LI5A_3a19a08c0a7645568b30a15f57c7bb68.png",
      },
      breathing_or_choking: {
        imageUrl: "https://v3b.fal.media/files/b/0a878b85/XBlZFIugkvSIzPG5UJ4fy_c13073ae9f4c4a49a70e0a628732c955.png",
      },
    },
  },
};




export const HERO_SCENARIO_SYMPTOM_WITH_SRVERITY = {
  leo_child: {
    outside: {
      head:   { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bbd/HM4S-tL8PXflDHK9z_Nl__86fd4afdd8794eda9237810cdc31700b.png" } },
      chest:  { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bce/2hMUbrYxUMSH-Pdoz2xIU_f524a28a7d314384a191639fd1634737.png" } },
      stomach:{ severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bde/nrhUGQHvkHnfuFwM_PkGJ_67b1d04ebb284d969f39d6fc08c260ed.png" } },
    },
    school: {
      head:   { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bc4/GEZwXL-tao33q2UgWy-pX_f1357a3e6d6a49a59ad618af6a1f9304.png" } },
      chest:  { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bd3/XYgLei9lBGhiQPhciKP9P_89ee3374460549b0a49a6d3838fa7aff.png" } },
      stomach:{ severe: { imageUrl: "https://v3b.fal.media/files/b/0a877be3/LSSb4fukMrMNgF1fCvlat_a54673483af54202b9f149494b3a0171.png" } },
    },
    home: {
      head:   { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bc8/WJgronXXyPiaohyoR1orR_79c815422a584a1a85c8aac653657ab9.png" } },
      chest:  { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bd7/7nSbGDOa74UiiZ9XCibWM_a0b2a209c80545f1b67d8c65e55935ea.png" } },
      stomach:{ severe: { imageUrl: "https://v3b.fal.media/files/b/0a877be7/aYNLo-nUQZ2et-_g48FxP_afd0bcf5a5904cc485c663b8761fe1bf.png" } },
    },
  },

  ava_child: {
    outside: {
      head:   { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bed/pvStYl4TX5Rl_6IjMyVka_cd721fa7d36b429395d82463d8d3d937.png" } },
      chest:  { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bfa/hnWdWZrsjg5rA8cCpyPHY_bf530b66c75e4059a9e1c51e92becc37.png" } },
      stomach:{ severe: { imageUrl: "https://v3b.fal.media/files/b/0a877c06/DZdSRFmBWCMpcjMIknPjH_bbcc84df475c4004b8efb076e07fd2af.png" } },
    },
    school: {
      head:   { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bf2/Z_CAxJSJiSrl07de-MU3w_d4e932fbbf7046daa9958ab221d805d6.png" } },
      chest:  { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bfd/EaSnRta_rA-f8EOYoNGGI_9b742f0d286d435ab975a4bb95d05823.png" } },
      stomach:{ severe: { imageUrl: "https://v3b.fal.media/files/b/0a877c0b/RWuKFS01bdUH8L1TG93kl_79ba32bbf7674cc2bdd6733fa8f35498.png" } },
    },
    home: {
      head:   { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877bf6/soQlMJNQb-ZyQotHk15ZO_5a7ae81eb021485681c20e7342ef6fb6.png" } },
      chest:  { severe: { imageUrl: "https://v3b.fal.media/files/b/0a877c01/CF4tWPCqKmbft5oAAXWi1_fdbb53d89d574212a9e6a1bbde792860.png" } },
      stomach:{ severe: { imageUrl: "https://v3b.fal.media/files/b/0a877c10/UcDNdrZpUPoprn85gOXCE_6d321b2275e544a2bb28caa7254d4d37.png" } },
    },
  },
};
