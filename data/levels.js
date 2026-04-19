window.KM_LEVELS = [
  {
    "id": "bruma-jardin",
    "title": "Bruma de jardín",
    "client": "Clienta coquette",
    "clientImage": "C-CLARA.png",
    "mark": "🌸",
    "desc": "Fresco, floral y suave; el fondo debe quedarse discreto.",
    "personality": [
      "coquette",
      "tranquila",
      "luminosa"
    ],
    "emotion": {
      "wish": "Quiero algo dulce pero elegante, como un jardín después de sonreír.",
      "wants": [
        "Romántico",
        "Calmante",
        "Elegante"
      ],
      "rejects": [
        "Dulce"
      ],
      "tolerance": "media",
      "reactionStyle": "suave"
    },
    "poolNotas": [
      "Rosamel",
      "Verditia",
      "Naranjita",
      "Fresilina",
      "Marinita",
      "Maggic"
    ],
    "memory": {
      "pairs": 3,
      "time": 45,
      "coinBase": 3
    },
    "target": {
      "fresh": 6,
      "bright": 6,
      "floral": 4,
      "green": 4,
      "sweet": 2
    },
    "avoid": {
      "gourmand": 2,
      "warm": 3
    },
    "tutorial": {
      "order": 0,
      "aliquot": 3,
      "phases": [
        {
          "note": "Rosamel",
          "family": "floral",
          "capUnits": 3
        },
        {
          "note": "Verditia",
          "family": "green",
          "capUnits": 3
        },
        {
          "note": "Naranjita",
          "family": "citrus",
          "capUnits": 3
        }
      ]
    },
    "bubbles": [
      {
        "id": 0,
        "capUnits": 24,
        "x": 14,
        "y": 14,
        "targetFamily": "floral"
      },
      {
        "id": 1,
        "capUnits": 18,
        "x": 48,
        "y": 15,
        "targetFamily": "green"
      },
      {
        "id": 2,
        "capUnits": 18,
        "x": 31,
        "y": 38,
        "targetFamily": "citrus"
      },
      {
        "id": 3,
        "capUnits": 15,
        "x": 62,
        "y": 44,
        "targetFamily": "floral"
      },
      {
        "id": 4,
        "capUnits": 15,
        "x": 15,
        "y": 60,
        "targetFamily": "fruity"
      },
      {
        "id": 5,
        "capUnits": 10,
        "x": 48,
        "y": 66,
        "targetFamily": "solvent"
      }
    ],
    "routes": [
      {
        "name": "sin Maggic",
        "needsMaggic": false,
        "recipeBubbles": [
          "Rosamel",
          "Verditia",
          "Naranjita"
        ]
      },
      {
        "name": "pétalo guiado",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rosamel",
          "Fresilina",
          "Maggic"
        ]
      },
      {
        "name": "verde limpio",
        "needsMaggic": true,
        "recipeBubbles": [
          "Verditia",
          "Marinita",
          "Maggic"
        ]
      },
      {
        "name": "cítrico floral",
        "needsMaggic": true,
        "recipeBubbles": [
          "Naranjita",
          "Rosamel",
          "Maggic"
        ]
      },
      {
        "name": "suave solvente",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rosamel",
          "Solvente",
          "Maggic"
        ]
      }
    ],
    "bonuses": [
      "pétalo-frutal",
      "bosque-citrico"
    ],
    "solvente": {
      "obligatorias": [
        5
      ],
      "maxUnits": 20
    }
  },
  {
    "id": "sorbete-rosita",
    "title": "Sorbete rosita",
    "client": "Clienta solar",
    "clientImage": "C-LUZ.png",
    "mark": "🍓",
    "desc": "Frutal, brillante y alegre como un verano rosa.",
    "personality": [
      "solar",
      "juguetona",
      "rápida"
    ],
    "emotion": {
      "wish": "Quiero oler a verano rosa, con fruta y chispa.",
      "wants": [
        "Chispeante",
        "Travieso",
        "Refrescante"
      ],
      "rejects": [
        "Misterioso"
      ],
      "tolerance": "alta",
      "reactionStyle": "entusiasta"
    },
    "poolNotas": [
      "Fresilina",
      "Marinita",
      "Naranjita",
      "Rosamel",
      "Verditia",
      "Canelito",
      "Maggic"
    ],
    "memory": {
      "pairs": 3,
      "time": 45,
      "coinBase": 3
    },
    "target": {
      "fresh": 7,
      "bright": 7,
      "fruity": 5,
      "marine": 4,
      "sweet": 3
    },
    "avoid": {
      "marine": 4,
      "warm": 4,
      "gourmand": 4
    },
    "tutorial": {
      "order": 1,
      "aliquot": 3,
      "phases": [
        {
          "note": "Fresilina",
          "family": "fruity",
          "capUnits": 3
        },
        {
          "note": "Marinita",
          "family": "marine",
          "capUnits": 3
        },
        {
          "note": "Naranjita",
          "family": "citrus",
          "capUnits": 3
        }
      ]
    },
    "bubbles": [
      {
        "id": 0,
        "capUnits": 25,
        "x": 20,
        "y": 13,
        "targetFamily": "fruity"
      },
      {
        "id": 1,
        "capUnits": 20,
        "x": 52,
        "y": 18,
        "targetFamily": "citrus"
      },
      {
        "id": 2,
        "capUnits": 18,
        "x": 12,
        "y": 41,
        "targetFamily": "floral"
      },
      {
        "id": 3,
        "capUnits": 15,
        "x": 44,
        "y": 44,
        "targetFamily": "fruity"
      },
      {
        "id": 4,
        "capUnits": 12,
        "x": 66,
        "y": 58,
        "targetFamily": "green"
      },
      {
        "id": 5,
        "capUnits": 10,
        "x": 28,
        "y": 68,
        "targetFamily": "solvent"
      }
    ],
    "routes": [
      {
        "name": "sin Maggic",
        "needsMaggic": false,
        "recipeBubbles": [
          "Fresilina",
          "Naranjita",
          "Rosamel"
        ]
      },
      {
        "name": "fresa brillante",
        "needsMaggic": true,
        "recipeBubbles": [
          "Fresilina",
          "Maggic",
          "Naranjita"
        ]
      },
      {
        "name": "rosa fresca",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rosamel",
          "Verditia",
          "Maggic"
        ]
      },
      {
        "name": "chispa dulce",
        "needsMaggic": true,
        "recipeBubbles": [
          "Fresilina",
          "Canelito",
          "Maggic"
        ]
      },
      {
        "name": "sorbete ligero",
        "needsMaggic": true,
        "recipeBubbles": [
          "Fresilina",
          "Solvente",
          "Maggic"
        ]
      }
    ],
    "bonuses": [
      "pétalo-frutal",
      "bosque-citrico"
    ],
    "solvente": {
      "obligatorias": [
        5
      ],
      "maxUnits": 18
    }
  },
  {
    "id": "noche-bonita",
    "title": "Noche bonita",
    "client": "Clienta misteriosa",
    "clientImage": "C-RAQUEL.png",
    "mark": "🌙",
    "desc": "Sensual y cálido, sin convertirse en un postre pesado.",
    "personality": [
      "misteriosa",
      "elegante",
      "serena"
    ],
    "emotion": {
      "wish": "Busco un perfume fresco para una cita nocturna.",
      "wants": [
        "Misterioso",
        "Sofisticado",
        "Elegante"
      ],
      "rejects": [
        "Travieso"
      ],
      "tolerance": "media",
      "reactionStyle": "reservada"
    },
    "poolNotas": [
      "Rubiluna",
      "Canelito",
      "Rosamel",
      "Mocachin",
      "Fresilina",
      "Maggic"
    ],
    "memory": {
      "pairs": 3,
      "time": 45,
      "coinBase": 3
    },
    "target": {
      "warm": 8,
      "sweet": 7,
      "sensual": 6,
      "gourmand": 4
    },
    "avoid": {
      "fresh": 4,
      "marine": 4,
      "gourmand": 6
    },
    "tutorial": {
      "order": 2,
      "aliquot": 3,
      "phases": [
        {
          "note": "Rubiluna",
          "family": "amber",
          "capUnits": 3
        },
        {
          "note": "Canelito",
          "family": "spice",
          "capUnits": 3
        },
        {
          "note": "Mocachin",
          "family": "gourmand",
          "capUnits": 3
        }
      ]
    },
    "bubbles": [
      {
        "id": 0,
        "capUnits": 24,
        "x": 31,
        "y": 12,
        "targetFamily": "amber"
      },
      {
        "id": 1,
        "capUnits": 20,
        "x": 13,
        "y": 34,
        "targetFamily": "spice"
      },
      {
        "id": 2,
        "capUnits": 18,
        "x": 58,
        "y": 35,
        "targetFamily": "floral"
      },
      {
        "id": 3,
        "capUnits": 16,
        "x": 36,
        "y": 52,
        "targetFamily": "amber"
      },
      {
        "id": 4,
        "capUnits": 12,
        "x": 63,
        "y": 65,
        "targetFamily": "gourmand"
      },
      {
        "id": 5,
        "capUnits": 10,
        "x": 21,
        "y": 69,
        "targetFamily": "solvent"
      }
    ],
    "routes": [
      {
        "name": "sin Maggic",
        "needsMaggic": false,
        "recipeBubbles": [
          "Rubiluna",
          "Canelito",
          "Rosamel"
        ]
      },
      {
        "name": "luna rosa",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rubiluna",
          "Rosamel",
          "Maggic"
        ]
      },
      {
        "name": "canela suave",
        "needsMaggic": true,
        "recipeBubbles": [
          "Canelito",
          "Solvente",
          "Maggic"
        ]
      },
      {
        "name": "ámbar gourmand",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rubiluna",
          "Mocachin",
          "Maggic"
        ]
      },
      {
        "name": "noche limpia",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rubiluna",
          "Fresilina",
          "Maggic"
        ]
      }
    ],
    "bonuses": [
      "luna-rosa",
      "abrazo-dulce"
    ],
    "solvente": {
      "obligatorias": [
        5
      ],
      "maxUnits": 16
    }
  },
  {
    "id": "ola-de-cristal",
    "title": "Ola de cristal",
    "client": "Cliente surfer",
    "clientImage": "C-JORDI.png",
    "mark": "🌊",
    "desc": "Marino, limpio y verde; nada pegajoso.",
    "personality": [
      "deportista",
      "ligero",
      "directo"
    ],
    "emotion": {
      "wish": "Necesito algo limpio, fresco y con energía de mar.",
      "wants": [
        "Refrescante",
        "Calmante",
        "Chispeante"
      ],
      "rejects": [
        "Dulce"
      ],
      "tolerance": "baja",
      "reactionStyle": "directo"
    },
    "poolNotas": [
      "Marinita",
      "Verditia",
      "Naranjita",
      "Rosamel",
      "Fresilina",
      "Maggic"
    ],
    "memory": {
      "pairs": 5,
      "time": 27,
      "coinBase": 12
    },
    "target": {
      "marine": 9,
      "fresh": 8,
      "green": 5,
      "bright": 4
    },
    "avoid": {
      "gourmand": 2,
      "warm": 2,
      "sweet": 4
    },
    "bubbles": [
      {
        "id": 0,
        "capUnits": 25,
        "x": 18,
        "y": 12,
        "targetFamily": "marine"
      },
      {
        "id": 1,
        "capUnits": 20,
        "x": 50,
        "y": 17,
        "targetFamily": "green"
      },
      {
        "id": 2,
        "capUnits": 18,
        "x": 12,
        "y": 42,
        "targetFamily": "citrus"
      },
      {
        "id": 3,
        "capUnits": 17,
        "x": 44,
        "y": 44,
        "targetFamily": "marine"
      },
      {
        "id": 4,
        "capUnits": 10,
        "x": 68,
        "y": 57,
        "targetFamily": "green"
      },
      {
        "id": 5,
        "capUnits": 10,
        "x": 30,
        "y": 68,
        "targetFamily": "solvent"
      }
    ],
    "routes": [
      {
        "name": "sin Maggic",
        "needsMaggic": false,
        "recipeBubbles": [
          "Marinita",
          "Verditia",
          "Naranjita"
        ]
      },
      {
        "name": "ola verde",
        "needsMaggic": true,
        "recipeBubbles": [
          "Marinita",
          "Verditia",
          "Maggic"
        ]
      },
      {
        "name": "chispa marina",
        "needsMaggic": true,
        "recipeBubbles": [
          "Marinita",
          "Naranjita",
          "Maggic"
        ]
      },
      {
        "name": "bruma floral",
        "needsMaggic": true,
        "recipeBubbles": [
          "Marinita",
          "Rosamel",
          "Maggic"
        ]
      },
      {
        "name": "agua clara",
        "needsMaggic": true,
        "recipeBubbles": [
          "Marinita",
          "Solvente",
          "Maggic"
        ]
      }
    ],
    "bonuses": [
      "ola-verde",
      "chispa-marina"
    ],
    "solvente": {
      "obligatorias": [
        5
      ],
      "maxUnits": 22
    }
  },
  {
    "id": "merienda-suave",
    "title": "Merienda suave",
    "client": "Cliente repostero",
    "clientImage": "C-FERNANDO.png",
    "mark": "🍮",
    "desc": "Dulce y gourmand, pero con aire para no cansar.",
    "personality": [
      "amable",
      "goloso",
      "paciente"
    ],
    "emotion": {
      "wish": "Quiero algo tierno pero con personalidad.",
      "wants": [
        "Dulce",
        "Soñador",
        "Travieso"
      ],
      "rejects": [
        "Refrescante"
      ],
      "tolerance": "media",
      "reactionStyle": "cariñoso"
    },
    "poolNotas": [
      "Mocachin",
      "Canelito",
      "Fresilina",
      "Naranjita",
      "Rosamel",
      "Maggic"
    ],
    "memory": {
      "pairs": 5,
      "time": 26,
      "coinBase": 14
    },
    "target": {
      "gourmand": 9,
      "sweet": 8,
      "warm": 5,
      "fruity": 3
    },
    "avoid": {
      "marine": 3,
      "green": 4,
      "sensual": 6
    },
    "bubbles": [
      {
        "id": 0,
        "capUnits": 25,
        "x": 28,
        "y": 12,
        "targetFamily": "gourmand"
      },
      {
        "id": 1,
        "capUnits": 20,
        "x": 10,
        "y": 36,
        "targetFamily": "spice"
      },
      {
        "id": 2,
        "capUnits": 18,
        "x": 56,
        "y": 34,
        "targetFamily": "fruity"
      },
      {
        "id": 3,
        "capUnits": 15,
        "x": 36,
        "y": 54,
        "targetFamily": "gourmand"
      },
      {
        "id": 4,
        "capUnits": 12,
        "x": 65,
        "y": 64,
        "targetFamily": "citrus"
      },
      {
        "id": 5,
        "capUnits": 10,
        "x": 18,
        "y": 68,
        "targetFamily": "solvent"
      }
    ],
    "routes": [
      {
        "name": "sin Maggic",
        "needsMaggic": false,
        "recipeBubbles": [
          "Mocachin",
          "Canelito",
          "Fresilina"
        ]
      },
      {
        "name": "abrazo dulce",
        "needsMaggic": true,
        "recipeBubbles": [
          "Mocachin",
          "Canelito",
          "Maggic"
        ]
      },
      {
        "name": "postre rosa",
        "needsMaggic": true,
        "recipeBubbles": [
          "Mocachin",
          "Rosamel",
          "Maggic"
        ]
      },
      {
        "name": "sorbete tostado",
        "needsMaggic": true,
        "recipeBubbles": [
          "Mocachin",
          "Naranjita",
          "Maggic"
        ]
      },
      {
        "name": "crema ligera",
        "needsMaggic": true,
        "recipeBubbles": [
          "Mocachin",
          "Solvente",
          "Maggic"
        ]
      }
    ],
    "bonuses": [
      "abrazo-dulce",
      "pétalo-frutal"
    ],
    "solvente": {
      "obligatorias": [
        5
      ],
      "maxUnits": 18
    }
  },
  {
    "id": "bosque-chispa",
    "title": "Bosque chispa",
    "client": "Clienta aventurera",
    "clientImage": "C-GLORIA.png",
    "mark": "🌿",
    "desc": "Verde, chispeante y con salida cítrica.",
    "personality": [
      "curiosa",
      "rápida",
      "natural"
    ],
    "emotion": {
      "wish": "Quiero un aroma relajante con chispa.",
      "wants": [
        "Calmante",
        "Chispeante",
        "Refrescante"
      ],
      "rejects": [
        "Dulce"
      ],
      "tolerance": "media",
      "reactionStyle": "curiosa"
    },
    "poolNotas": [
      "Verditia",
      "Naranjita",
      "Marinita",
      "Fresilina",
      "Rosamel",
      "Maggic"
    ],
    "memory": {
      "pairs": 5,
      "time": 27,
      "coinBase": 13
    },
    "target": {
      "green": 9,
      "fresh": 8,
      "bright": 6,
      "fruity": 2
    },
    "avoid": {
      "warm": 3,
      "gourmand": 2,
      "sweet": 5
    },
    "bubbles": [
      {
        "id": 0,
        "capUnits": 24,
        "x": 15,
        "y": 15,
        "targetFamily": "green"
      },
      {
        "id": 1,
        "capUnits": 22,
        "x": 50,
        "y": 13,
        "targetFamily": "citrus"
      },
      {
        "id": 2,
        "capUnits": 18,
        "x": 30,
        "y": 39,
        "targetFamily": "marine"
      },
      {
        "id": 3,
        "capUnits": 14,
        "x": 61,
        "y": 48,
        "targetFamily": "green"
      },
      {
        "id": 4,
        "capUnits": 12,
        "x": 14,
        "y": 63,
        "targetFamily": "fruity"
      },
      {
        "id": 5,
        "capUnits": 10,
        "x": 46,
        "y": 69,
        "targetFamily": "solvent"
      }
    ],
    "routes": [
      {
        "name": "sin Maggic",
        "needsMaggic": false,
        "recipeBubbles": [
          "Verditia",
          "Naranjita",
          "Marinita"
        ]
      },
      {
        "name": "bosque cítrico",
        "needsMaggic": true,
        "recipeBubbles": [
          "Verditia",
          "Naranjita",
          "Maggic"
        ]
      },
      {
        "name": "ola verde",
        "needsMaggic": true,
        "recipeBubbles": [
          "Verditia",
          "Marinita",
          "Maggic"
        ]
      },
      {
        "name": "baya verde",
        "needsMaggic": true,
        "recipeBubbles": [
          "Verditia",
          "Fresilina",
          "Maggic"
        ]
      },
      {
        "name": "hoja ligera",
        "needsMaggic": true,
        "recipeBubbles": [
          "Verditia",
          "Solvente",
          "Maggic"
        ]
      }
    ],
    "bonuses": [
      "bosque-citrico",
      "ola-verde"
    ],
    "solvente": {
      "obligatorias": [
        5
      ],
      "maxUnits": 20
    }
  },
  {
    "id": "rubi-de-feria",
    "title": "Rubí de feria",
    "client": "Clienta dramática",
    "clientImage": "C-GEMMA.png",
    "mark": "🎀",
    "desc": "Sensual, dulce y con una chispa frutal atrevida.",
    "personality": [
      "teatral",
      "dulce",
      "valiente"
    ],
    "emotion": {
      "wish": "Quiero oler a escenario, dulce y un poco peligroso.",
      "wants": [
        "Misterioso",
        "Travieso",
        "Dulce"
      ],
      "rejects": [
        "Calmante"
      ],
      "tolerance": "alta",
      "reactionStyle": "dramática"
    },
    "poolNotas": [
      "Rubiluna",
      "Fresilina",
      "Mocachin",
      "Rosamel",
      "Canelito",
      "Maggic"
    ],
    "memory": {
      "pairs": 5,
      "time": 25,
      "coinBase": 14
    },
    "target": {
      "sensual": 8,
      "sweet": 6,
      "fruity": 5,
      "warm": 4
    },
    "avoid": {
      "marine": 3,
      "green": 3,
      "gourmand": 8
    },
    "bubbles": [
      {
        "id": 0,
        "capUnits": 24,
        "x": 32,
        "y": 13,
        "targetFamily": "amber"
      },
      {
        "id": 1,
        "capUnits": 20,
        "x": 12,
        "y": 36,
        "targetFamily": "fruity"
      },
      {
        "id": 2,
        "capUnits": 18,
        "x": 58,
        "y": 36,
        "targetFamily": "floral"
      },
      {
        "id": 3,
        "capUnits": 16,
        "x": 36,
        "y": 55,
        "targetFamily": "gourmand"
      },
      {
        "id": 4,
        "capUnits": 12,
        "x": 64,
        "y": 66,
        "targetFamily": "spice"
      },
      {
        "id": 5,
        "capUnits": 10,
        "x": 20,
        "y": 68,
        "targetFamily": "solvent"
      }
    ],
    "routes": [
      {
        "name": "sin Maggic",
        "needsMaggic": false,
        "recipeBubbles": [
          "Rubiluna",
          "Fresilina",
          "Rosamel"
        ]
      },
      {
        "name": "luna rosa",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rubiluna",
          "Rosamel",
          "Maggic"
        ]
      },
      {
        "name": "rubí goloso",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rubiluna",
          "Mocachin",
          "Maggic"
        ]
      },
      {
        "name": "rubí especiado",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rubiluna",
          "Canelito",
          "Maggic"
        ]
      },
      {
        "name": "brillo rubí",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rubiluna",
          "Fresilina",
          "Maggic"
        ]
      }
    ],
    "bonuses": [
      "luna-rosa",
      "pétalo-frutal"
    ],
    "solvente": {
      "obligatorias": [
        5
      ],
      "maxUnits": 15
    }
  },
  {
    "id": "lluvia-azucar",
    "title": "Lluvia de azúcar",
    "client": "Cliente soñador",
    "clientImage": "C-LAURa.png",
    "mark": "☁️",
    "desc": "Dulce, fresco y blando como una nube.",
    "personality": [
      "soñador",
      "calmado",
      "tierno"
    ],
    "emotion": {
      "wish": "Quiero una nube dulce que me calme.",
      "wants": [
        "Soñador",
        "Calmante",
        "Dulce"
      ],
      "rejects": [
        "Atrevido"
      ],
      "tolerance": "baja",
      "reactionStyle": "tierno"
    },
    "poolNotas": [
      "Mocachin",
      "Marinita",
      "Rosamel",
      "Fresilina",
      "Verditia",
      "Maggic"
    ],
    "memory": {
      "pairs": 4,
      "time": 24,
      "coinBase": 13
    },
    "target": {
      "sweet": 8,
      "fresh": 6,
      "floral": 4,
      "marine": 3
    },
    "avoid": {
      "warm": 7,
      "sensual": 5,
      "green": 6
    },
    "bubbles": [
      {
        "id": 0,
        "capUnits": 23,
        "x": 18,
        "y": 15,
        "targetFamily": "gourmand"
      },
      {
        "id": 1,
        "capUnits": 20,
        "x": 52,
        "y": 18,
        "targetFamily": "marine"
      },
      {
        "id": 2,
        "capUnits": 18,
        "x": 12,
        "y": 42,
        "targetFamily": "floral"
      },
      {
        "id": 3,
        "capUnits": 17,
        "x": 42,
        "y": 45,
        "targetFamily": "fruity"
      },
      {
        "id": 4,
        "capUnits": 12,
        "x": 65,
        "y": 62,
        "targetFamily": "green"
      },
      {
        "id": 5,
        "capUnits": 10,
        "x": 28,
        "y": 70,
        "targetFamily": "solvent"
      }
    ],
    "routes": [
      {
        "name": "sin Maggic",
        "needsMaggic": false,
        "recipeBubbles": [
          "Mocachin",
          "Marinita",
          "Rosamel"
        ]
      },
      {
        "name": "nube floral",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rosamel",
          "Mocachin",
          "Maggic"
        ]
      },
      {
        "name": "nube marina",
        "needsMaggic": true,
        "recipeBubbles": [
          "Marinita",
          "Mocachin",
          "Maggic"
        ]
      },
      {
        "name": "fresa nube",
        "needsMaggic": true,
        "recipeBubbles": [
          "Fresilina",
          "Mocachin",
          "Maggic"
        ]
      },
      {
        "name": "nube limpia",
        "needsMaggic": true,
        "recipeBubbles": [
          "Mocachin",
          "Solvente",
          "Maggic"
        ]
      }
    ],
    "bonuses": [
      "pétalo-frutal",
      "ola-verde"
    ],
    "solvente": {
      "obligatorias": [
        5
      ],
      "maxUnits": 22
    }
  },
  {
    "id": "mandarina-zen",
    "title": "Mandarina zen",
    "client": "Cliente minimal",
    "clientImage": "C-FERNANDO.png",
    "mark": "🍊",
    "desc": "Cítrico limpio, verde y muy controlado.",
    "personality": [
      "minimal",
      "ordenado",
      "silencioso"
    ],
    "emotion": {
      "wish": "Quiero mandarina limpia, nada de exceso.",
      "wants": [
        "Refrescante",
        "Elegante",
        "Calmante"
      ],
      "rejects": [
        "Dulce",
        "Mágico"
      ],
      "tolerance": "baja",
      "reactionStyle": "preciso"
    },
    "poolNotas": [
      "Naranjita",
      "Verditia",
      "Marinita",
      "Rosamel",
      "Canelito",
      "Maggic"
    ],
    "memory": {
      "pairs": 4,
      "time": 23,
      "coinBase": 12
    },
    "target": {
      "bright": 8,
      "fresh": 8,
      "green": 6,
      "floral": 2
    },
    "avoid": {
      "sweet": 4,
      "gourmand": 2,
      "warm": 4
    },
    "bubbles": [
      {
        "id": 0,
        "capUnits": 26,
        "x": 24,
        "y": 13,
        "targetFamily": "citrus"
      },
      {
        "id": 1,
        "capUnits": 22,
        "x": 55,
        "y": 20,
        "targetFamily": "green"
      },
      {
        "id": 2,
        "capUnits": 17,
        "x": 14,
        "y": 43,
        "targetFamily": "marine"
      },
      {
        "id": 3,
        "capUnits": 15,
        "x": 44,
        "y": 48,
        "targetFamily": "floral"
      },
      {
        "id": 4,
        "capUnits": 10,
        "x": 66,
        "y": 64,
        "targetFamily": "spice"
      },
      {
        "id": 5,
        "capUnits": 10,
        "x": 28,
        "y": 69,
        "targetFamily": "solvent"
      }
    ],
    "routes": [
      {
        "name": "sin Maggic",
        "needsMaggic": false,
        "recipeBubbles": [
          "Naranjita",
          "Verditia",
          "Marinita"
        ]
      },
      {
        "name": "bosque cítrico",
        "needsMaggic": true,
        "recipeBubbles": [
          "Naranjita",
          "Verditia",
          "Maggic"
        ]
      },
      {
        "name": "chispa marina",
        "needsMaggic": true,
        "recipeBubbles": [
          "Naranjita",
          "Marinita",
          "Maggic"
        ]
      },
      {
        "name": "cítrico floral",
        "needsMaggic": true,
        "recipeBubbles": [
          "Naranjita",
          "Rosamel",
          "Maggic"
        ]
      },
      {
        "name": "mandarina clara",
        "needsMaggic": true,
        "recipeBubbles": [
          "Naranjita",
          "Solvente",
          "Maggic"
        ]
      }
    ],
    "bonuses": [
      "bosque-citrico",
      "chispa-marina"
    ],
    "solvente": {
      "obligatorias": [
        5
      ],
      "maxUnits": 20
    }
  },
  {
    "id": "corona-maggic",
    "title": "Corona Maggic",
    "client": "Clienta alquimista",
    "clientImage": "C-KMG.png",
    "mark": "✨",
    "desc": "Quiere equilibrio total: flores, fruta, mar, verde y fondo cálido.",
    "personality": [
      "alquimista",
      "exigente",
      "brillante"
    ],
    "emotion": {
      "wish": "Sorpréndeme con equilibrio y un secreto mágico.",
      "wants": [
        "Mágico",
        "Sofisticado",
        "Chispeante"
      ],
      "rejects": [
        "Dulce"
      ],
      "tolerance": "alta",
      "reactionStyle": "alquimista"
    },
    "poolNotas": [
      "Rosamel",
      "Fresilina",
      "Marinita",
      "Verditia",
      "Rubiluna",
      "Canelito",
      "Mocachin",
      "Naranjita",
      "Maggic"
    ],
    "memory": {
      "pairs": 6,
      "time": 30,
      "coinBase": 14
    },
    "target": {
      "fresh": 7,
      "bright": 6,
      "fruity": 5,
      "floral": 5,
      "marine": 4,
      "warm": 4,
      "sensual": 4,
      "green": 4,
      "sweet": 4
    },
    "avoid": {
      "gourmand": 7
    },
    "bubbles": [
      {
        "id": 0,
        "capUnits": 20,
        "x": 18,
        "y": 12,
        "targetFamily": "floral"
      },
      {
        "id": 1,
        "capUnits": 18,
        "x": 50,
        "y": 13,
        "targetFamily": "fruity"
      },
      {
        "id": 2,
        "capUnits": 17,
        "x": 12,
        "y": 36,
        "targetFamily": "marine"
      },
      {
        "id": 3,
        "capUnits": 15,
        "x": 42,
        "y": 38,
        "targetFamily": "green"
      },
      {
        "id": 4,
        "capUnits": 12,
        "x": 65,
        "y": 48,
        "targetFamily": "amber"
      },
      {
        "id": 5,
        "capUnits": 10,
        "x": 22,
        "y": 62,
        "targetFamily": "spice"
      },
      {
        "id": 6,
        "capUnits": 8,
        "x": 52,
        "y": 68,
        "targetFamily": "solvent"
      }
    ],
    "routes": [
      {
        "name": "sin Maggic",
        "needsMaggic": false,
        "recipeBubbles": [
          "Rosamel",
          "Fresilina",
          "Marinita",
          "Verditia"
        ]
      },
      {
        "name": "pétalo frutal",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rosamel",
          "Fresilina",
          "Maggic"
        ]
      },
      {
        "name": "ola verde",
        "needsMaggic": true,
        "recipeBubbles": [
          "Marinita",
          "Verditia",
          "Maggic"
        ]
      },
      {
        "name": "luna rosa",
        "needsMaggic": true,
        "recipeBubbles": [
          "Rubiluna",
          "Rosamel",
          "Maggic"
        ]
      },
      {
        "name": "corona limpia",
        "needsMaggic": true,
        "recipeBubbles": [
          "Naranjita",
          "Solvente",
          "Maggic"
        ]
      }
    ],
    "bonuses": [
      "pétalo-frutal",
      "ola-verde",
      "luna-rosa",
      "chispa-marina",
      "bosque-citrico"
    ],
    "solvente": {
      "obligatorias": [
        6
      ],
      "maxUnits": 18
    }
  }
];
