// Walk — 45-day spiritual companion for bar exam candidates.
// Covers June 15 – July 29, 2026 (Exam Day 2, California bar).
// Exam Days: July 28 (Day 1) and July 29 (Day 2).
// All scripture: King James Version.

export interface WalkEntry {
  date: string; // YYYY-MM-DD
  day: number; // 1-indexed from June 15
  label?: string; // special label e.g. "EXAM DAY"
  dailyBread: {
    scripture: string;
    reference: string;
    reflection: string;
  };
  prayer: string;
  armorWord: {
    piece: string;
    verse: string;
    application: string;
  };
  enemyLie: {
    lie: string;
    truth: string;
    reference: string;
  };
  communion: {
    gratitude: string;
    release: string;
    ask: string;
  };
}

// Armor pieces cycle every 6 days (Ephesians 6:14-17)
const ARMOR: WalkEntry["armorWord"][] = [
  {
    piece: "Belt of Truth",
    verse: "Stand therefore, having your loins girt about with truth. — Eph 6:14",
    application: "Bind truth tightly today. Read the rule exactly as it is — not as you hope or fear it to be.",
  },
  {
    piece: "Breastplate of Righteousness",
    verse: "And having on the breastplate of righteousness. — Eph 6:14",
    application: "Your standing before God is not measured by your score. Work from security, not from shame.",
  },
  {
    piece: "Shoes of the Gospel of Peace",
    verse: "Your feet shod with the preparation of the gospel of peace. — Eph 6:15",
    application: "Move steadily. Every drill is ground taken. The peace of Christ keeps your footing sure.",
  },
  {
    piece: "Shield of Faith",
    verse: "Taking the shield of faith, wherewith ye shall be able to quench all the fiery darts of the wicked. — Eph 6:16",
    application: "When panic rises mid-question, raise the shield. One breath, one prayer — then read again.",
  },
  {
    piece: "Helmet of Salvation",
    verse: "And take the helmet of salvation. — Eph 6:17",
    application: "Your mind is protected. No anxious thought has authority here unless you let it through.",
  },
  {
    piece: "Sword of the Spirit",
    verse: "And the sword of the Spirit, which is the word of God. — Eph 6:17",
    application: "The law is precise. The Word is precise. Wield both with care and with confidence.",
  },
];

export const WALK_DATA: WalkEntry[] = [
  // ── WEEK 1: Foundation — "I am equipped" ──────────────────────────────────
  {
    date: "2026-06-15",
    day: 1,
    dailyBread: {
      scripture: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
      reference: "Joshua 1:9",
      reflection: "God gave Joshua this charge before his hardest assignment. The same God gives it to you today. This is not a suggestion — it is a command, and the command comes with a promise: He is with you.",
    },
    prayer: "Lord, I begin this final stretch to the bar with my hands open. I don't have everything figured out, and I don't need to. You have commanded me to be strong — not in my own strength, but in Yours. Be with me in every drill, every review, every moment the fear rises. Let Your presence be more real to me today than my anxiety. In Jesus' name, amen.",
    armorWord: ARMOR[0],
    enemyLie: {
      lie: "I haven't studied enough to pass.",
      truth: "I can do all things through Christ which strengtheneth me.",
      reference: "Philippians 4:13",
    },
    communion: {
      gratitude: "God's faithfulness in bringing me to this point",
      release: "The fear that I'm already behind",
      ask: "Clarity and focus for today's work",
    },
  },
  {
    date: "2026-06-16",
    day: 2,
    dailyBread: {
      scripture: "Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.",
      reference: "Psalm 27:14",
      reflection: "Waiting is not passivity — it is expectant trust. You prepare, and you wait on God to do what preparation alone cannot. He strengthens the heart that turns to Him.",
    },
    prayer: "Father, teach me to wait on You without panic. I am doing the work — show me how to trust You with the outcome. Strengthen my heart today, especially in the moments when the material feels overwhelming. Let my study be an act of worship, not just an act of fear. In Christ's name, amen.",
    armorWord: ARMOR[1],
    enemyLie: {
      lie: "Everyone else is more prepared than I am.",
      truth: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
      reference: "2 Timothy 1:7",
    },
    communion: {
      gratitude: "The sound mind God has given me",
      release: "Comparison with other bar takers",
      ask: "A spirit of power, love, and discipline today",
    },
  },
  {
    date: "2026-06-17",
    day: 3,
    dailyBread: {
      scripture: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
      reference: "Isaiah 40:31",
      reflection: "God does not merely sustain your effort — He renews it. When fatigue sets in, you are not running on your reserves alone. There is a supernatural replenishment available to those who wait on Him.",
    },
    prayer: "Lord, I am already feeling tired, and the exam is still weeks away. Renew my strength today. Let me mount up like an eagle — above the anxiety, above the noise, into the clear air of Your presence. When I feel like I cannot keep going, be my second wind. In Jesus' name, amen.",
    armorWord: ARMOR[2],
    enemyLie: {
      lie: "I'm too tired. I can't retain anything today.",
      truth: "He giveth power to the faint; and to them that have no might he increaseth strength.",
      reference: "Isaiah 40:29",
    },
    communion: {
      gratitude: "Rest I have received, and rest that is coming",
      release: "The burden of performing under exhaustion",
      ask: "Renewed energy and retention today",
    },
  },
  {
    date: "2026-06-18",
    day: 4,
    dailyBread: {
      scripture: "I can do all things through Christ which strengtheneth me.",
      reference: "Philippians 4:13",
      reflection: "Paul wrote this from prison — not from a position of comfort. The 'all things' includes exactly the hard thing in front of you right now. This is not motivational language; it is a theological claim about who strengthens you.",
    },
    prayer: "Jesus, I need You in the middle of this. Not just at the beginning and end, but in every question, every rule, every moment of doubt. Strengthen me for what is in front of me today. I believe You are sufficient — make that belief feel real. Amen.",
    armorWord: ARMOR[3],
    enemyLie: {
      lie: "This subject is too hard. I'll never master it.",
      truth: "With God all things are possible.",
      reference: "Matthew 19:26",
    },
    communion: {
      gratitude: "The specific subject I struggled with that I'm finally beginning to understand",
      release: "The belief that the hard material is beyond me",
      ask: "Breakthrough understanding today",
    },
  },
  {
    date: "2026-06-19",
    day: 5,
    dailyBread: {
      scripture: "For the LORD giveth wisdom: out of his mouth cometh knowledge and understanding.",
      reference: "Proverbs 2:6",
      reflection: "Wisdom for the bar is not just what you memorize — it is a gift from God that opens the structure of the law to you. Ask for it. He gives generously.",
    },
    prayer: "Lord God, You are the source of all wisdom. Open my understanding today. Let the rules I study not just be stored in short-term memory but become true comprehension — the kind that survives the pressure of an exam room. Give me the gift of wisdom that is from above. In Jesus' name, amen.",
    armorWord: ARMOR[4],
    enemyLie: {
      lie: "I'm not smart enough for this.",
      truth: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.",
      reference: "James 1:5",
    },
    communion: {
      gratitude: "The intelligence and memory I have been given",
      release: "The impostor syndrome that says I don't belong here",
      ask: "Wisdom beyond my own understanding today",
    },
  },
  {
    date: "2026-06-20",
    day: 6,
    dailyBread: {
      scripture: "Be still, and know that I am God.",
      reference: "Psalm 46:10",
      reflection: "The full context is war — nations in chaos, kingdoms falling. In the middle of that, God says: be still. The stillness is not passive. It is an act of defiance against panic. It is choosing to know who God is when everything else is loud.",
    },
    prayer: "Lord, teach me to be still. Not lazy — still. To stop the mental spiral and simply know that You are God and You are in control of this outcome. Give me moments of true rest in You today, between the work sessions. Let my study be held by Your peace. Amen.",
    armorWord: ARMOR[5],
    enemyLie: {
      lie: "I need to study every waking hour or I'll fail.",
      truth: "It is vain for you to rise up early, to sit up late, to eat the bread of sorrows: for so he giveth his beloved sleep.",
      reference: "Psalm 127:2",
    },
    communion: {
      gratitude: "The quiet moments God has given me this week",
      release: "The compulsion to grind without rest",
      ask: "Wisdom to work hard and rest well",
    },
  },
  {
    date: "2026-06-21",
    day: 7,
    dailyBread: {
      scripture: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
      reference: "Romans 8:28",
      reflection: "All things — including the failed practice tests, the wrong answers, the subjects you keep getting wrong. God is weaving every frustration into preparation. Nothing is wasted.",
    },
    prayer: "Father, I believe that even my mistakes are working together for my good. Use every wrong answer I've gotten as a teacher. Use every hard day as a builder. I trust Your purposes over my timeline. One week in — keep me faithful to the work and faithful to You. In Jesus' name, amen.",
    armorWord: ARMOR[0],
    enemyLie: {
      lie: "My past failures on this exam define what will happen next time.",
      truth: "Behold, I will do a new thing; now it shall spring forth; shall ye not know it?",
      reference: "Isaiah 43:19",
    },
    communion: {
      gratitude: "One specific thing God worked for good this week",
      release: "The weight of past exam failures",
      ask: "Eyes to see the new thing God is doing",
    },
  },
  // ── WEEK 2: Endurance — "I will not quit" ────────────────────────────────
  {
    date: "2026-06-22",
    day: 8,
    dailyBread: {
      scripture: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
      reference: "2 Timothy 1:7",
      reflection: "Fear is not from God. That sharp anxiety before a timed set — that gripping dread at the thought of the exam room — is not from Him. Power, love, and a sound mind are. You can refuse what is not from God.",
    },
    prayer: "Lord, I refuse the spirit of fear today. I receive the spirit of power, love, and a sound mind. When anxiety creeps into my study session, I speak Your Word over it: this is not from You. I choose the mind You gave me. Make it sound and sharp today. Amen.",
    armorWord: ARMOR[1],
    enemyLie: {
      lie: "I'm going to freeze up on exam day.",
      truth: "Thou wilt keep him in perfect peace, whose mind is stayed on thee.",
      reference: "Isaiah 26:3",
    },
    communion: {
      gratitude: "The sound, capable mind God gave me",
      release: "Fear of freezing under pressure",
      ask: "Perfect peace on exam day and every day before it",
    },
  },
  {
    date: "2026-06-23",
    day: 9,
    dailyBread: {
      scripture: "Thy word is a lamp unto my feet, and a light unto my path.",
      reference: "Psalm 119:105",
      reflection: "A lamp lights the next step — not the whole road. You don't need to see July 29 from here. You just need the next question, the next rule, the next hour. Walk in the light you have.",
    },
    prayer: "Father, I only need to see the next step. Light my way today. I don't know how everything will come together by exam day — You do. Give me the lamp for what is right in front of me. Keep my eyes from wandering to what I can't yet see. In Jesus' name, amen.",
    armorWord: ARMOR[2],
    enemyLie: {
      lie: "I can't see how I'm going to be ready in time.",
      truth: "Your word is a lamp to my feet and a light to my path.",
      reference: "Psalm 119:105",
    },
    communion: {
      gratitude: "The specific clarity I received in today's study",
      release: "The anxiety about what I can't see or control",
      ask: "Light for the next step, not the whole road",
    },
  },
  {
    date: "2026-06-24",
    day: 10,
    dailyBread: {
      scripture: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
      reference: "Isaiah 41:10",
      reflection: "Five promises in one verse: I am with you. I am your God. I will strengthen you. I will help you. I will uphold you. This is not poetry — it is a covenant. Hold Him to it.",
    },
    prayer: "God, hold me up today. I feel the pressure building and I need You to be exactly who You said You would be. You promised to strengthen me, help me, uphold me. I am standing on every one of those promises right now. Do not let my foot slip. In Christ's name, amen.",
    armorWord: ARMOR[3],
    enemyLie: {
      lie: "I'm on my own out here.",
      truth: "I will never leave thee, nor forsake thee.",
      reference: "Hebrews 13:5",
    },
    communion: {
      gratitude: "A moment this week when I felt God's help",
      release: "The feeling of being alone in this",
      ask: "To feel upheld by His righteous right hand today",
    },
  },
  {
    date: "2026-06-25",
    day: 11,
    dailyBread: {
      scripture: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.",
      reference: "James 1:5",
      reflection: "He gives liberally. He does not scold you for asking, or for needing to ask again tomorrow. The door is always open, and the supply is always enough.",
    },
    prayer: "Lord, I lack wisdom today for this material. I am asking. You said You give liberally — I receive that generosity. Open the rules to me in a new way. Let what has been confusing become clear, not by my straining but by Your gift. Thank You for never running out. Amen.",
    armorWord: ARMOR[4],
    enemyLie: {
      lie: "I've prayed about this before and nothing changed.",
      truth: "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.",
      reference: "Matthew 7:7",
    },
    communion: {
      gratitude: "God's patience with my repeated asking",
      release: "Cynicism about whether prayer changes my studying",
      ask: "Wisdom for the specific concept I've been stuck on",
    },
  },
  {
    date: "2026-06-26",
    day: 12,
    dailyBread: {
      scripture: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
      reference: "Psalm 23:4",
      reflection: "David did not walk around the valley — he walked through it. You don't get to skip the hard weeks. But you walk through them with a Shepherd who knows every shadow and holds the rod.",
    },
    prayer: "Good Shepherd, I am in a valley right now. The material is hard, the days are long, and I can see the shadow of the exam on the horizon. Walk through this with me. Let Your rod and staff — Your structure and Your presence — comfort me. I will fear no evil. You are with me. Amen.",
    armorWord: ARMOR[5],
    enemyLie: {
      lie: "This hard season means something is wrong — I should quit.",
      truth: "Blessed is the man that endureth temptation: for when he is tried, he shall receive the crown of life.",
      reference: "James 1:12",
    },
    communion: {
      gratitude: "Valleys I've walked through before that God led me out of",
      release: "The temptation to quit when the way is hard",
      ask: "Comfort and direction through this difficult stretch",
    },
  },
  {
    date: "2026-06-27",
    day: 13,
    dailyBread: {
      scripture: "Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us.",
      reference: "Hebrews 12:1",
      reflection: "You are not running alone. A cloud of those who have run before you — who faced their own impossible things and finished — is watching. Lay aside the weights: distraction, self-doubt, comparison. Run with patience. Not speed — patience.",
    },
    prayer: "Lord, I lay aside every weight today. The distraction of social media. The comparison with others. The weight of my own self-criticism. I strip those off and I run. Not perfectly, not without struggle — but I run. Let the patience of Your saints strengthen mine. In Jesus' name, amen.",
    armorWord: ARMOR[0],
    enemyLie: {
      lie: "I'm so far behind I can't catch up.",
      truth: "The race is not to the swift, nor the battle to the strong... but time and chance happeneth to them all.",
      reference: "Ecclesiastes 9:11",
    },
    communion: {
      gratitude: "The witnesses — those who have passed this exam and those who believe I will",
      release: "The weight of perfectionism in my preparation",
      ask: "Patient endurance for the long race",
    },
  },
  {
    date: "2026-06-28",
    day: 14,
    dailyBread: {
      scripture: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
      reference: "Philippians 4:7",
      reflection: "This peace is not the absence of hard things. It passes understanding — which means it will sometimes feel illogical given your circumstances. God guards your heart and mind from the inside out.",
    },
    prayer: "Lord, I want the peace that passes understanding. The kind that makes no sense given the amount of material I still have to review, the days left, the pressure I feel. Guard my heart and my mind in Christ Jesus today. Let Your peace be the thing people around me notice. Amen.",
    armorWord: ARMOR[1],
    enemyLie: {
      lie: "Peace is for people who have everything figured out. I can't afford to be at peace right now.",
      truth: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
      reference: "John 14:27",
    },
    communion: {
      gratitude: "Two weeks of faithfulness to this preparation",
      release: "The idea that anxiety is necessary to perform well",
      ask: "Peace that guards and steadies rather than numbs",
    },
  },
  {
    date: "2026-06-29",
    day: 15,
    dailyBread: {
      scripture: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
      reference: "Jeremiah 29:11",
      reflection: "God's plans for you are not to harm you. They include an expected end — a hoped-for future. The bar exam is not the ceiling of what God has for you. It is a threshold to step through.",
    },
    prayer: "Father, Your thoughts toward me are for peace and for a future. Hold that truth in front of me today. Let me study with the calm certainty that You have already ordained my expected end, and it is good. I trust Your plans over my fears. In Jesus' name, amen.",
    armorWord: ARMOR[2],
    enemyLie: {
      lie: "God doesn't care about something as mundane as a bar exam.",
      truth: "The steps of a good man are ordered by the LORD: and he delighteth in his way.",
      reference: "Psalm 37:23",
    },
    communion: {
      gratitude: "God's specific care for the details of my life",
      release: "The belief that God is distant from this process",
      ask: "A sense of His ordered steps today",
    },
  },
  {
    date: "2026-06-30",
    day: 16,
    dailyBread: {
      scripture: "Delight thyself also in the LORD; and he shall give thee the desires of thine heart.",
      reference: "Psalm 37:4",
      reflection: "The deepest desire of a bar candidate is usually 'I want to pass.' God knows that desire. But the promise is tied to delight in Him first. When He is the source of your joy, your desires align with His gifts.",
    },
    prayer: "Lord, teach me to delight in You even in the middle of this grind. Let this season not be only about the exam, but about my relationship with You deepening. Give me the desires of my heart — including this one. Amen.",
    armorWord: ARMOR[3],
    enemyLie: {
      lie: "God doesn't want me to want to pass — that's too worldly a desire.",
      truth: "Delight thyself also in the LORD; and he shall give thee the desires of thine heart.",
      reference: "Psalm 37:4",
    },
    communion: {
      gratitude: "The legitimate, God-given desire to pass and serve",
      release: "False guilt about wanting to succeed",
      ask: "Delight in God that precedes and exceeds the exam outcome",
    },
  },
  // ── WEEK 3: Precision — "Truth above all" ────────────────────────────────
  {
    date: "2026-07-01",
    day: 17,
    dailyBread: {
      scripture: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
      reference: "Proverbs 3:5-6",
      reflection: "Bar prep tempts you to rely entirely on your own mental horsepower. But there is a wisdom that exceeds your best outline. Acknowledge Him in the study, in the questions, in the moment of uncertainty — and He will make your paths straight.",
    },
    prayer: "Lord, I acknowledge You in this. Every page I turn, every question I answer, every moment I don't know — I bring it to You. Direct my paths. Show me where to focus. Show me what matters. I trust You more than I trust my own understanding. Amen.",
    armorWord: ARMOR[4],
    enemyLie: {
      lie: "I just need to work harder. God helps those who help themselves.",
      truth: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
      reference: "Proverbs 3:5",
    },
    communion: {
      gratitude: "A time when God directed my path better than my own plan would have",
      release: "The self-reliance that excludes God from the process",
      ask: "Direction in how to spend today's study time",
    },
  },
  {
    date: "2026-07-02",
    day: 18,
    dailyBread: {
      scripture: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.",
      reference: "Isaiah 26:3",
      reflection: "Perfect peace is not a personality type — it is a result. The mind that is stayed on God gets perfect peace because the trust is in something that never moves. God is the fixed point.",
    },
    prayer: "Lord, keep my mind stayed on You today. When it drifts to fear of the outcome, call it back. When it drifts to comparison, call it back. Let Your unchanging nature be the anchor my mind holds while everything else moves. Keep me in that perfect peace. In Christ's name, amen.",
    armorWord: ARMOR[5],
    enemyLie: {
      lie: "I can't stop the anxious thoughts. My mind just races.",
      truth: "Casting down imaginations, and every high thing that exalteth itself against the knowledge of God, and bringing into captivity every thought to the obedience of Christ.",
      reference: "2 Corinthians 10:5",
    },
    communion: {
      gratitude: "The moments this week when my mind was truly at rest",
      release: "Runaway anxious thoughts about the exam",
      ask: "A mind anchored to God's unchanging nature",
    },
  },
  {
    date: "2026-07-03",
    day: 19,
    dailyBread: {
      scripture: "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof.",
      reference: "Matthew 6:34",
      reflection: "Jesus was not dismissing preparation — He was warning against borrowing tomorrow's trouble and bringing it into today. Study for today. Do not live in the exam room while you are still in June.",
    },
    prayer: "Jesus, I confess I live too much in July 28 and 29 when I should be fully present in today. Bring me back to the present. Today's work is enough. Today's effort is what I can give. Let me give it fully and release the future to You. Amen.",
    armorWord: ARMOR[0],
    enemyLie: {
      lie: "I need to imagine the worst-case scenario so I'm mentally prepared for it.",
      truth: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
      reference: "Philippians 4:6",
    },
    communion: {
      gratitude: "Today — fully — as a gift",
      release: "Mental time-traveling to exam day before I'm ready",
      ask: "Full presence and focus on today's specific work",
    },
  },
  {
    date: "2026-07-04",
    day: 20,
    dailyBread: {
      scripture: "Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.",
      reference: "Deuteronomy 31:6",
      reflection: "Moses spoke this to all Israel before entering a land they had never possessed. You are standing before something you have not yet crossed. The God who brought Moses' people through the wilderness will not fail you in your crossing.",
    },
    prayer: "Lord, You will not fail me, nor forsake me. That is Your Word, and it stands. I stand on it today. Give me courage that is not based on my feelings but on Your faithfulness. You have gone before me into this exam room — I am not the first to enter it with You. In Jesus' name, amen.",
    armorWord: ARMOR[1],
    enemyLie: {
      lie: "This is the hardest thing I've faced and I might not make it through.",
      truth: "No weapon that is formed against thee shall prosper.",
      reference: "Isaiah 54:17",
    },
    communion: {
      gratitude: "The specific courage God has grown in me this week",
      release: "The fear of the exam room itself",
      ask: "His presence going before me into every test",
    },
  },
  {
    date: "2026-07-05",
    day: 21,
    dailyBread: {
      scripture: "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.",
      reference: "Psalm 121:1-2",
      reflection: "Look up. The psalmist's reflex when overwhelmed was not to look inward or backward — it was to look up. Your help comes from the One who made the thing you're looking at.",
    },
    prayer: "God, I lift my eyes to You today. Not to my outline, not to my score report, not to my peers — to You, who made heaven and earth and holds the bar exam in Your hands. Be my help. Be my sufficient provision. You are all I need. Amen.",
    armorWord: ARMOR[2],
    enemyLie: {
      lie: "I have to figure this all out myself.",
      truth: "My help cometh from the LORD, which made heaven and earth.",
      reference: "Psalm 121:2",
    },
    communion: {
      gratitude: "Three weeks of study sustained by God's help",
      release: "The weight of self-reliance",
      ask: "A clear sense of where my help truly comes from",
    },
  },
  {
    date: "2026-07-06",
    day: 22,
    dailyBread: {
      scripture: "And not only so, but we glory in tribulations also: knowing that tribulation worketh patience; and patience, experience; and experience, hope.",
      reference: "Romans 5:3-4",
      reflection: "Hard practice sets work patience into you. Every timed question block that was painful is building something: patience → experience → hope. This difficulty is not an obstacle to your preparation — it is part of it.",
    },
    prayer: "Lord, I'm going to choose to glory in this tribulation. The hard subjects, the wrong answers, the long days — I will see them as builders. Work patience in me, and from patience let experience rise, and from experience let hope emerge. Make me someone who is better because of this hard season. Amen.",
    armorWord: ARMOR[3],
    enemyLie: {
      lie: "Struggling this much means I'm not cut out for this.",
      truth: "Count it all joy when ye fall into divers temptations; knowing this, that the trying of your faith worketh patience.",
      reference: "James 1:2-3",
    },
    communion: {
      gratitude: "The resilience that struggle is building in me",
      release: "The narrative that difficulty means failure",
      ask: "Joy in the process, not just the outcome",
    },
  },
  {
    date: "2026-07-07",
    day: 23,
    dailyBread: {
      scripture: "There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able; but will with the temptation also make a way to escape, that ye may be able to bear it.",
      reference: "1 Corinthians 10:13",
      reflection: "God calibrates what you face. The exam is not beyond what you are able to bear with Him. The question that stumps you is also the question He has equipped you to engage. There is always a way through.",
    },
    prayer: "Father, I trust Your calibration. You know exactly what I can bear, and You have made a way for me to bear it. When the questions feel impossibly hard on exam day, remind me that You have already accounted for it. There is a way through. I will find it with You. In Jesus' name, amen.",
    armorWord: ARMOR[4],
    enemyLie: {
      lie: "The exam is designed to break people like me.",
      truth: "God is faithful, who will not suffer you to be tempted above that ye are able.",
      reference: "1 Corinthians 10:13",
    },
    communion: {
      gratitude: "Ways God has provided an escape route in past hard seasons",
      release: "The belief that some questions are designed for me to fail",
      ask: "Clarity to find the way through on every hard question",
    },
  },
  // ── WEEK 4: Courage — "Fear not" ─────────────────────────────────────────
  {
    date: "2026-07-08",
    day: 24,
    dailyBread: {
      scripture: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.",
      reference: "Psalm 91:1",
      reflection: "The secret place is your time with God — prayer, the Word, stillness. Those who make that habitual find that they are sheltered in ways they cannot fully explain. Dwell there first, then go to the study table.",
    },
    prayer: "Lord, I want to dwell in Your secret place today before I open any book. Let me come to You first. Let me sit under Your shadow before I sit under any pressure. From that shelter, I will study better, think more clearly, and rest more fully. Amen.",
    armorWord: ARMOR[5],
    enemyLie: {
      lie: "I don't have time for prayer and Bible time during bar prep.",
      truth: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
      reference: "Matthew 6:33",
    },
    communion: {
      gratitude: "The shelter of God's presence, available to me at any moment",
      release: "The lie that spiritual time competes with study time",
      ask: "To dwell in the secret place before going to the study table",
    },
  },
  {
    date: "2026-07-09",
    day: 25,
    dailyBread: {
      scripture: "Commit thy works unto the LORD, and thy thoughts shall be established.",
      reference: "Proverbs 16:3",
      reflection: "Commit — not just pray and move on, but genuinely place the works of the day in His hands. When you do, your thoughts settle. The scatteredness that plagues busy bar takers yields to an established mind.",
    },
    prayer: "Lord, I commit today's work to You right now. Every question block, every outline review, every break, every meal — it is all Yours. I do not hold it tightly. Establish my thoughts. Let the scattered, racing mind settle into the order that comes from surrender to You. Amen.",
    armorWord: ARMOR[0],
    enemyLie: {
      lie: "My thoughts are too scattered to study effectively today.",
      truth: "Commit thy works unto the LORD, and thy thoughts shall be established.",
      reference: "Proverbs 16:3",
    },
    communion: {
      gratitude: "A day when my study felt truly focused",
      release: "The mental chaos that comes from holding everything too tightly",
      ask: "Established thoughts and a committed study day",
    },
  },
  {
    date: "2026-07-10",
    day: 26,
    dailyBread: {
      scripture: "When thou passest through the waters, I will be with thee; and through the rivers, they shall not overflow thee: when thou walkest through the fire, thou shalt not be burned; neither shall the flame kindle upon thee.",
      reference: "Isaiah 43:2",
      reflection: "Water. Rivers. Fire. God does not promise you will avoid them — He promises they will not overcome you. The exam room is a fire. You will not be consumed.",
    },
    prayer: "God, the fire is getting hotter as exam day approaches. The pressure feels like it could overwhelm me. But You said the rivers shall not overflow me, and the flames shall not kindle upon me. I believe You. Walk through this with me. Keep me unburned. In Jesus' name, amen.",
    armorWord: ARMOR[1],
    enemyLie: {
      lie: "The pressure of this exam is going to destroy me.",
      truth: "When thou walkest through the fire, thou shalt not be burned; neither shall the flame kindle upon thee.",
      reference: "Isaiah 43:2",
    },
    communion: {
      gratitude: "Waters and fires in my past that God brought me through",
      release: "The fear that this pressure is too much",
      ask: "His presence in the middle of the heat",
    },
  },
  {
    date: "2026-07-11",
    day: 27,
    dailyBread: {
      scripture: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
      reference: "Philippians 4:6",
      reflection: "Careful means anxious — be anxious for nothing. The remedy is not willpower but prayer. Turn every anxious thought into a prayer. Turn every fear into a supplication. This is practical theology, and it works.",
    },
    prayer: "Lord, I am bringing everything to You right now. The topic that I still don't understand. The fear about timing. The dread of a hard first question. Each one — I lay it at Your feet in prayer, and I thank You for hearing it. You know what I need before I ask. I am asking anyway. Amen.",
    armorWord: ARMOR[2],
    enemyLie: {
      lie: "My anxiety is just part of the bar exam process. Everyone feels this way.",
      truth: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
      reference: "Philippians 4:6",
    },
    communion: {
      gratitude: "The open channel of prayer available to me at any moment",
      release: "Every specific anxiety I've been carrying instead of praying",
      ask: "To make every anxious thought a prayer before it becomes a spiral",
    },
  },
  {
    date: "2026-07-12",
    day: 28,
    dailyBread: {
      scripture: "Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD.",
      reference: "Psalm 31:24",
      reflection: "Hope in the LORD is the condition. Courage is the action. Strength in the heart is the result. If you are hoping in Him — truly, not nominally — then courage and strength are already on their way.",
    },
    prayer: "Lord, I hope in You. Not in my score, not in my prep course, not in my memory — in You. From that hope, let courage rise. Strengthen my heart for the final stretch ahead. I am going to need it, and I believe You will provide it. Amen.",
    armorWord: ARMOR[3],
    enemyLie: {
      lie: "I don't feel courageous. Maybe I'm not cut out for this.",
      truth: "Be of good courage, and he shall strengthen your heart, all ye that hope in the LORD.",
      reference: "Psalm 31:24",
    },
    communion: {
      gratitude: "Four weeks of preparation that God has sustained",
      release: "The feeling that courage is a personality trait I wasn't born with",
      ask: "Strength in my heart for the final stretch",
    },
  },
  {
    date: "2026-07-13",
    day: 29,
    dailyBread: {
      scripture: "Blessed are the pure in heart: for they shall see God.",
      reference: "Matthew 5:8",
      reflection: "Purity of heart in bar prep means doing the work for the right reason — not to prove yourself, not to spite your doubters, but to honor the calling on your life. The pure-hearted student sees clearly, because their motive doesn't cloud their judgment.",
    },
    prayer: "Lord, purify my motives. Let me study to serve — not just to survive. Let the reason I want to be a lawyer be front and center again today. Remind me of the people I will help, the justice I will pursue, the calling You placed on my life. Let that vision pull me forward today. Amen.",
    armorWord: ARMOR[4],
    enemyLie: {
      lie: "I just want this to be over.",
      truth: "He which hath begun a good work in you will perform it until the day of Jesus Christ.",
      reference: "Philippians 1:6",
    },
    communion: {
      gratitude: "The original calling that set me on this path",
      release: "The desire to just escape rather than complete the work well",
      ask: "Renewed clarity about why I am doing this",
    },
  },
  {
    date: "2026-07-14",
    day: 30,
    dailyBread: {
      scripture: "Now faith is the substance of things hoped for, the evidence of things not seen.",
      reference: "Hebrews 11:1",
      reflection: "You cannot see July 30 from here. You cannot see the score. But faith acts as though the hoped-for thing already has substance. Study today with faith that the outcome has already been decided by a good God.",
    },
    prayer: "Lord, I activate my faith today. I believe I am going to pass. I believe You have prepared me for this. I can't see it yet, but faith is the evidence of things not seen. I act on it. I study with the certainty of the person who finishes well. In Jesus' name, amen.",
    armorWord: ARMOR[5],
    enemyLie: {
      lie: "Believing I'll pass is arrogant. I shouldn't assume.",
      truth: "Now faith is the substance of things hoped for, the evidence of things not seen.",
      reference: "Hebrews 11:1",
    },
    communion: {
      gratitude: "Faith that has already been given to me as a gift",
      release: "False humility that looks like faith but is actually fear",
      ask: "Activated faith that acts as though God's promises are already true",
    },
  },
  // ── WEEK 5: Sharpening — "The test reveals the heart" ────────────────────
  {
    date: "2026-07-15",
    day: 31,
    dailyBread: {
      scripture: "Nay, in all these things we are more than conquerors through him that loved us.",
      reference: "Romans 8:37",
      reflection: "'More than conquerors' — not barely victorious, not surviving, but decisively overcoming through the One who loved you. This is your identity, not your aspiration.",
    },
    prayer: "Jesus, I receive this identity: more than a conqueror through You. Not because of my score or my effort alone, but because of Your love. Let that truth sit in my chest today like an anchor. I am not fighting toward victory — I am fighting from it. Amen.",
    armorWord: ARMOR[0],
    enemyLie: {
      lie: "The bar exam has beat me before. It will beat me again.",
      truth: "Nay, in all these things we are more than conquerors through him that loved us.",
      reference: "Romans 8:37",
    },
    communion: {
      gratitude: "The love of Christ that makes me more than a conqueror",
      release: "The identity of someone who loses",
      ask: "To live and study from victory, not toward it",
    },
  },
  {
    date: "2026-07-16",
    day: 32,
    dailyBread: {
      scripture: "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness.",
      reference: "2 Corinthians 12:9",
      reflection: "Paul begged God to remove the thing that made him feel weak. God refused. Instead: my grace is sufficient. The weakness is the context in which grace is perfected. You need not be strong before God can work.",
    },
    prayer: "Lord, I confess I feel weak right now. I am tired and the material is enormous. But Your grace is sufficient. Your strength is perfect in this weakness. I stop trying to hide the weakness from You — You see it already and Your answer is grace. Let that be enough. Amen.",
    armorWord: ARMOR[1],
    enemyLie: {
      lie: "I need to be stronger than I am to pass this exam.",
      truth: "My grace is sufficient for thee: for my strength is made perfect in weakness.",
      reference: "2 Corinthians 12:9",
    },
    communion: {
      gratitude: "Moments when God's strength carried me past my own limit",
      release: "The shame of feeling weak at this point in the process",
      ask: "Grace sufficient for this specific day's challenges",
    },
  },
  {
    date: "2026-07-17",
    day: 33,
    dailyBread: {
      scripture: "In the day when I cried thou answeredst me, and strengthenedst me with strength in my soul.",
      reference: "Psalm 138:3",
      reflection: "The strength God gives when you cry out to Him is not always outward — it is often a strengthening deep in the soul. Interior steadiness that produces exterior calm. Let Him strengthen your soul today.",
    },
    prayer: "Lord, I cry out to You today. Strengthen me — not just my memory or my stamina, but my soul. Let there be deep interior strength that holds me steady when the surface feels shaky. Answer me as You answered David. Amen.",
    armorWord: ARMOR[2],
    enemyLie: {
      lie: "God isn't answering. I've prayed and nothing is changing.",
      truth: "In the day when I cried thou answeredst me, and strengthenedst me with strength in my soul.",
      reference: "Psalm 138:3",
    },
    communion: {
      gratitude: "A specific time when God strengthened my soul at a low moment",
      release: "Disappointment that God's help doesn't look like I expected",
      ask: "Strength in my soul — deep, interior, lasting",
    },
  },
  {
    date: "2026-07-18",
    day: 34,
    dailyBread: {
      scripture: "For the vision is yet for an appointed time, but at the end it shall speak, and not lie: though it tarry, wait for it; because it will surely come, it will not tarry.",
      reference: "Habakkuk 2:3",
      reflection: "Your vision of becoming a lawyer — of passing this bar — has an appointed time. It is not late; it is on schedule with the One who wrote the schedule. Wait for it. It will surely come.",
    },
    prayer: "Father, the vision is still for an appointed time. I will wait for it with work and with trust. You have not forgotten what You started in me. The dream of being an attorney who serves people, who knows the law, who uses it for good — that vision is real, and its appointed time is coming. I wait for it. Amen.",
    armorWord: ARMOR[3],
    enemyLie: {
      lie: "Maybe this just isn't going to happen for me.",
      truth: "The vision is yet for an appointed time... it will surely come, it will not tarry.",
      reference: "Habakkuk 2:3",
    },
    communion: {
      gratitude: "The vision God placed in me for a life in the law",
      release: "Doubt that the vision has already passed",
      ask: "Patient confidence that the appointed time is coming",
    },
  },
  {
    date: "2026-07-19",
    day: 35,
    dailyBread: {
      scripture: "Finally, my brethren, be strong in the Lord, and in the power of his might.",
      reference: "Ephesians 6:10",
      reflection: "Paul's 'finally' opens the armor passage — this is the summary before the details. Be strong. Not in your resume, not in your prep company, not in your note-taking system. In the Lord. In the power of His might.",
    },
    prayer: "Lord, I suit up in Your strength today, not my own. I am done pretending I can carry this alone. Your might, Your power, Your armor. I put it all on right now and I step into this day. In Jesus' name, amen.",
    armorWord: ARMOR[4],
    enemyLie: {
      lie: "I need to be the one who does this. I can't lean on God for a bar exam.",
      truth: "Finally, my brethren, be strong in the Lord, and in the power of his might.",
      reference: "Ephesians 6:10",
    },
    communion: {
      gratitude: "The armor God has provided for exactly this season",
      release: "The pride of wanting to pass this 'by myself'",
      ask: "His might to flow through my preparation today",
    },
  },
  {
    date: "2026-07-20",
    day: 36,
    dailyBread: {
      scripture: "No weapon that is formed against thee shall prosper; and every tongue that shall rise against thee in judgment thou shalt condemn.",
      reference: "Isaiah 54:17",
      reflection: "No weapon formed against you shall prosper — not the hard question, not the tricky fact pattern, not the examiners who wrote the test. What is formed against you has a limit. What is formed for you has none.",
    },
    prayer: "Lord, I declare over this exam: no weapon formed against me shall prosper. Not the difficult essay, not the confusing multiple choice, not the time pressure, not the fear. None of it shall prosper against what You have built in me. I go into this with that confidence. Amen.",
    armorWord: ARMOR[5],
    enemyLie: {
      lie: "The exam is stacked against me.",
      truth: "No weapon that is formed against thee shall prosper.",
      reference: "Isaiah 54:17",
    },
    communion: {
      gratitude: "Evidence of God's protection in my preparation this week",
      release: "The victim mentality about the exam and the examiners",
      ask: "Confidence that nothing formed against me shall prosper",
    },
  },
  // ── WEEK 6: Final Push — "More than conquerors" ───────────────────────────
  {
    date: "2026-07-21",
    day: 37,
    dailyBread: {
      scripture: "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.",
      reference: "Proverbs 4:7",
      reflection: "Wisdom on the bar exam is the ability to apply a rule to a fact pattern correctly. Understanding is knowing why the rule is the rule. Don't just get the right answer — get understanding. That survives the hardest questions.",
    },
    prayer: "Lord, give me wisdom and understanding — not just memorized rules. Let me understand the why behind every doctrine, every rule, every exception. That deep understanding is what will hold under pressure. Teach me to think, not just to recall. Amen.",
    armorWord: ARMOR[0],
    enemyLie: {
      lie: "I just need to memorize more. Understanding takes too long.",
      truth: "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.",
      reference: "Proverbs 4:7",
    },
    communion: {
      gratitude: "A rule or concept I truly understand now, not just memorized",
      release: "Cramming without understanding",
      ask: "Deep understanding that will hold under exam pressure",
    },
  },
  {
    date: "2026-07-22",
    day: 38,
    dailyBread: {
      scripture: "I sought the LORD, and he heard me, and delivered me from all my fears.",
      reference: "Psalm 34:4",
      reflection: "Not one fear, not some fears — all my fears. The Lord's reach extends to every specific fear in your list. Seek Him for them, one by one if necessary, and He will deliver you from each.",
    },
    prayer: "Lord, I seek You right now. And I bring every fear with me. Fear of the first question. Fear of going blank. Fear of getting the bar exam results back. Fear of disappointing people. Fear of my own doubt. Deliver me from all of them. Every single one. Amen.",
    armorWord: ARMOR[1],
    enemyLie: {
      lie: "Some fears are just too rational to release.",
      truth: "I sought the LORD, and he heard me, and delivered me from all my fears.",
      reference: "Psalm 34:4",
    },
    communion: {
      gratitude: "Fears God has already delivered me from in this process",
      release: "Every fear on my list — one by one, named and released",
      ask: "Deliverance from the one fear I haven't voiced yet",
    },
  },
  {
    date: "2026-07-23",
    day: 39,
    dailyBread: {
      scripture: "I have fought a good fight, I have finished my course, I have kept the faith.",
      reference: "2 Timothy 4:7",
      reflection: "Paul wrote this at the end of his life. You are near the end of this season. You have fought. You have not quit. The finishing is almost here. You have kept the faith — that is the most important thing.",
    },
    prayer: "Lord, I am near the finish line of this preparation season. I have fought — not perfectly, but faithfully. I have kept the faith. Let me finish the course that is set before me. These last days of preparation — let them be my best. In Jesus' name, amen.",
    armorWord: ARMOR[2],
    enemyLie: {
      lie: "I don't have enough left to finish strong.",
      truth: "He which hath begun a good work in you will perform it until the day of Jesus Christ.",
      reference: "Philippians 1:6",
    },
    communion: {
      gratitude: "The course I have run faithfully even when it was hard",
      release: "The temptation to coast in these final days",
      ask: "The strength to finish as strongly as I started",
    },
  },
  {
    date: "2026-07-24",
    day: 40,
    dailyBread: {
      scripture: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",
      reference: "Micah 6:8",
      reflection: "Forty days in. The bar exam trains you in justice — in applying the law correctly. But Micah reminds you why: do justly. Love mercy. Walk humbly. The law is the instrument; justice is the goal; the walk with God is the foundation.",
    },
    prayer: "God, keep me connected to why. I want to pass this exam to do justly — to represent people, to argue for what is right, to use the law for good. Keep that purpose alive in me through these last days. Let me finish not just trained, but transformed. Amen.",
    armorWord: ARMOR[3],
    enemyLie: {
      lie: "Passing is the only goal. The 'why' doesn't matter right now.",
      truth: "He hath shewed thee, O man, what is good... to do justly, and to love mercy, and to walk humbly with thy God.",
      reference: "Micah 6:8",
    },
    communion: {
      gratitude: "Day 40 — forty days of faithfulness",
      release: "The reduction of this calling to merely passing a test",
      ask: "That justice, mercy, and humility would be the fruit of this season",
    },
  },
  {
    date: "2026-07-25",
    day: 41,
    dailyBread: {
      scripture: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
      reference: "John 14:27",
      reflection: "The night before His hardest day, Jesus gave His disciples peace. He did not give them a guarantee of easy circumstances. He gave them Himself — His peace, not the world's version. You can have this in the exam room.",
    },
    prayer: "Jesus, I receive the peace You left for me. Not the world's peace — not the false calm that comes from feeling prepared enough. Your peace. The kind that holds even when everything is uncertain. Let not my heart be troubled. Let it not be afraid. I accept this gift. Amen.",
    armorWord: ARMOR[4],
    enemyLie: {
      lie: "I'll feel peace when I'm actually ready. Not before.",
      truth: "Peace I leave with you, my peace I give unto you.",
      reference: "John 14:27",
    },
    communion: {
      gratitude: "Three days left to prepare — still enough",
      release: "The idol of 'feeling ready' as a prerequisite for peace",
      ask: "Christ's specific peace in the exam room",
    },
  },
  {
    date: "2026-07-26",
    day: 42,
    dailyBread: {
      scripture: "I have set the LORD always before me: because he is at my right hand, I shall not be moved.",
      reference: "Psalm 16:8",
      reflection: "Set the LORD before you — intentionally, daily, before anything else. The psalmist who did this said: I shall not be moved. Not I won't be shaken. Not I won't struggle. I shall not be moved from the thing that matters most.",
    },
    prayer: "Lord, I set You before me today, two days before the exam. You are at my right hand. I am reviewing final material from that position — standing next to the One who holds all knowledge. Let nothing move me from what I know and from who I know. In Jesus' name, amen.",
    armorWord: ARMOR[5],
    enemyLie: {
      lie: "Two days out, I need to be reviewing, not praying.",
      truth: "Seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
      reference: "Matthew 6:33",
    },
    communion: {
      gratitude: "Six weeks of faithful preparation coming to completion",
      release: "The frantic energy of final-days panic",
      ask: "Settled confidence as I do my final review",
    },
  },
  // ── FINAL DAYS: Victory — "It is finished" ────────────────────────────────
  {
    date: "2026-07-27",
    day: 43,
    label: "EVE OF EXAM",
    dailyBread: {
      scripture: "What shall we then say to these things? If God be for us, who can be against us?",
      reference: "Romans 8:31",
      reflection: "Tomorrow begins. God is for you. The examiners are not your enemy — they are a test. The questions are not your enemy — they are opportunities to show what you know. The only real question is: who is for you? God is.",
    },
    prayer: "Lord, the exam starts tomorrow. I have done the work. I have studied, prayed, prepared. I rest in Your hands tonight. If You are for me — and You are — then nothing that comes tomorrow is stronger than the One standing with me. I go to sleep trusting You with the outcome. In Jesus' name, amen.",
    armorWord: ARMOR[0],
    enemyLie: {
      lie: "I should study all night tonight.",
      truth: "He gives sleep to his beloved.",
      reference: "Psalm 127:2",
    },
    communion: {
      gratitude: "Forty-three days of preparation that God sustained",
      release: "The outcome — fully, tonight, into God's hands",
      ask: "Restful sleep tonight and a clear, sharp mind tomorrow",
    },
  },
  {
    date: "2026-07-28",
    day: 44,
    label: "EXAM DAY 1",
    dailyBread: {
      scripture: "He giveth power to the faint; and to them that have no might he increaseth strength.",
      reference: "Isaiah 40:29",
      reflection: "Today is Day 1. God gives power to the faint. If you walk into that exam room feeling small, you are exactly the candidate God strengthens. He is your supply today. Draw on Him between every question block.",
    },
    prayer: "Father, I am walking into the exam room today. I am Yours. Every rule I have studied, every drill I have done, every prayer I have prayed — it is all in Your hands. Give me power when I am faint. Increase my strength when I have no more. Let Christ be my wisdom and my righteousness today. I will do my best and leave the rest with You. Amen.",
    armorWord: ARMOR[1],
    enemyLie: {
      lie: "I need to be at 100% going in, or I won't make it.",
      truth: "He giveth power to the faint; and to them that have no might he increaseth strength.",
      reference: "Isaiah 40:29",
    },
    communion: {
      gratitude: "The fact that today is finally here",
      release: "Every 'what if' that doesn't serve me in the room",
      ask: "Power, clarity, and strength from God for every session today",
    },
  },
  {
    date: "2026-07-29",
    day: 45,
    label: "EXAM DAY 2",
    dailyBread: {
      scripture: "Being confident of this very thing, that he which hath begun a good work in you will perform it until the day of Jesus Christ.",
      reference: "Philippians 1:6",
      reflection: "Day 2. God began this work in you. He has been performing it through forty-five days of study, prayer, preparation, and trust. He finishes what He starts. Go finish what He started in you.",
    },
    prayer: "Lord Jesus, I have arrived at Day 2 of the bar exam. You have been with me through every day of this journey. You began this work; You will bring it to completion. Today, let me be a vessel of Your wisdom and Your peace. I go into this room not alone but carried. Thank You for every day of this walk. It is Yours. Amen.",
    armorWord: ARMOR[2],
    enemyLie: {
      lie: "If Day 1 didn't go perfectly, Day 2 is over.",
      truth: "The mercy of the LORD is from everlasting to everlasting upon them that fear him.",
      reference: "Psalm 103:17",
    },
    communion: {
      gratitude: "Every one of the forty-five days God walked with me",
      release: "Day 1 — whatever happened, it is behind me",
      ask: "Completion — finishing the course God marked out for me",
    },
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

export function getEntryForDate(dateStr: string): WalkEntry | null {
  return WALK_DATA.find((e) => e.date === dateStr) ?? null;
}

export function getTodayEntry(): WalkEntry | null {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return getEntryForDate(dateStr);
}

export function getAdjacentDates(dateStr: string): { prev: string | null; next: string | null } {
  const idx = WALK_DATA.findIndex((e) => e.date === dateStr);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? WALK_DATA[idx - 1].date : null,
    next: idx < WALK_DATA.length - 1 ? WALK_DATA[idx + 1].date : null,
  };
}

export const EXAM_DATE = "2026-07-28"; // Day 1
export const EXAM_DATE_2 = "2026-07-29"; // Day 2
export const WALK_START = "2026-06-15";
export const WALK_END = "2026-07-29";
