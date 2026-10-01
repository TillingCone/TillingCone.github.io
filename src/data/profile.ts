/** Public details for Jerry's portfolio. Add new work here when it exists. */
export const GITHUB_USERNAME = 'TillingCone';

export type Project = {
  title: string;
  blurb: string;
  tags: string[];
  repo?: string;
  demo?: string;
};

export const profile = {
  name: 'Jerry',
  handle: 'j3rry',
  tagline: 'CS student learning by making things.',
  bio: [
    "Hey, I'm Jerry. I'm studying computer science and learning by making things.",
    "This is where I'll share my experiments and projects as I build them.",
  ],
  course: 'Computer science',
  currently: 'Building this website and exploring ideas for the next project.',
  projects: [
    {
      title: 'This website',
      blurb: 'A Game Boy inspired portfolio built with Astro, CSS, and TypeScript. The buttons and keyboard both work.',
      tags: ['Astro', 'CSS', 'TypeScript'],
      repo: `https://github.com/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io`,
      demo: `https://${GITHUB_USERNAME}.github.io`,
    },
  ] satisfies Project[],
  github: `https://github.com/${GITHUB_USERNAME}`,
};
