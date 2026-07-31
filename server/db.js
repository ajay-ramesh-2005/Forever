import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

// Default initial data
const INITIAL_DATA = [
  {
    id: 'forever-us-default',
    slug: 'forever-us',
    title: "Forever Us | Girlfriend's Day Special",
    girlfriendName: "Sophia",
    startDate: "2023-08-01T00:00:00.000Z",
    musicUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
    musicTitle: "Romantic Piano Melody",
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
        "You can't reject destiny ✨"
      ]
    },
    page2: {
      topMessage: "Awww... That's the sweetest answer ever 🥰",
      subtitle: "Click the big heart to fill our Love Meter to 100%!",
      targetClicks: 70,
      completionPopup: "I'm 100% Yours My Love 💖✨",
    },
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
      }
    ],
    page4: {
      message: "This bouquet will never dry...\nJust like my love for you 🌹✨",
      buttonText: "Accept My Flowers 💐",
      bouquetImage: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"
    },
    page5: {
      envelopeTitle: "A Secret Letter For You 💌",
      openButtonText: "Open Letter ✨",
      letterText: "My Dearest Sophia,\n\nFrom the moment you entered my world, everything became brighter, warmer, and infinitely more beautiful. Your smile is my daily dose of happiness, and your laughter is my absolute favorite song in the world.\n\nThank you for being my best friend, my soulmate, my biggest supporter, and the love of my life. No matter where life takes us, my heart will always belong to you.\n\nHappy Girlfriend's Day, my love. Forever & Always. ❤️",
      typingSpeedMs: 40,
      enableTypingSound: true,
      couponTitle: "LIFETIME REWARD COUPON",
      perk1: "Unlimited Hugs 🫂",
      perk2: "Unlimited Kisses 💋",
      couponOwner: "The Love Of My Life 👑",
      validity: "Lifetime & Beyond"
    },
    ending: {
      fireworkHeading: "HAPPY GIRLFRIEND'S DAY",
      herName: "Sophia 💕",
      subHeading: "I Love You Forever",
      finalNote: "Thank you for being the best part of my life.",
      footerText: "Forever Yours ❤️"
    },
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
  }
];

export function readDb() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
      return INITIAL_DATA;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading JSON db:', err);
    return INITIAL_DATA;
  }
}

export function writeDb(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing JSON db:', err);
  }
}
