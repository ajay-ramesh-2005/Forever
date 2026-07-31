export const DEFAULT_WEBSITE_CONFIG = {
  id: 'default-gfday-2026',
  slug: 'forever-us',
  title: "Forever Us | Girlfriend's Day Special",
  girlfriendName: "Sophia",
  startDate: "2023-08-01T00:00:00.000Z",
  musicUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
  musicTitle: "Romantic Piano Melody",
  
  // Page 1: Timer & Proposal
  page1: {
    title: "We've been together for",
    question: "Will you be mine forever? 💖",
    subtitle: "Try saying NO... I dare you 😏",
    noCaptions: [
      "Nope 😜",
      "Catch me first 💨",
      "You really thought? 🤭",
      "Hehe 💕",
      "Not happening 💖",
      "You can't reject destiny ✨",
      "Nice try! 😉",
      "Forever means forever! 🥰"
    ]
  },

  // Page 2: Love Meter
  page2: {
    topMessage: "Awww... That's the sweetest answer ever 🥰",
    subtitle: "Click the big heart to fill our Love Meter to 100%!",
    targetClicks: 70,
    completionPopup: "I'm 100% Yours My Love 💖✨",
  },

  // Page 3: Memory Timeline
  memories: [
    {
      id: "mem-1",
      date: "August 1, 2023",
      title: "The Day We First Met ☕",
      description: "It felt like time stood still. The moment you smiled, I knew my life was changed forever.",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "mem-2",
      date: "October 14, 2023",
      title: "Stargazing Night ✨",
      description: "We sat under the starry sky for hours talking about our dreams, laughing until our stomachs hurt.",
      imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "mem-3",
      date: "February 14, 2024",
      title: "Our First Valentine's Trip 🌅",
      description: "Watching the golden sunset holding your hand. Every second with you feels like a dream come true.",
      imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "mem-4",
      date: "December 25, 2024",
      title: "Holiday Magic 🎄",
      description: "Cozy blankets, hot chocolate, and your warm hugs. You are my favorite place to be.",
      imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "mem-5",
      date: "Today & Always",
      title: "Creating Our Forever 💖",
      description: "Every single day with you is a blessing. Here is to a thousand more memories together!",
      imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80"
    }
  ],

  // Page 4: Bouquet
  page4: {
    message: "This bouquet will never dry...\nJust like my love for you 🌹✨",
    buttonText: "Accept My Flowers 💐",
    bouquetImage: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"
  },

  // Page 5: Love Letter & Coupon
  page5: {
    envelopeTitle: "A Secret Letter For You 💌",
    openButtonText: "Open Letter ✨",
    letterText: `My Dearest Sophia,

From the moment you entered my world, everything became brighter, warmer, and infinitely more beautiful. Your smile is my daily dose of happiness, and your laughter is my absolute favorite song in the world.

Thank you for being my best friend, my soulmate, my biggest supporter, and the love of my life. No matter where life takes us, my heart will always belong to you.

Happy Girlfriend's Day, my love. Forever & Always. ❤️`,
    typingSpeedMs: 40,
    enableTypingSound: true,
    couponTitle: "LIFETIME REWARD COUPON",
    perk1: "Unlimited Hugs 🫂",
    perk2: "Unlimited Kisses 💋",
    couponOwner: "The Love Of My Life 👑",
    validity: "Lifetime & Beyond"
  },

  // Grand Finale
  ending: {
    fireworkHeading: "HAPPY GIRLFRIEND'S DAY",
    herName: "Sophia 💕",
    subHeading: "I Love You Forever",
    finalNote: "Thank you for being the best part of my life.",
    footerText: "Forever Yours ❤️"
  },

  // Theme Settings
  theme: {
    primaryColor: "#f43f5e",
    secondaryColor: "#ec4899",
    accentColor: "#a855f7",
    fontFamily: "Poppins",
    heartColor: "#f43f5e",
    sparkleColor: "#fbbf24"
  },

  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const SAMPLE_WEBSITES = [
  DEFAULT_WEBSITE_CONFIG,
  {
    ...DEFAULT_WEBSITE_CONFIG,
    id: "sample-2",
    slug: "emma-love-story",
    title: "Emma's Digital Love Story",
    girlfriendName: "Emma",
    startDate: "2022-05-15T00:00:00.000Z",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];
