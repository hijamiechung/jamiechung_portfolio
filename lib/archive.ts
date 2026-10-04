// Earlier CMU coursework and personal explorations, migrated in from
// jamiechung.framer.website. Text is transcribed from those pages (trimmed of
// scraping artifacts), not invented; images are downloaded from the same source.
// Some pieces embed a Vimeo video on the original page; those Vimeo videos are
// restricted to play only when embedded on jamiechung.framer.website (both
// direct download and cross-domain iframe embed return 401), so they're linked
// out to vimeo.com as a thumbnail card instead of embedded inline. To embed them
// directly here instead, add this site's domain to each video's allowed embed
// domains in Vimeo's privacy settings.
export type ArchiveEntry = {
  id: string; title: string; tag: string; year: string; blurb: string; lede: string;
  meta: { k: string; v: string }[];
  hero: { src: string; alt: string };
  sections: { label: string; heading: string; body: string[]; images?: { src: string; alt: string }[]; video?: { thumbnail: string; alt: string; href: string; title: string; duration: string } }[];
  externalLink?: { label: string; href: string };
};

export const archive: ArchiveEntry[] = [
  {
    id: 'definition-of-design', title: 'Definition of Design', tag: 'Physical Computing · Interaction Design', year: '2025',
    blurb: 'A physical computing experiment framing design as a joint that enables connection and expansion.',
    lede: 'Design as a joint that enables connection and expansion.',
    meta: [
      { k: 'Role', v: 'Sole Product Designer / UX Consulting (project-based)' },
      { k: 'Timeline', v: '2025.11 – 2025.12 (2 weeks)' },
      { k: 'Responsibilities', v: 'Concept framing, prototyping, generative visual design' },
      { k: 'Tools', v: 'Arduino, p5.js' },
    ],
    hero: { src: '/images/archive/definition-of-design/hero.png', alt: 'Hexagonal modules lighting up as they connect' },
    sections: [
      { label: 'Background', heading: 'What does it mean to engage in design?', body: [
        'This project was created as the final assignment for MA Design Principles & Practices at Carnegie Mellon University in Fall 2025.',
        'The assignment asked students to articulate their answer to the questions: What is design? What does it mean to be a designer? What does it mean to engage in design?',
        'I explored these questions through a physical computing experiment combining conceptual framing, Arduino-based sensing, and p5.js visualization.',
      ] },
      { label: 'Development', heading: 'A hexagon that changes meaning on contact', body: [
        'I approached design not as an isolated outcome, but as a fundamental structure and a joint that enables connection. The physical structure makes connection tangible, while the screen-based interaction visualizes the invisible consequences that emerge from those connections. Together, they frame design as a living system — one that gains meaning, complexity, and influence as it intersects with other elements.',
        'The hexagon allows continuous, multi-directional expansion. Each hexagon can stand alone, but its meaning changes as soon as another connects to it. In this project, each hexagon can represent a person, a method, a discipline, or a context. Design exists in the relationship between them.',
      ], images: [
        { src: '/images/archive/definition-of-design/concept-1.png', alt: 'Diagram of the hexagon-as-joint concept' },
        { src: '/images/archive/definition-of-design/concept-2.png', alt: 'Diagram of hexagons connecting and expanding' },
      ] },
      { label: 'Formboard', heading: 'Formboard hexagon ground & modules', body: [
        'The physical system visualizes design as a joint: hexagonal modules detect contact through copper wiring, and each new connection alters the color of the central light, signaling how design responds and evolves as new elements enter the system.',
      ], images: [
        { src: '/images/archive/definition-of-design/formboard.jpg', alt: 'Foam-board hexagon ground and modules prototype' },
        { src: '/images/archive/definition-of-design/formboard-2.jpg', alt: 'Foam-board hexagon prototype, detail view' },
        { src: '/images/archive/definition-of-design/formboard-3.jpg', alt: 'Foam-board hexagon prototype, wiring detail' },
      ] },
      { label: 'Iteration', heading: 'How colors overlap as modules connect', body: [
        'To explore how colors overlap and interact as hexagonal modules connect, I experimented with multiple graphic styles in p5.js. Each iteration tested a different way of visualizing connection, through density, rhythm, and spatial behavior.',
        'As more hexagons join the system, its behavior gradually transforms: colors begin to blend, rhythms shift, and wave patterns grow more complex. These visual changes reflect how design expands when it engages with new people, perspectives, or domains — becoming richer not by replacement, but by accumulation and interaction.',
      ], images: [
        { src: '/images/archive/definition-of-design/iteration-1.png', alt: 'p5.js graphic iteration, style 1' },
        { src: '/images/archive/definition-of-design/iteration-2.png', alt: 'p5.js graphic iteration, style 2' },
        { src: '/images/archive/definition-of-design/iteration-3.png', alt: 'p5.js graphic iteration, style 3' },
        { src: '/images/archive/definition-of-design/p5-iteration.png', alt: 'p5.js graphic iteration, style 4' },
        { src: '/images/archive/definition-of-design/iteration-4.png', alt: 'p5.js graphic iteration, style 5' },
        { src: '/images/archive/definition-of-design/iteration-5.png', alt: 'p5.js graphic iteration, style 6' },
      ] },
      { label: 'Final design', heading: 'Each hexagon, its own color and style', body: [
        'Each of the hexagons has a different color and graphic style. As more hexagons connect, the system’s behavior changes: colors blend, rhythms shift, and waves become more complex — mirroring how design expands when it engages with new people, perspectives, or domains.',
      ], images: [
        { src: '/images/archive/definition-of-design/final-design.png', alt: 'Combined hexagon system with multiple connected modules' },
      ] },
      { label: 'Presentation', heading: 'Presentation day', body: [], images: [
        { src: '/images/archive/definition-of-design/presentation-1.jpg', alt: 'Presenting the project at Carnegie Mellon' },
        { src: '/images/archive/definition-of-design/presentation-2.jpg', alt: 'Presentation day, project on display' },
      ] },
      { label: 'Reflection', heading: 'Where a 3D print would have gone further', body: [
        'While the foam-board prototype effectively conveyed the concept, a further iteration using 3D printing could have elevated the physical detail and structural clarity. This reflection reinforced the value of material iteration beyond initial satisfaction.',
      ] },
    ],
  },
  {
    id: 'un-sustainable-development-goal-16', title: 'UN Sustainable Development Goal 16', tag: 'Video · Storytelling', year: '2025',
    blurb: 'A hand-drawn, voice-driven animation interpreting SDG 16 — Peace, Justice and Strong Institutions — through public access to information.',
    lede: 'Experimental animation exploring how access to information empowers individuals and institutions.',
    meta: [
      { k: 'Role', v: 'Sole Designer' },
      { k: 'Timeline', v: '2025.9 – 2025.10 (5 weeks)' },
      { k: 'Responsibilities', v: 'Storytelling, call to action' },
      { k: 'Tools', v: 'Procreate, After Effects' },
    ],
    hero: { src: '/images/archive/un-sustainable-development-goal-16/hero.png', alt: 'Still from the SDG 16 animation' },
    sections: [
      { label: 'Background', heading: 'A deliberately abstract goal', body: [
        'This project was created as the project 3 assignment for MA Studio I at Carnegie Mellon University in Fall 2025: develop a short video that interprets one given UN Sustainable Development Goal — Peace, Justice and Strong Institutions.',
      ] },
      { label: 'Development', heading: 'Research-first, then hand-drawn', body: [
        'I took this project to deliberately confront a relatively abstract Sustainable Development Goal and to practice research-led design rather than rushing to visuals. After a previous studio project (a poster series) where shallow research followed by premature visual execution produced thin concepts, I used this brief to test a research-first workflow — exploring how a focused subtopic of SDG 16, specifically public access to information, could be embodied through concise, voice-driven animation.',
        'I kept visuals open for interpretation rather than fixing them early into literal symbols through several storyboard iterations.',
      ], images: [{ src: '/images/archive/un-sustainable-development-goal-16/storyboard.png', alt: 'Storyboard iteration for the SDG 16 animation' }] },
      { label: 'Animatic', heading: 'From After Effects to hand-drawn', body: [
        'I shifted from a planned After Effects approach to hand-drawn frame-by-frame animation, to put a more humanized characteristic into the piece.',
      ], video: { thumbnail: '/images/archive/un-sustainable-development-goal-16/video-sketch-thumb.jpg', alt: 'Animatic sketch video thumbnail', href: 'https://vimeo.com/1128322303', title: 'sketch', duration: '0:58' } },
      { label: 'Final design', heading: 'Five hundred hand-drawn frames', body: [
        'Directing a child narrator and producing over five hundred hand-drawn frames taught me practical lessons in voice direction, audio mixing, timing, spacing, and perspective. I also gained confidence in trusting a rough, human aesthetic as a legitimate design choice.',
      ], video: { thumbnail: '/images/archive/un-sustainable-development-goal-16/video-final-thumb.jpg', alt: 'Final SDG 16 animation video thumbnail', href: 'https://vimeo.com/1146483740', title: 'MA Studio I: UN Sustainable Development Goal Video', duration: '1:00' } },
      { label: 'Reflection', heading: 'What I would fix up front', body: [
        'If I did it differently, I would finalize the script and detailed directing notes before the first recording so pronunciation, breathing, and pacing are resolved up front. I would also define an audio plan during storyboarding to map where voice, music, and silence should sit, and fix technical specifications — canvas size, frame rate, file formats — at the start to avoid time-consuming redraws.',
        'Late conceptual pivots and unclear production specs drove much of the extra work on this project. To prevent that next time: run small animation prototypes to decide production method early, set realistic frame budgets and milestone checkpoints, prepare audio stems for final mixing, and produce a concise voice-direction packet for any narrator — preserving the rough, human quality that became the piece’s strength while improving efficiency and coherence.',
      ] },
    ],
    externalLink: { label: 'Read more on Medium', href: 'https://medium.com/@jamie_chung/ma-studio-i-project-3-diving-into-sdg-16-4134fe2707a0' },
  },
  {
    id: 'discoversing-pittsburgh', title: 'Discovering Pittsburgh', tag: 'Illustration', year: '2025',
    blurb: 'A 100-day illustration project: one piece a day for 100 consecutive days, documenting Pittsburgh culture through an international student’s eyes.',
    lede: 'Documenting the process of observing and understanding Pittsburgh from an outsider’s perspective.',
    meta: [
      { k: 'Role', v: 'Sole Designer' },
      { k: 'Timeline', v: '2025.9 – 2025.11 (9 weeks)' },
      { k: 'Responsibilities', v: 'Illustration' },
      { k: 'Tools', v: 'Procreate, Framer' },
    ],
    hero: { src: '/images/archive/discoversing-pittsburgh/hero.png', alt: 'Pittsburgh Everyday illustration series cover' },
    sections: [
      { label: 'Background', heading: '100 days, one illustration each', body: [
        'This project was created as the project 1 assignment for MA Studio I at Carnegie Mellon University in Fall 2025. I developed Pittsburgh Everyday, a 100-day illustration project: over the course of the semester I produced one illustrated piece per day for 100 consecutive days, focusing on local Pittsburgh culture and everyday objects, from the quirky "Pittsburgh potty" to the Cathedral of Learning and pierogi.',
      ] },
      { label: 'Development', heading: 'Learning a city from the inside', body: [
        'I used the assignment to learn Pittsburgh from the inside: as an international student I wanted to surface local quirks and translate them into visual stories that would be legible and interesting both to fellow internationals and to a broader audience.',
      ], images: [{ src: '/images/archive/discoversing-pittsburgh/illustration-1.png', alt: 'Daily illustration from the Pittsburgh Everyday series' }] },
      { label: 'Final design', heading: 'One hundred consecutive pieces', body: [], images: [{ src: '/images/archive/discoversing-pittsburgh/illustration-2.png', alt: 'Another daily illustration from the Pittsburgh Everyday series' }] },
      { label: 'Reflection', heading: 'Structure I’d add next time', body: [
        'I would keep the daily practice but add structure and early research to increase impact and reduce rework.',
        'Set a weekly theme and editorial plan: instead of purely reactive daily prompts, define weekly themes (architecture, food, rituals, transit, etc.) so individual pieces accumulate into a stronger narrative arc. Spend one focused hour on micro-research before each week — even shallow, early research prevents superficial visual choices and yields richer symbolism. And timebox finishing and iterating: finish daily sketches quickly, then reserve two weekly review sessions for refinement, to preserve momentum while still allowing craftsmanship to improve.',
      ] },
    ],
    externalLink: { label: 'Visit the full 100-day series', href: 'https://discoveringpittsburgh.framer.website/' },
  },
  {
    id: 'human-factors-in-the-mood-for-design', title: 'Human Factors: In the Mood for Design', tag: 'Video · Storytelling', year: '2025',
    blurb: 'A one-minute narrative video and companion poster using a late-night vending machine to explore physical, cognitive, and emotional human factors.',
    lede: 'A video-based exploration of physical, cognitive, and emotional human factors in everyday interaction.',
    meta: [
      { k: 'Role', v: 'Sole Designer' },
      { k: 'Timeline', v: '2025.10' },
      { k: 'Responsibilities', v: 'Storytelling' },
      { k: 'Tools', v: 'After Effects, Audition, Photoshop' },
    ],
    hero: { src: '/images/archive/human-factors-in-the-mood-for-design/hero.png', alt: 'Still from the vending machine video' },
    sections: [
      { label: 'Background', heading: 'A vending machine, late at night', body: [
        'This project was created as an individual midterm project for MA Principles & Practices at Carnegie Mellon University in Fall 2025. The assignment required a short video and a companion poster exploring physical, cognitive, and emotional human factors through a real-world example.',
        'I produced a one-minute narrative video and a conceptual poster, using the everyday interaction with a vending machine as the central case study. The work was filmed on campus, late at night.',
      ] },
      { label: 'Development', heading: 'Mood over explanation', body: [
        'The project was conducted to develop a holistic understanding of people in design, beyond usability or aesthetics alone. Rather than treating physical, cognitive, and emotional factors as isolated checklists, the goal was to explore how these factors coexist and accumulate in a single moment of interaction — how design becomes meaningful not through novelty, but through its alignment (or misalignment) with human bodies, mental models, and emotional states.',
        'I developed the poster first to articulate the detailed human-factors analysis, then translated that content into a short video through storytelling rather than explanation. Treating the video as a film teaser, I focused on mood and atmosphere, drawing visual inspiration from Chungking Express (Wong Kar-wai, 1994) to keep a consistent tone across both mediums.',
      ], images: [{ src: '/images/archive/human-factors-in-the-mood-for-design/poster.png', alt: 'Companion poster analyzing human factors of a vending machine' }] },
      { label: 'Final design', heading: 'Design as a condition, not a checklist', body: [
        'Through this project I came to understand design not only as a set of features, but as a condition shaped by human readiness — physical fatigue, cognitive expectation, emotional tension. Small decisions, like button placement, feedback timing, or retrieval height, can significantly influence trust, frustration, and satisfaction.',
        'I also learned how narrative and cinematic framing can work as analytical tools, surfacing human factors that a purely functional evaluation might overlook.',
      ], video: { thumbnail: '/images/archive/human-factors-in-the-mood-for-design/video-thumb.jpg', alt: 'Vending machine narrative video thumbnail', href: 'https://vimeo.com/1154558453', title: 'Jamie_Chung — Human Factors', duration: '1:04' } },
      { label: 'Reflection', heading: 'Whose body the design assumes', body: [
        'If I were to revisit this project, I would expand the analysis to a wider range of bodies and contexts — users of different heights, wheelchair users, people carrying items. Many physical design decisions turned out to rest on standardized anthropometric data centered on an average adult body; a future iteration could more explicitly examine who is excluded by those standards, and how emotional responses differ when physical access becomes strained.',
        'I would not change the narrative approach, though. The combination of video, script, and reflective poster proved effective at capturing the intimacy of human–design interaction, which aligned strongly with the project’s intent.',
      ] },
    ],
  },
  {
    id: 'interactive-flower', title: 'Interactive Flower', tag: 'Physical Computing · Interaction Design · Personal, Fun', year: '2025',
    blurb: 'A flower that physically reacts to ambient light, changing petal angle and core color to simulate blooming.',
    lede: 'A flower that physically reacts to light by changing petal position and core illumination.',
    meta: [
      { k: 'Role', v: 'Sole Product Designer' },
      { k: 'Timeline', v: '2025.11 (1 week)' },
      { k: 'Responsibilities', v: 'Interaction' },
      { k: 'Tools', v: 'Arduino' },
    ],
    hero: { src: '/images/archive/interactive-flower/hero.jpg', alt: 'Interactive flower object lit up on a desk' },
    sections: [
      { label: 'Background', heading: 'An object that responds to its environment', body: [
        'I started with the intention of creating an interactive object inspired by nature that responds to its surrounding environment. Based on the ambient light level, the angle of the petals and the color of the inner core of the flower change, creating the impression of a flower gradually blooming.',
      ], images: [{ src: '/images/archive/interactive-flower/detail.png', alt: 'Detail of the flower’s petal mechanism and core light' }] },
      { label: 'Demo', heading: 'Blooming in response to light', body: [],
        video: { thumbnail: '/images/archive/interactive-flower/video-thumb.jpg', alt: 'Interactive flower demo video thumbnail', href: 'https://vimeo.com/1154385413', title: 'Interactive Flower', duration: '0:12' } },
    ],
  },
];
