export const characterProfiles = {
  amara: {
    id: "amara",
    handle: "MaraMara09",
    name: "Amara Okoye",
    defaultStatus: "Online",
    tone: "online",
    readDelay: [1500, 3600],
    preTypingDelay: [350, 1300],
    pressureDndMs: 300000,
    phrasePools: {
      greetings: ["Hey kid", "Hola", "Hey friend", "What's up, detective?", "Hey Sherlock", "Howdy"],
      salaryTeases: [
        "You want me to get your salary too when this is done??? 😂",
        "Maybe they should send your salary directly to me this month 😂",
        "I'll be sure to send you my bill when this is done.",
        "I'll send my banking details so you can pay me when you get paid too 😂",
      ],
      afterBadgering: [
        "Now before we start, don't hit me with all those messages like last time. I'm busy too, ya know 😂",
        "Okay buddy, we're talking again. Don't kill it now — I have work too 😂",
        "Let's be mindful of the message output this round, detective. I do have other work 😂",
      ],
    },
  },
  mensah: {
    id: "mensah",
    handle: "Dr.Kay",
    name: "Dr. Kofi Mensah",
    defaultStatus: "Busy",
    tone: "busy",
    readDelay: [3500, 7000],
    preTypingDelay: [1600, 4000],
    pressureDndMs: 300000,
    phrasePools: {},
  },
};
