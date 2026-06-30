const COLLECTIBLE_TYPES = [
  {
    id: "vaccine",
    name: "Vaccine Supply",
    icon: "💉",
    effects: {
      coverage: 8
    },
    message:
      "You collected Vaccine Supply. Coverage increased, but supply alone is not enough."
  },
  {
    id: "school",
    name: "School Campaign",
    icon: "🏫",
    effects: {
      coverage: 6,
      transportation: 7
    },
    message:
      "You collected School Campaign. Schools help bring vaccination closer to adolescent girls."
  },
  {
    id: "chw",
    name: "Community Health Worker",
    icon: "🧑‍⚕️",
    effects: {
      trust: 8,
      internetAccess: 6,
      misinformation: -4
    },
    message:
      "You collected Community Health Worker Outreach. CHWs build trust and help communities connect with health information."
  },
  {
    id: "education",
    name: "Public Education",
    icon: "📣",
    effects: {
      trust: 6,
      misinformation: -8
    },
    message:
      "You collected Public Education. Clear messaging helps reduce myths and vaccine hesitancy."
  },
  {
    id: "mobileClinic",
    name: "Mobile Clinic",
    icon: "🚐",
    effects: {
      transportation: 9,
      coverage: 4
    },
    message:
      "You collected Mobile Clinic. Better transportation and outreach help reach rural communities."
  },
  {
    id: "internet",
    name: "Internet Access",
    icon: "📱",
    effects: {
      internetAccess: 10,
      coverage: 3
    },
    message:
      "You collected Internet Access. Better digital access helps families receive accurate vaccine information."
  },
  {
    id: "trustedLeader",
    name: "Trusted Local Leader",
    icon: "🤝",
    effects: {
      trust: 10,
      misinformation: -6
    },
    message:
      "You collected Trusted Local Leader. Community trust helps correct misinformation."
  }
];

export function getRandomCollectible(x, y) {
  const index = Math.floor(Math.random() * COLLECTIBLE_TYPES.length);
  const type = COLLECTIBLE_TYPES[index];

  return {
    ...type,
    x,
    y
  };
}