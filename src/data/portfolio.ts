export interface Project {
  slug: string
  name: string
  tagline: string
  description: string
  url?: string
  screenshot?: string
  status: 'live' | 'building' | 'on-hold'
  tags: string[]
  metrics: { label: string; value: string }[]
  story: {
    problem: string
    solution: string
    result: string
  }
}

export const PROJECTS: Project[] = [
  {
    slug: 'scdmv-alerts',
    name: 'SC DMV Alerts',
    tagline: 'Appointment alerts for SC DMV road tests — live in weeks.',
    description:
      'South Carolinians were stuck manually refreshing the DMV scheduler for hours. SC DMV Alerts monitors all 65 locations every 5 minutes and fires an email the moment a slot opens.',
    url: 'https://scdmvappointments.com',
    status: 'live',
    tags: ['Astro', 'Cloudflare Workers', 'D1', 'SendGrid', 'Stripe'],
    metrics: [
      { label: 'Locations monitored', value: '65' },
      { label: 'Check frequency', value: '5 min' },
      { label: 'Subscription tiers', value: '3' },
    ],
    story: {
      problem:
        'SC DMV road test slots disappear in seconds. There was no way to know when one opened without sitting on the scheduler page all day.',
      solution:
        "A Cloudflare Worker scrapes the SC DMV API every 5 minutes, compares results against subscriber preferences, and fires SendGrid alerts instantly when there's a match. Three pricing tiers (Free → $19.99/mo CDL Pro) cover different appointment types and alert frequencies.",
      result:
        'Concept-to-paid-subscribers in under three weeks. Automated pipeline runs 24/7 with zero manual intervention.',
    },
  },
  {
    slug: 'recordstops',
    name: 'RecordStops',
    tagline: 'The directory for independent record stores.',
    description:
      'Record collectors had no good way to find independent stores outside their city. RecordStops built the go-to directory — state by state, city by city — with store profiles, hours, and curated city guides.',
    url: 'https://recordstops.com',
    status: 'live',
    tags: ['Astro', 'Cloudflare D1', 'Tailwind', 'SEO'],
    metrics: [
      { label: 'Stores indexed', value: '296' },
      { label: 'States covered', value: '5' },
      { label: 'Organic visitors/mo', value: '683' },
    ],
    story: {
      problem:
        'Independent record stores are scattered and invisible online. Platforms like Google Maps surface chains over hidden gems.',
      solution:
        'A programmatic directory built on Astro + Cloudflare D1 with city-guide templates that target long-tail search queries. Each store gets its own SEO page; each city gets a curated guide.',
      result:
        '683 organic users/month across 16 active city guides — no ad spend, pure organic growth.',
    },
  },
  {
    slug: 'sendmylove',
    name: 'SendMyLove',
    tagline: 'Recurring love note delivery. Set it once, never forget.',
    description:
      'SendMyLove lets you schedule recurring love messages to the people who matter most. One subscription, personalized notes, delivered on your schedule — no florist markup required.',
    url: 'https://sendmylove.app',
    status: 'live',
    tags: ['SvelteKit', 'Stripe', 'Supabase', 'Consumer SaaS'],
    metrics: [
      { label: 'Messages delivered', value: '2,515' },
      { label: 'Subscription price', value: '$5/mo' },
      { label: 'Time to launch', value: '2 weeks' },
    ],
    story: {
      problem:
        "Relationships fade because people forget to show up consistently — not because they stop caring. Flowers once a year don't cut it.",
      solution:
        'Subscription model with a simple message composer, scheduling, and Stripe billing. Personalized delivery via email, with SMS queued once Twilio verification clears.',
      result:
        "2,515 messages sent since launch. Stripe payments working. Valentine's Day cohort grew the base organically.",
    },
  },
  {
    slug: 'deadrop',
    name: 'Deadrop',
    tagline: 'Self-hostable, brandable secret-sharing. No third-party storage.',
    description:
      'Deadrop is a password pusher replacement you can host on your own infrastructure and brand as your own. Secrets expire after viewing. Nothing is stored long-term.',
    url: 'https://vault.ascendsystems.ai',
    screenshot: '/images/deadrop.png',
    status: 'live',
    tags: ['Security', 'Self-hosted', 'Cloudflare Workers', 'D1'],
    metrics: [
      { label: 'Retention after view', value: '0 days' },
      { label: 'Infrastructure cost', value: '$0/mo' },
      { label: 'White-label ready', value: 'Yes' },
    ],
    story: {
      problem:
        "Teams share passwords over Slack and email constantly. Existing tools like secrets.io are third-party black boxes — you don't know where your secrets live.",
      solution:
        'Fully self-hosted on Cloudflare Workers + D1. View-once links, TTL-based expiry, and a minimal UI you can skin to match your brand in minutes.',
      result:
        'Zero external dependencies. Running as vault.ascendsystems.ai. Any team can fork and deploy their own instance in an afternoon.',
    },
  },
  {
    slug: 'ringdocket',
    name: 'Ringdocket',
    tagline: 'Community-sourced call block list. Stop spam before it rings.',
    description:
      'Ringdocket is a spam-call blocking app powered by a shared blocklist. Users report spam numbers; everyone on the network is protected instantly.',
    url: 'https://ringdocket.com',
    screenshot: '/images/ringocket.png',
    status: 'live',
    tags: ['Mobile', 'Call Blocking', 'Community Data'],
    metrics: [
      { label: 'Blocklist type', value: 'Shared' },
      { label: 'Report latency', value: 'Real-time' },
      { label: 'Platform', value: 'iOS + Android' },
    ],
    story: {
      problem:
        'Spam call volume is up 300% since 2020. Carrier-level blocking is slow, opaque, and misses numbers that have been reported by hundreds of real users.',
      solution:
        'Community-sourced blocklist that propagates reports to all users in real time. Mobile-first UX that integrates with native call handling APIs.',
      result:
        'Live at ringdocket.com. Growing a community database of reported numbers across both platforms.',
    },
  },
  {
    slug: 'pottydirectory',
    name: 'PottyDirectory',
    tagline: 'Find a public restroom, anywhere.',
    description:
      'PottyDirectory is the largest crowdsourced public restroom directory online — 1,400+ listings with hours, cleanliness ratings, and accessibility notes.',
    url: 'https://pottydirectory.com',
    status: 'live',
    tags: ['Astro', 'Cloudflare D1', 'AdSense', 'Directory'],
    metrics: [
      { label: 'Listings', value: '1,400+' },
      { label: 'Revenue model', value: 'AdSense' },
      { label: 'Organic sessions', value: '190/mo' },
    ],
    story: {
      problem:
        'Public restrooms are invisible on Google Maps. Parents, travelers, and people with medical needs waste time hunting for the nearest option.',
      solution:
        'Programmatic directory with city-level pages, schema markup, and a submission flow so users can add missing locations themselves.',
      result:
        '1,400+ listings live. Generating organic traffic with AdSense monetization in place.',
    },
  },
  {
    slug: 'heirloom',
    name: 'Heirloom',
    tagline: "Family stories. Preserved before they're gone.",
    description:
      'Heirloom helps families record, organize, and share the stories that are one generation away from being lost forever. Interview prompts, audio recording, and a private family feed.',
    status: 'building',
    tags: ['iOS', 'React Native', 'Supabase', 'Consumer App'],
    metrics: [
      { label: 'Status', value: 'In Progress' },
      { label: 'Co-founder', value: 'Oliver' },
      { label: 'Landing page', value: 'Live' },
    ],
    story: {
      problem:
        "Family history dies with the person who holds it. No one records grandma's stories until it's too late — and photo albums don't capture voices.",
      solution:
        'Guided interview prompts that feel like a conversation. Audio + text storage in a private family vault. Searchable, shareable within the family circle.',
      result:
        'Building with co-founder Oliver. Landing page live. MVP in active development.',
    },
  },
]
