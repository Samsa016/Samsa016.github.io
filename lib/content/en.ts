import { OWNER } from "../owner";
import type { SiteCopy } from "./types";

export const en: SiteCopy = {
  meta: {
    title: `${OWNER.nameEn} — product and AI agent developer`,
    description:
      "Four years of work, from markup to autonomous agents. Every case can be watched running.",
  },

  hero: {
    name: OWNER.nameEn,
    role: "Product and AI agent developer",
    statement: "From markup to agents",
    lede: "I get things to where they actually run: a marketplace handling money, a voice agent on a real phone line, a pipeline that works without me.",
    scrollHint: "Scroll — newest work first",
    count: (n) => `${n} projects · four years`,
  },

  nav: {
    work: "Work",
    about: "How I work",
    contact: "Get in touch",
  },

  labels: {
    stack: "Stack",
    proof: "Evidence",
    task: "The problem",
    solution: "The build",
    openCase: "Read the breakdown",
    live: "See it live",
    repo: "Source",
    archive: "Also in this chapter",
    allWork: "All work",
    year: "Year",
    noFootage: "No footage yet",
    backHome: "All work",
    caseOf: (n, total) => `Case ${n} of ${total}`,
  },

  contents: {
    title: "Filmography",
    works: "works",
    years: "years",
  },

  chapters: {
    y4: {
      index: "Year 4",
      title: "Agents and automation",
      lede: "Systems that run with nobody at the controls: they look at the screen, decide, and finish the job. Half the year went to paid work — it sits below, with client names and data left out.",
    },
    y3: {
      index: "Year 3",
      title: "Products of my own",
      lede: "Work taken to the point where people actually use it: its own domain, real money, real visitors.",
    },
    y2: {
      index: "Year 2",
      title: "The whole task",
      lede: "Whole problems, from the database schema to the form on screen, both ends by hand. This is also where a model first appears inside the product.",
    },
    y1: {
      index: "Year 1",
      title: "First screens",
      lede: "The start: markup, motion, state. These are raw — they are here because everything began with them, not because they are the work to be proud of.",
    },
  },

  cases: {
    // ── Year 4 ────────────────────────────────────────────────────────────
    autoscraper: {
      title: "AutoScraper",
      oneLiner:
        "A listings service for the Japanese car market — from scraper to a bot that takes the query in plain words.",
      task: "A take-home that grew into a service. The job was not a script that pulls pages, but a system that runs unattended: no duplicates, survives the source going down, and lets you search what it collected without writing SQL.",
      solution:
        "Four services around one database. A background worker upserts by listing URL, so a listing updates instead of duplicating. The REST layer sits behind OAuth2 with JWT. The Telegram bot takes «find a red BMW under 2M» and turns it into a structured filter through function calling — the model never writes SQL, it fills in a schema.",
      proof: [
        "Four services: scraper worker, REST API, SPA admin panel, Telegram bot",
        "Three databases from one codebase — dialect picked from DATABASE_URL",
        "Upsert on the unique listing URL, plus retry on network failures",
        "Natural-language queries become filters through function calling",
      ],
      figures: [
        { value: "4", label: "services" },
        { value: "3", label: "databases" },
      ],
    },
    "browser-agent": {
      title: "AI Browser Agent",
      oneLiner:
        "An agent that runs multi-step browser tasks by looking at the page instead of reading its code.",
      task: "Browser automation breaks on the first redesign: selectors go stale, and on a single-page app half the elements only exist after render. The goal was an agent you brief in plain language that still finishes on a site it has never seen.",
      solution:
        "Set-of-Marks. A script marks the DOM so every interactive element carries a number and a box. From there the model works on the screenshot, not the HTML, and answers with an element number. There is no selector left in the loop for it to hallucinate.",
      proof: [
        "Decisions come from the screenshot; the DOM is never parsed",
        "Set-of-Marks removes a whole error class — the invented CSS selector",
        "Cookies and session persist across runs",
        "Extracted data is written out structured",
      ],
    },
    voicedesk: {
      title: "VoiceDesk",
      oneLiner:
        "A voice agent that calls the customer, agrees on a meeting and files it in the CRM.",
      task: "Voice demos usually stop exactly where the work starts: real telephony, the caller talking over you, slots already taken, data-protection law. This one had to survive all the way to a meeting written into the CRM.",
      solution:
        "The browser demo and the phone call are the same agent — only the transport differs. The script, the tools, the CRM and the compliance layer know nothing about how the audio arrived. The same dialog object also serves text mode, so the tests exercise real call logic rather than a copy of it.",
      proof: [
        "One agent across SIP and WebRTC — only the transport changes",
        "Function calling: free slots, booking with race protection, call outcome",
        "Outbound campaigns: queue, concurrency, retries, calling windows",
        "Do-not-call list and consent log built into the architecture, not deferred",
        "Runs with zero API keys — external services swapped for deterministic stubs",
      ],
      figures: [
        { value: "133", label: "tests" },
        { value: "2", label: "transports" },
        { value: "0", label: "keys to run it" },
      ],
    },
    midnight: {
      title: "MIDNIGHT",
      oneLiner:
        "A pipeline that watches the inbound job feed on its own, scores every item and drafts the reply.",
      task: "Hunting for work is not work — it is background noise that eats the day: check the sources, read, discard, answer first. The point was to hand off the scout and the account manager, and keep the building and the judgement calls.",
      solution:
        "Once a minute the pipeline pulls new items, normalises them into one shape and runs four scoring stages: legality, fit, difficulty, verdict. Only a positive verdict spends tokens on a draft. Sending goes through a queue with retries and delivery windows. Anything borderline stays with the human.",
      proof: [
        "Sources polled every minute; only unseen items enter the pipeline",
        "Four scoring stages before a single token is spent on writing",
        "Queue with retries, bounded concurrency and delivery windows",
        "Borderline calls stay with the human",
      ],
    },
    sixmo: {
      title: "Sixmo Form Automator",
      oneLiner:
        "A CLI that completes a multi-step form whose field order changes between runs.",
      task: "The form was assembled on the fly: steps shuffled, fields appeared in different order, random delays and bot checks in between. A selector-based script broke on the second run.",
      solution:
        "Fields are found by meaning — placeholder text and option labels — not by position in the markup. Answers are described by a Zod schema, which makes the tool usable as an agent skill with a checkable contract on both ends.",
      proof: [
        "Survives the form shuffling its steps",
        "Semantic field lookup, no brittle CSS selectors",
        "The Zod schema makes the CLI usable as an external agent skill",
        "A recorded run ships with the repository",
      ],
    },
    tradesandbox: {
      title: "TradeSandbox",
      oneLiner:
        "A visual editor for trading strategies: wire the logic from nodes and watch it trade immediately.",
      task: "A take-home for Quadcode. Build a strategy without writing code and test it against a moving market — entirely in the browser, with no backend.",
      solution:
        "An infinite canvas of condition and action nodes wired into a strategy. Market simulation, chart rendering and strategy execution all run client-side on canvas. Zero network dependencies means the demo serves from static files and cannot go down with a server.",
      proof: [
        "Node editor: price and movement conditions, actions, wiring between them",
        "Live market simulation and charting on canvas",
        "Fully client-side; there is no backend",
      ],
    },

    // ── Year 3 ────────────────────────────────────────────────────────────
    smartembed: {
      title: "SmartEmbed",
      oneLiner:
        "A widget that answers a site's visitors using that same site's content.",
      task: "«Add AI to the site» usually means a chat that knows nothing about the site and invents confidently. This one had to answer only with what the site actually says.",
      solution:
        "A full retrieval cycle in one service: a crawler takes the content, the text is chunked and embedded into a vector store, and a question first retrieves the relevant passage and only then produces an answer. The widget drops into someone else's site with a single tag.",
      proof: [
        "Retrieval end to end: crawl, embeddings, vector search, answer",
        "ChromaDB as the vector store",
        "The widget embeds with one script tag",
      ],
    },
    mindtrack: {
      title: "MindTrack",
      oneLiner:
        "A mood journal that surfaces how sleep and stress connect to how you feel.",
      task: "Mood trackers are plentiful and nearly all of them end at a mood-over-time chart. The value is not the chart — it is the answer to what specifically makes it worse.",
      solution:
        "Every entry passes through the model, which extracts sentiment and themes. Themes become a dimension you can slice by, which is where the correlations against sleep and stress come from. It is an analytics layer over a journal, not a wrapper around a chat.",
      proof: [
        "Per entry: sentiment, extracted themes, a written response",
        "Correlation charts across mood, sleep and stress",
        "Registration and login on JWT",
      ],
    },
    lapka: {
      title: "Lapka",
      oneLiner:
        "A bot you tell out loud how the puppy's day went; it keeps the diary and sends a weekly report.",
      task: "You only get a puppy's first year once, and no owner keeps a diary by hand. A voice note takes fifteen seconds — so that had to be the entire barrier to entry.",
      solution:
        "The note is transcribed, then a single model call in JSON mode does two jobs at once: it writes a warm reply to the owner and pulls out a list of wins with categories. One call rather than two, because the prose and the structure come from the same context. Wins accumulate in the database and a scheduler assembles the weekly report.",
      proof: [
        "The whole pipeline: voice, transcription, model, database, weekly report",
        "One model call per note yields both the reply and the structured data",
        "SQLAlchemy 2.0 async — moving to PostgreSQL needs no code changes",
        "The model provider switches by environment variable",
      ],
    },
    "choice-app-meal": {
      title: "Smart Pantry",
      oneLiner: "Track what food is in the house and get recipes from what's already there.",
      proof: ["Deploys with a single Docker command"],
    },
    "voice-agent-bot": {
      title: "Voice Agent Bot",
      oneLiner: "Managing ElevenLabs voice agents from Telegram.",
      proof: [
        "Users only ever see their own agents — ownership is checked by join on every request",
      ],
    },
    "defect-probe": {
      title: "Defect Probe",
      oneLiner:
        "A five-minute hypothesis check: can the model recognise a defect from a photo?",
      proof: [
        "A report with an honest confidence read on every image",
        "Lets a client test the idea before paying for the build",
      ],
    },

    // ── Year 2 ────────────────────────────────────────────────────────────
    agora: {
      title: "AGORA",
      oneLiner:
        "A multi-vendor marketplace: buyers, sellers and an admin, with money, search and load protection.",
      task: "A portfolio with a landing page where a product should be proves nothing. This needed to be a platform you can sign into under three roles and hit the same problems a real marketplace has: money, permissions, catalogue search, load.",
      solution:
        "Money is counted in integer cents — no floating point anywhere near a payment. Three roles with different permissions and different interfaces over shared data. Cache and rate limiting on Redis shield the catalogue and the checkout. The demo is seeded with hundreds of sellers and thousands of products, so search and pagination get tested properly rather than against three rows.",
      proof: [
        "Deployed and open: agora.24rbs.ru",
        "Three roles over shared data: buyer, seller, administrator",
        "Money held in integer cents",
        "End-to-end checkout through Stripe in test mode",
        "Cache and rate limiting on Upstash Redis",
        "Architected for 1,000–10,000 users",
      ],
      figures: [
        { value: "3", label: "roles" },
        { value: "120", label: "sellers in the demo" },
        { value: "6,000+", label: "products in the demo" },
      ],
    },
    perfectshop: {
      title: "PerfectShop",
      oneLiner:
        "A shop with the full purchase path: catalogue, cart, payment, order history.",
      proof: [
        "Payments through YooKassa",
        "JWT and protected routes for the account area",
      ],
    },
    "work-journal": {
      title: "Site work log",
      oneLiner:
        "Logging completed work on a construction site: entries, date filters, roles.",
      task: "The site manager files entries from a phone in the field, not from a desk. So the form has to catch a mistake immediately and explain it in words, rather than returning a 500 after submit.",
      solution:
        "The data contract is written once and lives at both ends: Zod validates the form before it is sent, Pydantic v2 validates the request body on the server. Fields, types and bounds match by definition, so client and server cannot disagree about what counts as valid.",
      proof: ["One data contract on both ends: Zod on the client, Pydantic v2 on the server"],
    },
    "meteo-app": {
      title: "Weather service",
      oneLiner: "An interactive cloud-cover forecast on a 3D globe.",
      proof: ["Globe on Cesium, interface on Mantine"],
    },
    "resale-miniapp": {
      title: "Resale",
      oneLiner: "A Telegram Mini App for reselling.",
      proof: ["Server-side init_data verification, admin endpoints behind a key"],
    },

    // ── Year 1 ────────────────────────────────────────────────────────────
    yav: {
      title: "YAV",
      oneLiner:
        "A video production studio site where the impression comes from scroll direction, not effects.",
      task: "The brief asked for a wow moment. The usual answer is to pile on shaders and drop the page on mobile. This tested the opposite: that editing and timing carry the impression, and heavy graphics belong only where they are the subject.",
      solution:
        "The wow on the front page comes from video and scroll direction rather than programmatic effects — the site page ships about two kilobytes of JavaScript. Heavy three.js loads only on a separate lab page, where a WebGPU particle engine is the thing being shown.",
      proof: [
        "three.js is loaded only on the lab page",
        "A WebGPU particle engine as a technical case in its own right",
      ],
      figures: [
        { value: "2", unit: "KB", label: "of own JS on the front page" },
        { value: "850", unit: "KB", label: "three.js on the lab page" },
      ],
    },
    monolit: {
      title: "MONOLIT",
      oneLiner:
        "A premium single-page site that repaints for a new client in a couple of hours.",
      task: "Business-card sites get ordered constantly, and each one is the same work again. This is the reference build: it goes in the portfolio and doubles as the starting point for the next order.",
      solution:
        "Every style decision lives in tokens; all copy and all projects live in one content file. Switching clients comes down to five or six palette values, a different type pairing and a rewritten content file. Components are hand-built — off-the-shelf UI kits read as cheap on sight.",
      proof: [
        "Design system in tokens, all content in one file",
        "Repainting for a new client means the palette plus the content file",
        "Three pages, a form with validation and submission states",
      ],
    },
    "only-digital-test": {
      title: "Historical dates",
      oneLiner:
        "An interactive era block: a circular selector wired to a synchronised event slider.",
      task: "A take-home built from a design where the era wheel and the event track move independently but must agree at every instant. Any drift between the wheel's angle and the slider's position is immediately visible.",
      solution:
        "The wheel and the slider both read one piece of state: the active era. Changing it drives a single shared timeline — the wheel rotates, old events leave, new ones arrive. Nothing animates on its own, so they cannot fall out of sync by construction rather than by luck.",
      proof: [
        "Frame-by-frame GSAP motion, pixel-accurate on desktop and mobile",
        "Custom Webpack build",
      ],
    },
    "ticket-jira": {
      title: "Kanban board",
      oneLiner: "A task board with drag-and-drop between columns.",
      proof: ["Mutations through Server Actions, with no separate REST layer"],
    },
    airesto: {
      title: "Airesto",
      oneLiner: "A restaurant booking overview page.",
      proof: ["Vue 3 Composition API, studio take-home"],
    },

    // ── Clients (anonymised) ──────────────────────────────────────────────
    "client-iiko-bi": {
      title: "Nightly load into BI",
      oneLiner:
        "Restaurant chain, St. Petersburg. Products, recipe cards and invoices move from the point-of-sale system into SQL every night, where BI reads them.",
      task: "Analytics lived inside the point-of-sale system and ended there. The data was needed in SQL, under a hard constraint: do not touch the production estate at all.",
      solution:
        "Read-only against the source system. Writes go strictly to a separate database; the client's working databases are opened read-only and only for reconciliation. Recipe cards carry their full version history, so cost is calculated for the date you need rather than for today.",
      proof: [
        "Read-only against iiko; writes land in a separate database",
        "Recipe cards with full version history, not a snapshot of today",
        "Scheduled refresh every night",
      ],
    },
    "client-crm-copilot": {
      title: "CRM prompter",
      oneLiner:
        "Reads incoming customer messages in the CRM, drafts a reply from the price list and hands it to the manager. The customer never sees the hint.",
      task: "Leads from marketplaces land in the CRM faster than managers can answer. An autoresponder in a live customer conversation does more harm than good — it promises what the price list does not have.",
      solution:
        "A prompter, not an autoresponder. The draft is posted as an internal comment only the manager can see; they edit it and send it under their own name. Responsibility for what goes out stays with a person, speed goes up, and the risk of the bot promising something disappears.",
      proof: [
        "The hint arrives as a hidden comment, invisible to the customer",
        "Drafts are built from the client's own price list, not the model's general knowledge",
        "A human always presses send",
      ],
    },
    "client-clinic-rag": {
      title: "Clinic assistant",
      oneLiner:
        "Private medical centre. A bot answers questions about services and doctors strictly from the clinic's knowledge base and passes a warm lead to the front desk.",
      task: "Medicine is a domain where an invented answer is unacceptable. At the same time most enquiries are the same questions about services, doctors and prices, and they eat the receptionist's day.",
      solution:
        "The bot answers only from the clinic's knowledge base. It deliberately cannot write to the schedule: it takes the conversation as far as a request and hands that to the front desk, where a person confirms. The model layer is provider-agnostic, so switching providers does not touch the code.",
      proof: [
        "Answers come only from the clinic's knowledge base",
        "The bot collects the request; a receptionist confirms the booking",
        "Provider switch by a single environment variable",
      ],
    },
    "client-deals-bot": {
      title: "Paid-deal bot",
      oneLiner:
        "Dealer network. The moment a deal is marked paid, a card and the running monthly total land in the management chat.",
      task: "Management learned about revenue from exports after the fact. They needed a live feed: paid means everyone who should know sees it now.",
      solution:
        "The bot polls the client's on-premise CRM and catches the transition to paid. A deal card and a recalculated calendar-month total go to the chat. Manager bonuses come out of the same data, so the number in the incentive scheme and the number in the report stop diverging.",
      proof: [
        "Notification at the moment a deal turns paid",
        "Running calendar-month total in every message",
        "Manager bonuses computed from the same data",
      ],
    },
    "client-custdev": {
      title: "AI-assisted customer research",
      oneLiner:
        "Not a platform but a method: a stack of services and stage-by-stage prompts that turn a recorded interview into an analysis.",
      task: "The client wanted a repeatable process rather than a product — so the next study runs the same steps and produces comparable output, instead of depending on who ran it.",
      solution:
        "An end-to-end process: transcription, stage tagging, extraction of hypotheses and pain points, consolidation into one report. Each stage has its own prompt and its own place in the stack. The method was proven on a pilot study and handed over with documentation.",
      proof: [
        "Delivered as a process with stage prompts, not as an application",
        "Proven on a pilot study",
        "Reproducible on the next study",
      ],
    },
    "client-service-mentor": {
      title: "Service floor mentor",
      oneLiner:
        "A helper for technicians at the machine: ask out loud, get the instruction from the manufacturer's manual.",
      task: "Technicians on the floor called senior engineers about every fault. The questions repeated, there was one engineer, and machine downtime costs money. The answer had to arrive at the machine itself: hands are busy, so asking happens by voice, and answering happens strictly from the manual.",
      solution: "Retrieval runs before the model, not after. The manufacturer's documentation is crawled, translated and split into fragments; a question finds fragments first, and only then does the model phrase an answer from what it found. Two controller families — for sheet cutters and tube cutters — are separated at the retrieval level, so instructions from different machines never mix. Speech is transcribed on our own server; only text leaves it.",
      proof: [
        "Answers are assembled only from retrieved documentation fragments",
        "Speech recognition stays local — faster-whisper on our own server",
        "Two equipment families kept apart, so instructions never mix",
        "Self-hosted: Docker Compose and Caddy with automatic certificates",
      ],
    },
    "client-drop-bot": {
      title: "Drop purchase bot",
      oneLiner:
        "Buying the moment stock goes live: everything rides on how fast the bot notices the opening.",
      task: "Stock goes live at an appointed minute and the window closes in seconds. Polling one endpoint twice a second breaks exactly then: the server buckles under peak load, the request hangs — and while it hangs, the window opens and shuts. That is what happened: normal replies took 50–100 ms, and at the peak one request hung for 22 seconds.",
      solution: "Two independent detection channels instead of one: polling the endpoint and reading data off the front page. If one hangs, the other catches the opening, and the stuck request never blocks the parallel one. One connection per worker for its whole lifetime, HTTP/2 and fully async I/O, so nothing re-establishes a connection at the most expensive moment.",
      proof: [
        "Failure traced by timings: a 22 s hang against the normal 50–100 ms",
        "Two independent detection channels — one failing does not blind the bot",
        "One connection per worker, HTTP/2, fully asynchronous I/O",
        "Polling interval cut from 0.5 s to 0.1 s",
      ],
    },
  },

  about: {
    title: "How I work",
    lede: "Four years of the same motion: take a problem that sounds simple out loud, and get it to the state where someone can actually use it.",
    sections: [
      {
        heading: "What I take on",
        body: "Products with logic behind the screens: marketplaces and account areas, bots and voice agents, integrations with CRM and back-office systems, automation of routine work. Separately, problems where a model has to fit into an existing process without inventing things.",
      },
      {
        heading: "How the work runs",
        body: "The spec comes first: what counts as done and how that gets checked. Then a working slice as early as possible, so there is something to react to instead of something to describe. Demo data is always at real volume — three test rows hide every problem worth finding.",
      },
      {
        heading: "What I don't do",
        body: "I don't put percentages in reports that I can't back up. I don't ship things that only run on my machine. And where the cost of a wrong answer is high, I don't let a model's output reach the customer unreviewed — it goes to the operator as a suggestion instead.",
      },
    ],
  },

  contact: {
    title: "Get in touch",
    lede: "Describe the problem in two paragraphs and I'll tell you whether I'm taking it, how long it runs, and what I need from you.",
    channels: [
      { label: "Telegram", value: OWNER.telegram.handle, href: OWNER.telegram.href },
      { label: "Email", value: OWNER.email.address, href: OWNER.email.href },
      { label: "GitHub", value: OWNER.github.handle, href: OWNER.github.href },
    ],
  },
};
