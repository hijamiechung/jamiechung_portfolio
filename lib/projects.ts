// Guidelight and Memorythread are real case-study content, checked against project source
// material (see portfolio material/Guidelight/ and portfolio material/Memorythread/,
// private).
export type Project = {
  id: string; title: string; tag: string; year: string; blurb: string; lede: string;
  meta: { k: string; v: string }[];
  sections: { label: string; heading: string; body: string }[];
};
// Live on the site. Guidelight is parked in draftProjects (hidden) — move it back here to republish.
export const projects: Project[] = [
      {
        id: 'mellon', title: 'Mellon', tag: 'Concept · Service + interaction design', year: '2026',
        blurb: 'An AI assistant in Gmail that turns school emails into action cards and shows the advisor what students ask.',
        lede: 'An exploratory service and interaction design project at Carnegie Mellon’s School of Design. Advisors send comprehensive emails. Students ask each other about them, and the advisor has little way to see what didn’t land.',
        meta: [
          { k: 'Role', v: 'Advisor dashboard, most of the visual design, project video; student home screen UX shared with team' },
          { k: 'Year', v: '2026' },
          { k: 'Team', v: '3 designers' },
          { k: 'Scope', v: 'System mapping, research, concept, UI, video' },
          { k: 'Status', v: 'Concept, not evaluated' }
        ],
        sections: [
          { label: 'Background', heading: 'Orientation runs on email', body: 'We started by mapping how information reaches incoming MDes and MA students during orientation, then used an iceberg model to separate what is visible (the emails themselves) from the patterns, structures, and mental models underneath. We interviewed three students and the graduate academic advisor, and surveyed eight students.' },
          { label: 'Problem', heading: 'The advisor can’t tell whether an email worked', body: 'The advisor’s emails are comprehensive, but they arrive in an inbox full of other things. As the advisor put it: “I’m never really sure if they understand my email responses.” Students told us they postpone questions because they hesitate to bother staff. So the person best placed to fix a confusing message gets little signal that it was confusing.' },
          { label: 'What we noticed', heading: 'Students ask each other, not the advisor', body: 'Students and senders judge importance differently. Email works as both the communication channel and the place information is stored. And peer support masks recurring confusion: six of the eight students surveyed asked classmates rather than contacting an advisor directly, so the advisor may not see where messages confuse.' },
          { label: 'What we proposed', heading: 'Keep email as the door, add a layer on top', body: 'Mellon keeps email as the entry point instead of adding another channel. For students, an updates panel sorts school information by urgency, and “Ask Mellon” answers questions in context with links back to the source message. When the assistant isn’t enough, it prepares an email draft so a human can take over. Cards show what needs action; chat is for questions about it. For the advisor, a dashboard groups questions by topic with 7-day and 30-day trends, stores reusable answers, and points to gaps in existing resources. I designed the advisor dashboard and most of the visual design, and made the project video. The student home screen UX we worked out together.' },
          { label: 'Outcome', heading: 'A hypothesis, not a result', body: 'We expect students to find information faster, see what needs action more clearly, and send the advisor fewer repeated questions. We haven’t tested any of this with students or the advisor, and the research behind it is three interviews and eight survey responses.' }
        ]
      },
      {
        id: 'squiggle', title: 'Squiggle', tag: 'Hackathon · AI tool', year: '2026',
        blurb: 'Connects scattered AI chats into one decision timeline, so designers keep track of what they decided and why.',
        lede: 'Designers think through ideas with AI. But after many chats, they lose track of what they decided and why. Squiggle connects those chats into one decision timeline.',
        meta: [
          { k: 'Role', v: 'Led product and interaction design' },
          { k: 'Year', v: 'Oct 2026' },
          { k: 'Team', v: '3 designers' },
          { k: 'Scope', v: '3 designer interviews, 10+ visualization concepts, usability tests with 7 participants' },
          { k: 'Context', v: 'Design Hackathon' }
        ],
        sections: [
          { label: 'Overview', heading: 'Coming soon', body: 'This case study is not written yet.' }
        ]
      },
      {
        id: 'memorythread', title: 'Memorythread', tag: 'Concept · AI + physical prototype', year: '2026',
        blurb: 'A solo project that turned an AI question generator into a physical object a grandmother assembles herself.',
        lede: 'A concept for helping a family member start memory conversations with an elder losing cognitive ground. It began as AI-generated questions. It ended as something you hold in your hands.',
        meta: [
          { k: 'Role', v: 'Product design, concept, research, full-stack build (V1)' },
          { k: 'Year', v: '2026' },
          { k: 'Team', v: 'Solo, with an outside expert interview' },
          { k: 'Scope', v: 'Research, concept, prototype' },
          { k: 'Status', v: 'V1 live demo, V2 unbuilt prototype' }
        ],
        sections: [
          { label: 'Background', heading: 'Memory is relational, systems want it structured', body: 'The idea started from tutoring a Korean-American student who spoke limited Korean. His mother, a first-generation immigrant, had lost her English to dementia and could now only communicate in Korean, leaving Korean as the one language they could still share. I was also watching my own grandmother’s memory fade the same way. Software wants one label per person, place, or event. A remembered life doesn’t work that way.' },
          { label: 'Problem', heading: 'She was answering, not leading', body: 'V1, built and shipped solo over two weeks in December 2025, worked like this: a family member uploads a photo, AI generates a question from it, and the elder answers by voice while keywords build a connection map over time. An interview with a healthcare product designer named the real problem. The elder was purely reactive in her own story, and the family member’s own screen-focused attention could interrupt the very conversation the tool was supposed to enable.' },
          { label: 'What I noticed', heading: 'Starting the conversation is the thing that matters', body: 'For someone losing cognitive ground, being the one who initiates, not just answers, changes what the exchange means. The lever wasn’t a smarter AI asking better questions. It was who gets to decide what today’s conversation is about.' },
          { label: 'What I changed', heading: 'A physical object she assembles herself', body: 'V2 introduced a tilted frame and three triangular tiles, Time, Person, Relationship, that the elder selects and arranges to start a topic. The AI and family member follow her lead instead of driving it. I fabricated the tiles as real objects. The camera-recognition step was demoed by hand, not by a working system.' },
          { label: 'Outcome', heading: 'Bigger than the original framing, still unresolved', body: 'Studio critique saw this extending past cognitive decline into a general family memory archive. Two questions are still open: why AI needs to be the one generating the questions at all, and why the interaction needs a second person in the loop. Both were raised, neither resolved. V1 is still live as a demo. It was never maintained as a product.' }
        ]
      }
];

export const draftProjects: Project[] = [
      {
        id: 'guidelight', title: 'Guidelight', tag: 'Concept · Mobile app', year: '2026',
        blurb: 'A mobile service that helps school staff connect students to community support, such as counseling and medical care, and track progress and next steps.',
        lede: 'A mobile concept built with Homewood Children’s Village, a Pittsburgh nonprofit that connects students to medical, social, and food-security services. Staff could refer a family for help. Nobody could say afterward whether it reached them.',
        meta: [
          { k: 'Role', v: 'Product design, UI, flow shared with team' },
          { k: 'Year', v: '2026' },
          { k: 'Team', v: '3 designers, 1 researcher' },
          { k: 'Scope', v: 'Research, flow, UI' },
          { k: 'Status', v: 'Prototype, not launched' }
        ],
        sections: [
          { label: 'Background', heading: 'A Thursday meeting runs the whole system', body: 'Every Thursday, the school’s principal, counselor, psychologist, and nurse sit down for an hour or two and go through every student who needs help that week. The site manager joins when a case needs an outside partner. She’s the one who actually knows which food pantry has room this month or which counselor is taking new clients, and when the room needs an answer, someone turns to her and asks who she’s got. The school’s one digital system, eSchool, holds attendance, grades, and color-coded custody and medical alerts. Referrals live nowhere in it. They live in her.' },
          { label: 'Problem', heading: 'No one has the authority to call and check', body: 'A referral goes out as a letter home, a phone call, sometimes a meeting scheduled at 8:30 in the morning because that’s when parents are already at the building dropping kids off. After that, the trail goes cold. The site manager can’t call a clinic to ask if a family showed up. That call has to come from the parent, voluntarily, and mostly it doesn’t come. In her own words, there’s no version of her job where she has the right to make that call herself.' },
          { label: 'What I noticed', heading: 'Which part of this was actually worth solving first?', body: 'The early instinct, on both sides, was to fix the fragmentation everywhere at once: one login, one shared record, one dashboard for the whole district. The client had already watched that kind of fix fail. A standardized referral form once existed for exactly this; some teachers used it for a week and went back to just calling. His read was that the whole ecosystem is a genuinely wicked problem that isn’t going to simplify, and the only part worth building first is the single moment where a student actually gets connected to a service, and someone finds out whether it worked.' },
          { label: 'What I changed', heading: 'A text message, not another login', body: 'Parents get a text instead of an app to download. It carries the appointment details already filled in, so the same message that says a child was referred for something can also drop straight into a calendar. Consent runs through that same thread instead of a separate form. Staff can start a case from a student’s name or from an open slot at a service, because in practice a referral gets triggered both ways. None of it required a login from the person it mattered most to.' },
          { label: 'Outcome', heading: 'Called the right piece to build, never tried on a real phone', body: 'The client’s own description of it was that this is the highest-leverage node in the whole system: get this one interaction right, and provider onboarding and better data follow on their own. He specifically called out the text-based consent flow and the two ways to start a case as the right things to have built. What never happened: an actual parent getting an actual text on an actual phone. The prototype ended with the semester, and whether that message would really get a reply from someone standing in a school hallway was never tested.' }
        ]
      },
      {
        id: 'mozu', title: 'Mozu', tag: 'Product · Marketing site', year: '2024',
        blurb: 'A two-week build with one engineer. Four components, reused everywhere. Restraint as budget before taste.',
        lede: 'A full marketing site in two weeks with one engineer. Everything visible is one of roughly four components, reused.',
        meta: [{ k: 'Role', v: 'Design, front-end' }, { k: 'Year', v: '2024' }, { k: 'Team', v: '1 eng' }, { k: 'Scope', v: 'Site, system' }],
        sections: [
          { label: 'Constraint', heading: 'Two weeks, one engineer', body: 'The deadline set the system. Anything that could not be built twice from the same component did not get designed.' },
          { label: 'Approach', heading: 'Four parts, many arrangements', body: 'A section header, a media block, a list row and a card. Variety came from arrangement and scale rather than new components.' },
          { label: 'Outcome', heading: 'Shipped on the date', body: 'Six pages, no bespoke layouts, no cleanup sprint after launch. The team still adds pages without a designer.' }
        ]
      },
      {
        id: 'bank', title: 'Bank', tag: 'Product · Under NDA', year: '2023',
        blurb: 'A states problem, not a screens problem: 41 error states across six layouts.',
        lede: 'Client work under NDA. What I can share is the shape of it: forty-one error states across six layouts, and a system for saying no clearly.',
        meta: [{ k: 'Role', v: 'Product design' }, { k: 'Year', v: '2023' }, { k: 'Team', v: 'Agency, 6' }, { k: 'Scope', v: 'States, copy' }],
        sections: [
          { label: 'Problem', heading: 'Failure was undesigned', body: 'Happy paths were specified in detail. Everything else fell back to one generic message, which meant the product could not tell a user what to do next.' },
          { label: 'Approach', heading: 'Catalogue, then compress', body: 'I inventoried every failure the API could produce, grouped them by the action a person could take, and reduced forty-one cases to six treatments with written copy for each.' },
          { label: 'Outcome', heading: 'Fewer calls, clearer refusals', body: 'Support volume on failed transfers fell. The copy rules outlived the visual design and were adopted by two adjacent teams.' }
        ]
      }
    ];
