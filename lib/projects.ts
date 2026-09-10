// Provisional copy from the canonical visual prototype; not verified case-study claims.
export type Project = {
  id: string; title: string; tag: string; year: string; blurb: string; lede: string;
  meta: { k: string; v: string }[];
  sections: { label: string; heading: string; body: string }[];
};
export const projects: Project[] = [
      {
        id: 'guidelight', title: 'Guidelight', tag: 'Product · Web app', year: '2026',
        blurb: 'Rebuilt onboarding for a permissions-heavy admin tool. Fewer decisions per screen, one clear path out.',
        lede: 'An onboarding audit that turned into a permissions model. The work was deciding which choices to take away from the user, then defending that in review.',
        meta: [{ k: 'Role', v: 'Product design, lead' }, { k: 'Year', v: '2026' }, { k: 'Team', v: '2 eng, 1 PM' }, { k: 'Scope', v: 'Flow, states, spec' }],
        sections: [
          { label: 'Problem', heading: 'Setup asked for everything at once', body: 'New workspaces landed on a nine-field form covering roles, scopes and billing before anyone had seen the product. Drop-off sat at the second step and support inherited the rest.' },
          { label: 'Approach', heading: 'One decision per screen', body: 'I wrote the sequence as sentences first, then cut every field that could be inferred or deferred. What remained became four screens, each answering a single question with a visible way back.' },
          { label: 'Outcome', heading: 'A model, not a flow', body: 'The result shipped as a permissions primitive the team reuses outside onboarding. Setup completion moved, but the durable value was one shared vocabulary for roles.' }
        ]
      },
      {
        id: 'memorythread', title: 'Memorythread', tag: 'Concept · iOS', year: '2025',
        blurb: 'A note tool built around review instead of capture. The timeline came first and set every other constraint.',
        lede: 'A longitudinal note tool designed backwards on purpose: the review experience came first, and capture had to fit what review needed.',
        meta: [{ k: 'Role', v: 'Concept, design' }, { k: 'Year', v: '2025' }, { k: 'Team', v: 'Solo' }, { k: 'Scope', v: 'Concept, prototype' }],
        sections: [
          { label: 'Premise', heading: 'Capture is easy, returning is not', body: 'Every note app optimises the moment of writing. Almost none design the moment six months later, which is the only moment that makes the archive worth keeping.' },
          { label: 'Approach', heading: 'Design the timeline, then the input', body: 'I built the review timeline as the first artefact. It demanded time, place and one relation per entry — so capture became three fields instead of a blank page.' },
          { label: 'Open', heading: 'Where it stands', body: 'Still a concept. The unresolved part is resurfacing: what earns an interruption, and what should stay quiet until asked for.' }
        ]
      },
      {
        id: 'mozu', title: 'Mozu', tag: 'Product · Marketing site', year: '2024',
        blurb: 'A two-week build with one engineer. Four components, reused everywhere — restraint as budget before taste.',
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
