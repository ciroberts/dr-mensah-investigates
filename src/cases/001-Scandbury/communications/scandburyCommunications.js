export const scandburyCommunications = {
  suggestions: [
    { id: "amara-status", contact: "amara", intent: "status", text: "Yeah. I'm outside.", locationId: "scandbury-mansion", pressure: 0 },
    { id: "amara-look", contact: "amara", intent: "guidance", text: "I'm going to have a look around first.", locationId: "scandbury-mansion", pressure: 0 },
    { id: "amara-guidance", contact: "amara", intent: "guidance", text: "Okay... where would you start?", locationId: "scandbury-mansion", pressure: 1 },
    { id: "amara-car", contact: "amara", intent: "vehicle_research", text: "Can you check this vehicle registration?", requiresFacts: ["scandbury_vehicle_documented"], pressure: 1 },
    { id: "mensah-arrived", contact: "mensah", intent: "status", text: "I'm at Scandbury Mansion.", locationId: "scandbury-mansion", pressure: 0 },
    { id: "mensah-guidance", contact: "mensah", intent: "guidance", text: "Where should I start?", locationId: "scandbury-mansion", pressure: 2 },
  ],
  responses: [
    { id: "amara-status-1", contact: "amara", intent: "status", maxPressure: 3, readDelay: [1800, 3500], typingDelay: 4200, text: ["Good. Don't rush inside.", "Take a look at the place before you decide what matters."] },
    { id: "amara-guidance-1", contact: "amara", intent: "guidance", maxPressure: 2, readDelay: [1800, 4000], typingSequence: [{ typing: 2400 }, { pause: 900 }, { typing: 2800 }], text: ["I thought YOU were the investigator, big shot 😂", "Look around. Tell me what makes you ask a question."] },
    { id: "amara-guidance-2", contact: "amara", intent: "guidance", maxPressure: 4, readDelay: [2200, 4800], typingDelay: 3900, text: ["Hey, I'm not there. YOU are lol", "Start with what you actually know and work outward."] },
    { id: "amara-guidance-3", contact: "amara", intent: "guidance", minPressure: 3, maxPressure: 6, text: ["You want me to get your salary too when this is done??? 😂", "Seriously though — give me something new to work with."] },
    { id: "amara-guidance-4", contact: "amara", intent: "guidance", minPressure: 5, maxPressure: 7, text: ["You are like literally badgering me now lol", "Go investigate. Message me when you have something."], enterDnd: true, dndDelay: 1200 },
    { id: "amara-guidance-read", contact: "amara", intent: "guidance", minPressure: 8, readOnly: true, dndAtPressure: 8, dndDelay: 1400, text: [] },
    { id: "amara-vehicle-1", contact: "amara", intent: "vehicle_research", text: ["Yeah, send it over.", "I'll see what I can get from the registration."] },
    { id: "mensah-status-1", contact: "mensah", intent: "status", maxPressure: 3, readDelay: [4000, 7000], typingDelay: 3600, text: ["Good.", "Observe before you disturb anything."] },
    { id: "mensah-guidance-1", contact: "mensah", intent: "guidance", maxPressure: 2, text: ["Where are you standing?", "Then start there."] },
    { id: "mensah-guidance-2", contact: "mensah", intent: "guidance", minPressure: 3, maxPressure: 5, readDelay: [4500, 7500], typingSequence: [{ typing: 3500 }, { pause: 1800 }, { typing: 3200 }], text: ["What have you learned since the last time you asked me?"] },
    { id: "mensah-guidance-no", contact: "mensah", intent: "guidance", minPressure: 4, maxPressure: 5, readDelay: [4200, 6800], preTypingDelay: 1800, typingSequence: [{ typing: 4200 }, { pause: 2600 }, { typing: 5200 }, { pause: 3200 }, { typing: 4100 }], text: ["No."] },
    { id: "mensah-guidance-read", contact: "mensah", intent: "guidance", minPressure: 6, readOnly: true, text: [] },
  ],
};
