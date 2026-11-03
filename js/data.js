/*
  K Explore – demo event data.
  `days` is an offset from today, so the site always shows upcoming events
  no matter when it is opened. `taken` is how many seats were already booked
  before the visitor registers; registrations made in the browser are added on top.
  All events here are fictional.
*/
window.KX_EVENTS = [
  {
    id: 'open-mic-chai', title: 'Open Mic & Chai', cat: 'music', days: 3, time: '18:00',
    venue: 'Library Courtyard', host: 'Music Society', capacity: 80, taken: 52,
    blurb: 'Five minutes, one mic, zero judgement. Sing, rap, recite or just tell a story.',
    about: 'A relaxed evening for anyone who has ever hummed in the shower. Sign up on the spot, get five minutes on stage, and drink free chai while the crowd cheers you on. Acoustic only, so bring your own guitar if you play.',
    schedule: [['18:00', 'Chai and sign-ups'], ['18:30', 'First set'], ['20:00', 'Closing jam']]
  },
  {
    id: 'pixel-paper', title: 'Pixel & Paper', cat: 'workshop', days: 5, time: '14:00',
    venue: 'Design Studio 2', host: 'Design Club', capacity: 40, taken: 31,
    blurb: 'Sketch on paper, then turn it into a clickable UI in one afternoon.',
    about: 'A hands-on session that moves from pencil sketches to a working prototype. You will learn how to turn rough ideas into screens, test them with a classmate and leave with a portfolio piece. Laptops needed, no experience required.',
    schedule: [['14:00', 'Sketching sprint'], ['15:15', 'Build the prototype'], ['16:30', 'Show and critique']]
  },
  {
    id: 'prompt-lab', title: 'Prompt Lab', cat: 'workshop', days: 7, time: '11:00',
    venue: 'Computer Centre, Lab 3', host: 'AI Circle', capacity: 60, taken: 60,
    blurb: 'Build a small app on top of a language model API, start to finish.',
    about: 'Ship a working tool before lunch. We cover calling a model from code, structuring prompts, handling bad outputs and deploying the result. This one filled up fast, so check back for a second batch.',
    schedule: [['11:00', 'API basics'], ['12:00', 'Build session'], ['13:30', 'Demos']]
  },
  {
    id: 'hack-the-quad', title: 'Hack the Quad', cat: 'tech', days: 9, time: '09:00',
    venue: 'Innovation Lab Block', host: 'Coding Club', capacity: 200, taken: 164, featured: true,
    blurb: 'Twenty-four hours, teams of four, one problem statement revealed at kickoff.',
    about: 'The campus hackathon. Form a team of up to four, get the problem statement at kickoff and build something that works by the next morning. Mentors from industry will be around all night, and food is on us. Prizes for the top three teams and a special award for best use of open data.',
    schedule: [['09:00', 'Kickoff and problem reveal'], ['12:00', 'Hacking begins'], ['03:00', 'Midnight mentor round'], ['09:00', 'Final demos and results']]
  },
  {
    id: 'cup-finals', title: 'Inter-Hostel Cup Finals', cat: 'sports', days: 11, time: '16:30',
    venue: 'Main Stadium', host: 'Sports Council', capacity: 800, taken: 300,
    blurb: 'Two hostels, one trophy. Football finals under floodlights.',
    about: 'After six weeks of league matches, two hostels meet for the final. Bring your hostel colours and your loudest voice. Halftime has a penalty shootout open to the crowd.',
    schedule: [['16:30', 'Gates open'], ['17:30', 'Kickoff'], ['19:00', 'Trophy ceremony']]
  },
  {
    id: 'golden-hour', title: 'Photo Walk: Golden Hour', cat: 'workshop', days: 12, time: '16:00',
    venue: 'Botanical Garden', host: 'Photography Club', capacity: 30, taken: 12,
    blurb: 'Chase the last light with a mentor who shoots for magazines.',
    about: 'A guided walk timed to the best light of the day. You will pick up tips on framing, exposure and editing a photo on your phone or camera. Every kind of camera is welcome, including the one in your pocket.',
    schedule: [['16:00', 'Meet at the gate'], ['16:20', 'Guided walk'], ['17:45', 'Share your best shot']]
  },
  {
    id: 'decibel-night', title: 'Decibel Night', cat: 'music', days: 14, time: '19:00',
    venue: 'Central Lawn', host: 'Music Society', capacity: 600, taken: 412, featured: true,
    blurb: 'Eight student bands battle it out on the biggest stage of the year.',
    about: 'The open-air battle of the bands. Eight acts, twenty minutes each, and a crowd that decides the winner. The headline set closes the night. Food stalls open from 6 pm.',
    schedule: [['18:00', 'Food stalls open'], ['19:00', 'Opening act'], ['19:30', 'Band battle'], ['22:00', 'Headline set']]
  },
  {
    id: 'nukkad', title: 'Nukkad Street Play Fest', cat: 'culture', days: 16, time: '15:00',
    venue: 'Central Plaza', host: 'Dramatics Society', capacity: 250, taken: 90,
    blurb: 'Street theatre that stops you mid-walk. Ten teams, ten stories.',
    about: 'Teams perform short street plays on social themes, right in the middle of the plaza with the audience all around. No stage, no seats, just stories. Come and go as you like.',
    schedule: [['15:00', 'Round one'], ['16:30', 'Round two'], ['17:30', 'Audience vote']]
  },
  {
    id: 'robo-rumble', title: 'Robo Rumble', cat: 'tech', days: 18, time: '10:00',
    venue: 'Workshop Arena', host: 'Robotics Club', capacity: 120, taken: 74,
    blurb: 'Home-built robots fight in a cage. Watch metal fly.',
    about: 'Student-built combat robots go head to head in a bolted-down arena. Watch the 15 kg class battles live, then see the teams explain what broke and how they fixed it in the pit area.',
    schedule: [['10:00', 'Weigh-in'], ['11:00', 'Group rounds'], ['14:00', 'Knockouts'], ['16:00', 'Final']]
  },
  {
    id: 'rangotsav', title: 'Rangotsav', cat: 'culture', days: 21, time: '17:00',
    venue: 'Open-Air Amphitheatre', host: 'Cultural Committee', capacity: 500, taken: 230, featured: true,
    blurb: 'Folk dance, live painting and food from twelve states in one evening.',
    about: 'A celebration of regional culture. Dance troupes perform folk forms from across the country, artists paint a mural live while you watch, and food stalls serve dishes from twelve states.',
    schedule: [['17:00', 'Live mural begins'], ['18:00', 'Folk dance showcase'], ['20:00', 'Food and music']]
  },
  {
    id: 'pitch-night', title: 'Startup Pitch Night', cat: 'tech', days: 25, time: '17:30',
    venue: 'Main Auditorium', host: 'E-Cell', capacity: 300, taken: 120,
    blurb: 'Student founders pitch to real investors. Three minutes each.',
    about: 'Eight student teams pitch their startups to a panel of founders and investors. After each pitch the panel asks hard questions. Great for anyone curious about how an idea becomes a company.',
    schedule: [['17:30', 'Doors open'], ['18:00', 'Pitches'], ['20:00', 'Panel verdict and networking']]
  },
  {
    id: 'sunrise-10k', title: 'Sunrise 10K', cat: 'sports', days: 28, time: '05:30',
    venue: 'Campus Loop', host: 'Fitness Club', capacity: 400, taken: 210,
    blurb: 'Run, jog or walk the campus loop as the sun comes up.',
    about: 'A friendly 10K around the campus loop with a 5K option for beginners. Water stations every 2 km, a finisher medal for everyone and a hot breakfast at the end.',
    schedule: [['05:30', 'Warm-up'], ['06:00', 'Start'], ['08:00', 'Breakfast and medals']]
  }
];
