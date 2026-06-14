// Encouragement verse bank — KJV (public domain), rotated by src/lib/verses.ts
// so no verse repeats until the whole bank has been seen in that browser.
// Structural verses (scripture.ts, VISION_LOCK) are deliberately excluded so a
// page never shows the same verse twice.

export type VerseTheme =
  | "courage"
  | "perseverance"
  | "diligence"
  | "wisdom"
  | "rest"
  | "victory"
  | "fellowship"
  | "hope";

export interface BankVerse {
  ref: string;
  text: string;
  themes: VerseTheme[];
}

export const VERSE_BANK: readonly BankVerse[] = [
  // ---------- COURAGE ----------
  {
    ref: "Deuteronomy 31:6",
    text:
      "Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.",
    themes: ["courage"],
  },
  {
    ref: "Isaiah 41:10",
    text:
      "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
    themes: ["courage", "hope"],
  },
  {
    ref: "Psalm 27:1",
    text:
      "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?",
    themes: ["courage"],
  },
  {
    ref: "Psalm 31:24",
    text: "Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD.",
    themes: ["courage", "hope"],
  },
  {
    ref: "Psalm 56:3",
    text: "What time I am afraid, I will trust in thee.",
    themes: ["courage", "rest"],
  },
  {
    ref: "2 Timothy 1:7",
    text:
      "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
    themes: ["courage"],
  },
  {
    ref: "Psalm 118:6",
    text: "The LORD is on my side; I will not fear: what can man do unto me?",
    themes: ["courage"],
  },
  {
    ref: "Psalm 46:1",
    text: "God is our refuge and strength, a very present help in trouble.",
    themes: ["courage", "rest"],
  },
  {
    ref: "1 Chronicles 28:20",
    text:
      "Be strong and of good courage, and do it: fear not, nor be dismayed: for the LORD God, even my God, will be with thee; he will not fail thee, nor forsake thee, until thou hast finished all the work.",
    themes: ["courage", "diligence"],
  },
  {
    ref: "Isaiah 40:31",
    text:
      "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    themes: ["courage", "perseverance", "hope"],
  },

  // ---------- PERSEVERANCE ----------
  {
    ref: "Galatians 6:9",
    text:
      "And let us not be weary in well doing: for in due season we shall reap, if we faint not.",
    themes: ["perseverance", "diligence"],
  },
  {
    ref: "James 1:12",
    text:
      "Blessed is the man that endureth temptation: for when he is tried, he shall receive the crown of life, which the Lord hath promised to them that love him.",
    themes: ["perseverance"],
  },
  {
    ref: "James 1:3-4",
    text:
      "Knowing this, that the trying of your faith worketh patience. But let patience have her perfect work, that ye may be perfect and entire, wanting nothing.",
    themes: ["perseverance"],
  },
  {
    ref: "Romans 5:3-4",
    text:
      "We glory in tribulations also: knowing that tribulation worketh patience; and patience, experience; and experience, hope.",
    themes: ["perseverance", "hope"],
  },
  {
    ref: "1 Corinthians 15:58",
    text:
      "Therefore, my beloved brethren, be ye stedfast, unmoveable, always abounding in the work of the Lord, forasmuch as ye know that your labour is not in vain in the Lord.",
    themes: ["perseverance", "diligence"],
  },
  {
    ref: "Philippians 3:14",
    text: "I press toward the mark for the prize of the high calling of God in Christ Jesus.",
    themes: ["perseverance"],
  },
  {
    ref: "2 Chronicles 15:7",
    text:
      "Be ye strong therefore, and let not your hands be weak: for your work shall be rewarded.",
    themes: ["perseverance", "diligence"],
  },
  {
    ref: "Hebrews 10:36",
    text:
      "For ye have need of patience, that, after ye have done the will of God, ye might receive the promise.",
    themes: ["perseverance"],
  },
  {
    ref: "Micah 7:8",
    text:
      "Rejoice not against me, O mine enemy: when I fall, I shall arise; when I sit in darkness, the LORD shall be a light unto me.",
    themes: ["perseverance", "hope"],
  },
  {
    ref: "Proverbs 24:16",
    text: "For a just man falleth seven times, and riseth up again.",
    themes: ["perseverance"],
  },
  {
    ref: "Job 23:10",
    text:
      "But he knoweth the way that I take: when he hath tried me, I shall come forth as gold.",
    themes: ["perseverance"],
  },
  {
    ref: "Habakkuk 3:19",
    text:
      "The LORD God is my strength, and he will make my feet like hinds' feet, and he will make me to walk upon mine high places.",
    themes: ["perseverance", "victory"],
  },

  // ---------- DILIGENCE ----------
  {
    ref: "Proverbs 13:4",
    text:
      "The soul of the sluggard desireth, and hath nothing: but the soul of the diligent shall be made fat.",
    themes: ["diligence"],
  },
  {
    ref: "Proverbs 21:5",
    text: "The thoughts of the diligent tend only to plenteousness.",
    themes: ["diligence"],
  },
  {
    ref: "Proverbs 22:29",
    text:
      "Seest thou a man diligent in his business? he shall stand before kings; he shall not stand before mean men.",
    themes: ["diligence"],
  },
  {
    ref: "Ecclesiastes 9:10",
    text: "Whatsoever thy hand findeth to do, do it with thy might.",
    themes: ["diligence"],
  },
  {
    ref: "2 Timothy 2:15",
    text:
      "Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth.",
    themes: ["diligence", "wisdom"],
  },
  {
    ref: "Proverbs 12:24",
    text: "The hand of the diligent shall bear rule.",
    themes: ["diligence"],
  },
  {
    ref: "Proverbs 10:4",
    text:
      "He becometh poor that dealeth with a slack hand: but the hand of the diligent maketh rich.",
    themes: ["diligence"],
  },
  {
    ref: "2 Peter 1:5",
    text:
      "And beside this, giving all diligence, add to your faith virtue; and to virtue knowledge.",
    themes: ["diligence", "wisdom"],
  },

  // ---------- WISDOM ----------
  {
    ref: "James 1:5",
    text:
      "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.",
    themes: ["wisdom"],
  },
  {
    ref: "Proverbs 2:6",
    text: "For the LORD giveth wisdom: out of his mouth cometh knowledge and understanding.",
    themes: ["wisdom"],
  },
  {
    ref: "Proverbs 3:5-6",
    text:
      "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    themes: ["wisdom", "rest"],
  },
  {
    ref: "Proverbs 9:10",
    text:
      "The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.",
    themes: ["wisdom"],
  },
  {
    ref: "Psalm 119:105",
    text: "Thy word is a lamp unto my feet, and a light unto my path.",
    themes: ["wisdom"],
  },
  {
    ref: "Psalm 119:130",
    text: "The entrance of thy words giveth light; it giveth understanding unto the simple.",
    themes: ["wisdom"],
  },
  {
    ref: "Proverbs 18:15",
    text:
      "The heart of the prudent getteth knowledge; and the ear of the wise seeketh knowledge.",
    themes: ["wisdom", "diligence"],
  },
  {
    ref: "Proverbs 16:3",
    text: "Commit thy works unto the LORD, and thy thoughts shall be established.",
    themes: ["wisdom", "rest"],
  },
  {
    ref: "Proverbs 1:5",
    text:
      "A wise man will hear, and will increase learning; and a man of understanding shall attain unto wise counsels.",
    themes: ["wisdom"],
  },
  {
    ref: "Daniel 2:21",
    text:
      "He giveth wisdom unto the wise, and knowledge to them that know understanding.",
    themes: ["wisdom"],
  },

  // ---------- REST ----------
  {
    ref: "Philippians 4:6-7",
    text:
      "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    themes: ["rest"],
  },
  {
    ref: "Psalm 4:8",
    text:
      "I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.",
    themes: ["rest"],
  },
  {
    ref: "Isaiah 26:3",
    text:
      "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.",
    themes: ["rest"],
  },
  {
    ref: "1 Peter 5:7",
    text: "Casting all your care upon him; for he careth for you.",
    themes: ["rest"],
  },
  {
    ref: "Psalm 55:22",
    text:
      "Cast thy burden upon the LORD, and he shall sustain thee: he shall never suffer the righteous to be moved.",
    themes: ["rest"],
  },
  {
    ref: "John 14:27",
    text:
      "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
    themes: ["rest", "courage"],
  },
  {
    ref: "Exodus 14:14",
    text: "The LORD shall fight for you, and ye shall hold your peace.",
    themes: ["rest", "victory"],
  },
  {
    ref: "Psalm 94:19",
    text: "In the multitude of my thoughts within me thy comforts delight my soul.",
    themes: ["rest"],
  },
  {
    ref: "Psalm 23:1-2",
    text:
      "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    themes: ["rest"],
  },

  // ---------- VICTORY ----------
  {
    ref: "Philippians 4:13",
    text: "I can do all things through Christ which strengtheneth me.",
    themes: ["victory", "courage"],
  },
  {
    ref: "1 Corinthians 15:57",
    text:
      "But thanks be to God, which giveth us the victory through our Lord Jesus Christ.",
    themes: ["victory"],
  },
  {
    ref: "Romans 8:31",
    text: "If God be for us, who can be against us?",
    themes: ["victory", "courage"],
  },
  {
    ref: "Romans 8:37",
    text:
      "Nay, in all these things we are more than conquerors through him that loved us.",
    themes: ["victory"],
  },
  {
    ref: "2 Corinthians 2:14",
    text: "Now thanks be unto God, which always causeth us to triumph in Christ.",
    themes: ["victory"],
  },
  {
    ref: "Deuteronomy 20:4",
    text:
      "For the LORD your God is he that goeth with you, to fight for you against your enemies, to save you.",
    themes: ["victory", "courage"],
  },
  {
    ref: "Psalm 60:12",
    text: "Through God we shall do valiantly: for he it is that shall tread down our enemies.",
    themes: ["victory"],
  },
  {
    ref: "1 John 5:4",
    text: "And this is the victory that overcometh the world, even our faith.",
    themes: ["victory"],
  },
  {
    ref: "Zechariah 4:6",
    text: "Not by might, nor by power, but by my spirit, saith the LORD of hosts.",
    themes: ["victory", "rest"],
  },

  // ---------- FELLOWSHIP ----------
  {
    ref: "Romans 12:12",
    text: "Rejoicing in hope; patient in tribulation; continuing instant in prayer.",
    themes: ["fellowship", "hope", "perseverance"],
  },
  {
    ref: "Proverbs 27:17",
    text: "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.",
    themes: ["fellowship", "diligence"],
  },
  {
    ref: "Hebrews 10:24",
    text: "And let us consider one another to provoke unto love and to good works.",
    themes: ["fellowship"],
  },
  {
    ref: "Matthew 18:20",
    text:
      "For where two or three are gathered together in my name, there am I in the midst of them.",
    themes: ["fellowship"],
  },
  {
    ref: "1 Thessalonians 5:11",
    text:
      "Wherefore comfort yourselves together, and edify one another, even as also ye do.",
    themes: ["fellowship"],
  },

  // ---------- HOPE ----------
  {
    ref: "Lamentations 3:22-23",
    text:
      "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
    themes: ["hope"],
  },
  {
    ref: "Jeremiah 29:11",
    text:
      "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
    themes: ["hope"],
  },
  {
    ref: "Philippians 1:6",
    text:
      "Being confident of this very thing, that he which hath begun a good work in you will perform it until the day of Jesus Christ.",
    themes: ["hope", "perseverance"],
  },
  {
    ref: "Psalm 121:1-2",
    text:
      "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.",
    themes: ["hope"],
  },
  {
    ref: "Romans 15:13",
    text:
      "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.",
    themes: ["hope", "rest"],
  },
  {
    ref: "Psalm 37:5",
    text:
      "Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.",
    themes: ["hope", "rest"],
  },
  {
    ref: "Isaiah 43:2",
    text:
      "When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee.",
    themes: ["hope", "courage"],
  },
  {
    ref: "Psalm 28:7",
    text:
      "The LORD is my strength and my shield; my heart trusted in him, and I am helped.",
    themes: ["hope", "courage"],
  },
  {
    ref: "Nehemiah 8:10",
    text: "The joy of the LORD is your strength.",
    themes: ["hope", "victory"],
  },
  {
    ref: "Psalm 16:8",
    text:
      "I have set the LORD always before me: because he is at my right hand, I shall not be moved.",
    themes: ["hope", "courage"],
  },
];
