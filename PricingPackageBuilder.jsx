/**
 * FitBudd Pricing & Package Builder
 * Single-file React component — embed via iframe in Webflow blog pages.
 *
 * Stack: GitHub + Vercel (deploy as a Vite/React app, embed via iframe)
 *
 * Setup:
 *   1. Replace HUBSPOT_PORTAL_ID and HUBSPOT_FORM_GUID near the top of this file.
 *   2. Deploy to Vercel, embed the URL in Webflow via iframe.
 *
 * Embed: <iframe src="https://your-app.vercel.app" style="width:100%;border:none;" />
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Star,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   INJECTED GLOBAL STYLES
   ───────────────────────────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

  .fbb * { font-family: 'DM Sans', sans-serif !important; box-sizing: border-box; }
  .fbb { -webkit-font-smoothing: antialiased; }

  @keyframes fbb-pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes fbb-fadein  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fbb-slidein { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes fbb-slideout{ from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-20px)} }
  @keyframes fbb-shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)} }
  @keyframes fbb-spin    { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes fbb-dotpulse{ 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }

  .fbb-enter  { animation: fbb-slidein  0.22s ease forwards; }
  .fbb-exit   { animation: fbb-slideout 0.18s ease forwards; }
  .fbb-fadein { animation: fbb-fadein   0.28s ease forwards; }
  .fbb-shake  { animation: fbb-shake    0.35s ease; }
  .fbb-skel   { animation: fbb-pulse 1.6s ease-in-out infinite; background:#E8EBF2; border-radius:8px; }
  .fbb-spin   { animation: fbb-spin  1.1s linear infinite; }

  .fbb-blur   { filter:blur(5px); pointer-events:none; user-select:none; }
  .fbb-pill-hover:hover { filter:brightness(0.95); }

  .fbb-check-row input[type=checkbox] { accent-color:#4D6BFE; width:18px; height:18px; cursor:pointer; flex-shrink:0; }

  .fbb-range { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:999px; background:#E2E5EA; outline:none; }
  .fbb-range::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:#4D6BFE; cursor:pointer; box-shadow:0 0 0 3px rgba(77,107,254,0.15); }
  .fbb-range::-moz-range-thumb { width:20px; height:20px; border-radius:50%; background:#4D6BFE; cursor:pointer; border:none; }

  .fbb-input { width:100%; padding:10px 14px; border:1.5px solid #E2E5EA; border-radius:8px; font-size:14px; color:#1A1D23; outline:none; transition:border-color 0.15s; background:#fff; }
  .fbb-input:focus { border-color:#4D6BFE; box-shadow:0 0 0 3px rgba(77,107,254,0.12); }
  .fbb-input-error { border-color:#E53E3E !important; }

  .fbb-select { appearance:none; -webkit-appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px !important; cursor:pointer; }

  .fbb-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:600; letter-spacing:0.03em; }

  .fbb-card-highlight { background:linear-gradient(135deg,#4D6BFE 0%,#6B84FF 100%); color:#fff; }
  .fbb-card-highlight .fbb-include-item { color:rgba(255,255,255,0.9); }
  .fbb-card-highlight .fbb-check-icon { color:#fff; }
  .fbb-card-highlight .fbb-meta-chip { background:rgba(255,255,255,0.18); color:#fff; }
  .fbb-card-highlight .fbb-tagline { color:rgba(255,255,255,0.8); }
  .fbb-card-highlight .fbb-ideal-label { color:rgba(255,255,255,0.7); }
  .fbb-card-highlight .fbb-ideal-text { color:rgba(255,255,255,0.95); }

  .fbb-sticky { position:fixed; bottom:0; left:0; right:0; z-index:999; padding:12px 16px; background:#fff; box-shadow:0 -2px 16px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; gap:10px; }

  @media (min-width:768px) { .fbb-sticky { display:none !important; } }
  @media (max-width:767px) {
    .fbb-package-grid { grid-template-columns: 1fr !important; }
    .fbb-rev-table td, .fbb-rev-table th { padding:8px 10px !important; font-size:13px !important; }
  }
`;

/* ─────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────── */
const COACHING_FORMATS = [
  { id: '1on1_online',  label: '1:1 Online' },
  { id: '1on1_inperson', label: '1:1 In-Person' },
  { id: 'hybrid',       label: 'Hybrid (Online + In-Person)' },
  { id: 'group',        label: 'Group Coaching' },
  { id: '1on1_group',   label: '1:1 + Group' },
];

const NICHES = [
  'General Fitness',
  'Weight Loss / Fat Loss',
  'Strength & Powerlifting',
  'Bodybuilding / Physique',
  'Sports Performance',
  "Women's Fitness / Pre-Post Natal",
  'Yoga / Mobility',
  'Functional Fitness / CrossFit',
  'Senior Fitness',
  'Youth / Athletic Development',
  'Rehab / Corrective Exercise',
  'Other',
];

const EXPERIENCE_LEVELS = [
  { id: 'new',         label: 'New (< 1 year)' },
  { id: 'growing',     label: 'Growing (1–3 years)' },
  { id: 'established', label: 'Established (3+ years)' },
];

const SERVICES = [
  { id: 'workout_programs',  label: 'Custom Workout Programs' },
  { id: 'nutrition_plans',   label: 'Nutrition / Meal Plans' },
  { id: 'video_calls',       label: 'Video Coaching Calls' },
  { id: 'form_check',        label: 'Form Check / Video Review' },
  { id: 'weekly_checkins',   label: 'Weekly Check-Ins' },
  { id: 'messaging',         label: 'In-App Messaging Support' },
  { id: 'progress_tracking', label: 'Progress Tracking' },
  { id: 'habit_coaching',    label: 'Habit Coaching' },
  { id: 'group_challenges',  label: 'Group Challenges' },
  { id: 'supplement_guidance', label: 'Supplement Guidance' },
];

const PROGRAM_DURATIONS = [
  { id: '4_weeks',         label: '4 weeks' },
  { id: '8_weeks',         label: '8 weeks' },
  { id: '12_weeks',        label: '12 weeks' },
  { id: 'ongoing_monthly', label: 'Ongoing monthly' },
];

const INCOME_GOALS = [
  { id: '3000',  label: '$3,000',  value: 3000 },
  { id: '5000',  label: '$5,000',  value: 5000 },
  { id: '8000',  label: '$8,000',  value: 8000 },
  { id: '10000', label: '$10,000', value: 10000 },
  { id: '15000', label: '$15,000+', value: 15000 },
];

const HOURS_OPTIONS = [
  { id: '10', label: '10 hrs', value: 10 },
  { id: '20', label: '20 hrs', value: 20 },
  { id: '30', label: '30 hrs', value: 30 },
  { id: '40', label: '40 hrs', value: 40 },
];

const NICHE_NAMES = {
  'General Fitness':                    ['Foundation Plan', 'Complete Coaching', 'Elite Coaching'],
  'Weight Loss / Fat Loss':             ['Shred Starter', 'Total Transformation', 'VIP Transformation'],
  'Strength & Powerlifting':            ['Strength Base', 'Power Builder', 'Elite Powerlifting'],
  'Bodybuilding / Physique':            ['Physique Foundation', 'Stage Ready Pro', 'Elite Competition Prep'],
  'Sports Performance':                 ['Performance Base', 'Athlete Pro', 'Elite Performance'],
  "Women's Fitness / Pre-Post Natal":   ['Wellness Start', 'Complete Wellness', 'Premium Wellness'],
  'Yoga / Mobility':                    ['Flow Foundation', 'Mind & Body Pro', 'Elite Mobility'],
  'Functional Fitness / CrossFit':      ['Functional Base', 'CrossFit Pro', 'Elite Athlete'],
  'Senior Fitness':                     ['Active Foundations', 'Vitality Pro', 'Elite Active Aging'],
  'Youth / Athletic Development':       ['Youth Starter', 'Athlete Development', 'Elite Youth Program'],
  'Rehab / Corrective Exercise':        ['Recovery Foundation', 'Corrective Pro', 'Elite Rehabilitation'],
  'Other':                              ['Foundation Plan', 'Complete Coaching', 'VIP Coaching'],
};

/* ─────────────────────────────────────────────
   HUBSPOT CONFIG
   Setup:
     1. In HubSpot → Marketing → Forms, create a new form.
     2. Add these built-in fields: First name, Last name, Email.
     3. Create these custom contact properties and add them to the form:
          coaching_format · fitness_niche · experience_level
          services_offered · program_duration · monthly_income_goal
          coaching_hours_per_week · max_clients
     4. Copy your Portal ID from HubSpot Settings → Account Setup → Account Information.
     5. Copy the Form GUID from the form's embed code (looks like xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
     6. Replace the two placeholder values below.
   ───────────────────────────────────────────── */
const HUBSPOT_PORTAL_ID = 'YOUR_PORTAL_ID'; // e.g. '12345678'
const HUBSPOT_FORM_GUID = 'YOUR_FORM_GUID'; // e.g. 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

/* ─────────────────────────────────────────────
   PRICING LOGIC
   ───────────────────────────────────────────── */
function calculatePricing(formData) {
  const incomeGoal   = parseInt(formData.incomeGoal)  || 5000;
  const maxClients   = parseInt(formData.maxClients)  || 20;
  const isGroup      = formData.coachingFormat === 'group';
  const exp          = formData.experienceLevel;
  const dur          = formData.programDuration;

  const expMult = exp === 'new' ? 0.72 : exp === 'growing' ? 0.87 : 1.0;
  const durMult = dur === '4_weeks' ? 1.25 : dur === '8_weeks' ? 1.1 : dur === '12_weeks' ? 1.0 : 0.92;

  // Distribute: ~25% premium, ~50% core, ~25% starter
  const premiumClients = Math.max(1, Math.round(maxClients * 0.2));
  const coreClients    = Math.max(1, Math.round(maxClients * 0.5));
  const starterClients = Math.max(1, maxClients - premiumClients - coreClients);

  // Solve for core price: goal ≈ s*0.6*c + cc*c + p*2.2*c
  const divisor  = starterClients * 0.6 + coreClients + premiumClients * 2.2;
  let corePrice  = Math.round((incomeGoal / divisor) * expMult * durMult / 10) * 10;
  corePrice      = Math.max(149, Math.min(corePrice, 850));

  const starterPrice  = Math.round(corePrice * 0.6 / 5) * 5;
  const premiumPrice  = Math.round(corePrice * 2.2 / 10) * 10;

  if (isGroup) {
    const grpSize = 10;
    return {
      starter: Math.max(45, Math.round(starterPrice / grpSize / 5) * 5),
      core:    Math.max(75, Math.round(corePrice    / grpSize / 5) * 5),
      premium: Math.max(110,Math.round(premiumPrice / grpSize / 5) * 5),
      starterClients, coreClients, premiumClients,
      isGroup: true, groupSize: grpSize,
    };
  }

  return { starter: starterPrice, core: corePrice, premium: premiumPrice, starterClients, coreClients, premiumClients, isGroup: false };
}

/* ─────────────────────────────────────────────
   PACKAGE GENERATION (client-side, no AI dependency)
   ───────────────────────────────────────────── */

// Niche-specific taglines — transformation-focused, not feature-focused
const NICHE_TAGLINES = {
  'General Fitness':                  ['Build the habit. See the results.',           'The complete system for lasting fitness.',              'Total transformation with direct access to me.'],
  'Weight Loss / Fat Loss':           ['The first step to real, lasting fat loss.',    'The proven path to the body you want.',                 'Maximum results with maximum accountability.'],
  'Strength & Powerlifting':          ['Build strength that shows on the platform.',   'Structured programming that drives real numbers.',      'Elite-level strength coaching, every rep.'],
  'Bodybuilding / Physique':          ['Build the foundation your physique needs.',    'Stage-ready programming and nutrition.',                 'Competition prep with elite-level detail.'],
  'Sports Performance':               ['Train the way your sport demands.',            'Performance programming built around your sport.',      'Everything you need to dominate your season.'],
  "Women's Fitness / Pre-Post Natal": ['Start your journey with the right support.',   'Coaching built around your life and your goals.',       'Dedicated support at every stage of your journey.'],
  'Yoga / Mobility':                  ['Start moving with purpose.',                   'Deepen your practice with expert guidance.',            'Full-access mobility coaching and accountability.'],
  'Functional Fitness / CrossFit':    ['Build the base. Move better. Go harder.',      'Programming that makes you fitter in every direction.', 'Elite coaching for competitive athletes.'],
  'Senior Fitness':                   ['Move confidently and feel strong every day.',  'A complete plan built for your body and your goals.',   'Dedicated coaching and full support to keep you thriving.'],
  'Youth / Athletic Development':     ['The foundation every young athlete needs.',    'Multi-sport development that builds winners.',          'Elite athlete development for serious competitors.'],
  'Rehab / Corrective Exercise':      ['Start moving pain-free with the right plan.',  'Corrective coaching that restores function.',           'Comprehensive rehab and performance coaching.'],
  'Other':                            ['The start of your transformation.',            'The complete coaching experience.',                     'Coaching with full access and full commitment.'],
};

// Niche-specific ideal client descriptions
const NICHE_IDEAL_FOR = {
  'General Fitness':                  ['People new to fitness who want a clear starting point.', 'Clients committed to consistent progress with expert guidance.', 'Goal-driven clients who want direct, personal accountability.'],
  'Weight Loss / Fat Loss':           ['Clients starting their fat loss journey with a structured plan.', 'Clients ready to commit fully to hitting their goal weight.', 'Clients who\'ve tried before and are ready for a completely different level of support.'],
  'Strength & Powerlifting':          ['Lifters who want structured programming beyond generic plans.', 'Competitors or serious lifters targeting specific strength goals.', 'Lifters ready to train like elite athletes with elite-level coaching.'],
  'Bodybuilding / Physique':          ['Clients building their foundation before stepping on stage.', 'Competitors preparing for their next show with full programming and nutrition.', 'Dedicated competitors who want every detail locked in from macros to peak week.'],
  'Sports Performance':               ['Athletes who want structured off-season or in-season training.', 'Competitive athletes targeting position-specific performance gains.', 'Serious athletes who want elite-level, sport-specific coaching.'],
  "Women's Fitness / Pre-Post Natal": ['Women starting their fitness journey who want a safe, supportive approach.', 'Women ready for consistent progress with a coach who understands their needs.', 'Women who want dedicated support and expert guidance at every stage.'],
  'Yoga / Mobility':                  ['Beginners building a consistent practice from the ground up.', 'Practitioners ready to deepen their practice with expert feedback.', 'Advanced practitioners seeking full-spectrum mobility and coaching support.'],
  'Functional Fitness / CrossFit':    ['Athletes new to CrossFit who want to build a strong base.', 'Dedicated athletes optimising performance across multiple disciplines.', 'Competitive athletes who want elite coaching for elite-level results.'],
  'Senior Fitness':                   ['Active adults who want a safe, structured program for their goals.', 'Seniors committed to maintaining strength, mobility, and independence.', 'Clients who want dedicated expert coaching and full-access support.'],
  'Youth / Athletic Development':     ['Young athletes building fitness foundations and sport skills.', 'Multi-sport athletes developing the physical tools to excel in their sport.', 'Elite young athletes targeting serious competitive performance.'],
  'Rehab / Corrective Exercise':      ['Clients recovering from injury who need a careful, structured return to movement.', 'Clients with movement limitations wanting to build strength alongside corrective work.', 'Clients who want comprehensive rehab, performance, and ongoing corrective support.'],
  'Other':                            ['Clients new to structured coaching who want a starting point.', 'Committed clients who want a complete coaching experience.', 'Clients who want full, dedicated access and the highest level of support.'],
};

function buildStrategyNotes(formData, pricing) {
  const { experienceLevel: exp, niche, coachingFormat: format, services, programDuration: dur } = formData;
  const goal     = parseInt(formData.incomeGoal) || 5000;
  const hasNutrition   = services.includes('nutrition_plans');
  const hasVideoCalls  = services.includes('video_calls');
  const hasFormCheck   = services.includes('form_check');
  const hasHabit       = services.includes('habit_coaching');
  const notes = [];

  // Note 1: Experience-based pricing insight
  if (exp === 'new') {
    notes.push(`At $${pricing.core}/month, your core package is priced to build your first client base. Focus the next 90 days on getting 3–5 documented transformations you can screenshot and share. Once you have that social proof, raise this price by $${Math.round(pricing.core * 0.2 / 10) * 10} — you've earned it.`);
  } else if (exp === 'growing') {
    notes.push(`Your core package at $${pricing.core}/month sits in the mid-market sweet spot. Once you cross 10 documented client results, you have clear justification to push it to $${Math.round(pricing.core * 1.25 / 10) * 10}. That single move adds $${Math.round(pricing.coreClients * pricing.core * 0.25 / 100) * 100}+/month in revenue without acquiring a single new client.`);
  } else {
    notes.push(`With your experience, stop competing on price. Your premium tier at $${pricing.premium}/month is where your marketing energy belongs. High-ticket clients make up ~20% of volume but drive 35–40% of revenue — and they refer other premium clients.`);
  }

  // Note 2: Format-specific delivery tip
  if (format === 'hybrid') {
    notes.push(`With hybrid coaching, don't bundle in-person sessions into every tier. Position them as a premium inclusion exclusive to your Core and Premium packages — it naturally justifies the price gap between tiers and gives clients a tangible reason to upgrade from Starter.`);
  } else if (format === 'group') {
    notes.push(`Group pricing converts best with hard caps and visible scarcity. Set a firm limit of ${Math.min(15, Math.max(8, Math.round(parseInt(formData.maxClients) / 3)))} per cohort and communicate it everywhere. "Last 2 spots in the April cohort" outperforms open enrollment every single time.`);
  } else if (format === '1on1_inperson') {
    notes.push(`In-person training has a hard client ceiling tied to your schedule. With ${formData.maxClients} max clients across ${formData.hoursPerWeek} hours/week, you're averaging roughly ${Math.round((parseInt(formData.hoursPerWeek) || 20) / Math.max(1, parseInt(formData.maxClients)) * 60)} minutes of coached time per client per week — before travel. Factor that into your hourly rate calculation before filling every slot.`);
  } else if (format === '1on1_group') {
    notes.push(`Running 1:1 and group programs simultaneously requires clear positioning. Keep your group offering as a standalone product — not a cheaper version of 1:1. Clients should see them as different solutions for different problems, not the same service at a discount.`);
  } else {
    notes.push(`Online 1:1 coaching is geography-unlimited. To hit $${goal.toLocaleString()}/month, you don't need to be in a major city — you need a clear niche and consistent content that attracts pre-qualified clients who already know they want to invest in coaching.`);
  }

  // Note 3: Niche or service-specific insight
  if (hasNutrition && (niche === 'Weight Loss / Fat Loss' || niche === 'Bodybuilding / Physique')) {
    notes.push(`Nutrition plans are the #1 retention driver in ${niche === 'Weight Loss / Fat Loss' ? 'fat loss' : 'physique'} coaching. Keep basic macro guidance in Core, but reserve custom meal planning and weekly nutrition adjustments for Premium only — when results plateau mid-program, "you need the full nutrition support" becomes your natural upsell.`);
  } else if (hasVideoCalls) {
    notes.push(`Position your video calls as structured 30-minute strategy sessions — not open-ended check-ins. Coaches who offer "unlimited calls" attract clients who want hand-holding, not results. Clients who value your time will value the structure, and it protects your own schedule.`);
  } else if (niche === 'Sports Performance') {
    notes.push(`Sports performance clients operate on seasonal timelines. Offer "in-season" and "off-season" variants of your Core package at the same price — the client stays enrolled year-round and you build a complete performance picture over time. Year-round retainers beat short-term programs for lifetime value.`);
  } else if (niche === 'Senior Fitness' || niche === 'Rehab / Corrective Exercise') {
    notes.push(`In the ${niche} niche, trust and safety are the primary buying criteria — not price. Lead with your credentials and your process before mentioning cost. Clients in this niche will pay a premium for a coach they trust completely, and they refer extensively within their peer group.`);
  } else if (hasHabit) {
    notes.push(`Habit coaching is an underrated retention tool. Clients who work on habits alongside their training stay 40–60% longer than those who only follow a workout plan. Make this explicit in your marketing — it attracts clients who've failed before and know they need a fundamentally different approach.`);
  } else if (hasFormCheck) {
    notes.push(`Form check and video review is a high-perceived-value service that's relatively low effort for you. Make sure it's featured prominently in your Core and Premium package descriptions — remote clients frequently cite "no way to check my form" as their hesitation with online coaching. You remove that objection directly.`);
  } else {
    notes.push(`For ${niche}, clients are buying the transformation story, not the service list. Lead your marketing with a specific, measurable outcome ("add 50 lbs to your deadlift in 12 weeks" or "lose 20 lbs before summer") rather than listing features. Outcomes convert; feature lists just inform.`);
  }

  // Note 4: VIP tier / revenue optimisation
  const premiumRev = pricing.premiumClients * pricing.premium;
  const totalRev   = pricing.starterClients * pricing.starter + pricing.coreClients * pricing.core + premiumRev;
  const premiumPct = Math.round((premiumRev / totalRev) * 100);
  notes.push(`Your Premium tier at $${pricing.premium}/month represents ~${premiumPct}% of projected revenue with just ${pricing.premiumClients} clients. Don't rush to fill those slots or discount to close them. Qualify buyers with one question: "What's your timeline for hitting your goal?" Premium clients are deadline-driven — they will find the budget if they believe in the result.`);

  return notes;
}

function generatePackages(formData, pricing) {
  const names      = NICHE_NAMES[formData.niche]     || NICHE_NAMES['Other'];
  const taglines   = NICHE_TAGLINES[formData.niche]  || NICHE_TAGLINES['Other'];
  const idealFor   = NICHE_IDEAL_FOR[formData.niche] || NICHE_IDEAL_FOR['Other'];
  const selectedIds = formData.services || [];

  // Smart service tier distribution — priority ordering per tier
  const STARTER_PRIORITY  = ['workout_programs', 'progress_tracking', 'weekly_checkins'];
  const CORE_PRIORITY     = ['nutrition_plans', 'messaging', 'video_calls', 'form_check', 'habit_coaching'];
  const PREMIUM_EXTRAS    = ['supplement_guidance', 'group_challenges'];

  const starterBase = SERVICES.filter(s => selectedIds.includes(s.id) && STARTER_PRIORITY.includes(s.id)).map(s => s.label);
  const starterRest = SERVICES.filter(s => selectedIds.includes(s.id) && !STARTER_PRIORITY.includes(s.id)).map(s => s.label);
  let starterIncludes = [...starterBase, ...starterRest].slice(0, 3);
  if (starterIncludes.length === 0) starterIncludes = ['Custom Workout Program', 'Weekly Check-Ins', 'Progress Tracking'];

  const coreExtra = SERVICES.filter(s => selectedIds.includes(s.id) && CORE_PRIORITY.includes(s.id)).map(s => s.label);
  let coreIncludes = [...new Set([...starterIncludes, ...coreExtra])].slice(0, 5);
  if (coreIncludes.length < 4) { coreIncludes.push('In-App Messaging Support'); coreIncludes.push('Video Coaching Calls'); }

  const allSelected  = SERVICES.filter(s => selectedIds.includes(s.id)).map(s => s.label);
  const premiumExtra = SERVICES.filter(s => selectedIds.includes(s.id) && PREMIUM_EXTRAS.includes(s.id)).map(s => s.label);
  const premiumIncludes = [...new Set([...coreIncludes, ...allSelected, ...premiumExtra, 'Priority Support', 'Monthly Strategy Call'])].slice(0, 7);

  // Format-aware delivery summaries
  const fmt = formData.coachingFormat;
  const starterDelivery = fmt === 'group'  ? 'App-based · Group sessions · Weekly check-ins'          : 'App-based · Weekly check-ins';
  const coreDelivery    = fmt === 'hybrid' ? 'App + in-person sessions · Bi-weekly check-ins'          :
                          fmt === 'group'  ? 'App + group sessions · Bi-weekly coaching calls'         : 'App + video calls · Bi-weekly check-ins';
  const premDelivery    = fmt === 'hybrid' ? 'Full-access app + priority in-person sessions + weekly calls' :
                          fmt === 'group'  ? 'Full-access app + small-group coaching + weekly calls'   : 'Full-access app + weekly calls + priority support';

  return {
    packages: [
      { tier: 'starter', name: names[0], price_monthly: pricing.starter, tagline: taglines[0], ideal_for: idealFor[0], includes: starterIncludes, delivery_summary: starterDelivery },
      { tier: 'core',    name: names[1], price_monthly: pricing.core,    tagline: taglines[1], ideal_for: idealFor[1], includes: coreIncludes,    delivery_summary: coreDelivery    },
      { tier: 'premium', name: names[2], price_monthly: pricing.premium, tagline: taglines[2], ideal_for: idealFor[2], includes: premiumIncludes, delivery_summary: premDelivery    },
    ],
    strategy_notes: buildStrategyNotes(formData, pricing),
    revenue_projection: {
      starter_clients:       pricing.starterClients,
      core_clients:          pricing.coreClients,
      premium_clients:       pricing.premiumClients,
      total_monthly_revenue: pricing.starterClients * pricing.starter + pricing.coreClients * pricing.core + pricing.premiumClients * pricing.premium,
    },
  };
}

/* ─────────────────────────────────────────────
   HUBSPOT LEAD SUBMISSION
   ───────────────────────────────────────────── */
async function submitToHubSpot(formData) {
  if (!HUBSPOT_PORTAL_ID || HUBSPOT_PORTAL_ID === 'YOUR_PORTAL_ID') {
    console.warn('[FitBudd] HubSpot not configured — set HUBSPOT_PORTAL_ID and HUBSPOT_FORM_GUID at the top of PricingPackageBuilder.jsx.');
    return;
  }

  const nameParts     = formData.name.trim().split(' ');
  const firstName     = nameParts[0] || formData.name;
  const lastName      = nameParts.slice(1).join(' ') || '';
  const formatLabel   = COACHING_FORMATS.find(f => f.id === formData.coachingFormat)?.label  || formData.coachingFormat;
  const expLabel      = EXPERIENCE_LEVELS.find(e => e.id === formData.experienceLevel)?.label || formData.experienceLevel;
  const durationLabel = PROGRAM_DURATIONS.find(d => d.id === formData.programDuration)?.label || formData.programDuration;
  const serviceNames  = SERVICES.filter(s => formData.services.includes(s.id)).map(s => s.label).join('; ');

  const payload = {
    submittedAt: Date.now(),
    fields: [
      { name: 'firstname',               value: firstName },
      { name: 'lastname',                value: lastName },
      { name: 'email',                   value: formData.email },
      { name: 'coaching_format',         value: formatLabel },
      { name: 'fitness_niche',           value: formData.niche },
      { name: 'experience_level',        value: expLabel },
      { name: 'services_offered',        value: serviceNames },
      { name: 'program_duration',        value: durationLabel },
      { name: 'monthly_income_goal',     value: `$${formData.incomeGoal}` },
      { name: 'coaching_hours_per_week', value: formData.hoursPerWeek },
      { name: 'max_clients',             value: String(formData.maxClients) },
    ],
    context: {
      pageUri:  typeof window !== 'undefined' ? window.location.href : '',
      pageName: 'FitBudd Pricing & Package Builder',
    },
  };

  try {
    const res = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );
    if (res.ok) {
      console.log('[FitBudd] Lead submitted to HubSpot.');
    } else {
      const text = await res.text().catch(() => '');
      console.warn('[FitBudd] HubSpot submission failed:', res.status, text);
    }
  } catch (err) {
    console.warn('[FitBudd] HubSpot submission error:', err.message);
  }
}

/* ─────────────────────────────────────────────
   REUSABLE UI COMPONENTS
   ───────────────────────────────────────────── */

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
      <AlertCircle size={13} color="#E53E3E" />
      <span style={{ fontSize: 12, color: '#E53E3E', fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

function ProgressDots({ step, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
      {Array.from({ length: total }).map((_, i) => {
        const active   = i + 1 === step;
        const complete = i + 1 < step;
        return (
          <div
            key={i}
            style={{
              width:  active ? 24 : complete ? 16 : 8,
              height: 8,
              borderRadius: 999,
              background: active ? '#4D6BFE' : complete ? '#4D6BFE' : '#E2E5EA',
              transition: 'all 0.25s ease',
              opacity: complete ? 0.5 : 1,
            }}
          />
        );
      })}
    </div>
  );
}

function PillGroup({ options, value, onChange, error, shaking }) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} className={shaking ? 'fbb-shake' : ''}>
        {options.map(opt => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className="fbb-pill-hover"
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: `1.5px solid ${selected ? '#4D6BFE' : '#E2E5EA'}`,
                background: selected ? '#EEF1FF' : '#fff',
                color: selected ? '#4D6BFE' : '#4A5568',
                fontWeight: selected ? 600 : 400,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.15s',
                minHeight: 44,
                whiteSpace: 'nowrap',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <FieldError msg={error} />}
    </div>
  );
}

function SegmentedControl({ options, value, onChange, error, shaking }) {
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${options.length}, 1fr)`,
          border: '1.5px solid #E2E5EA',
          borderRadius: 10,
          overflow: 'hidden',
          background: '#F7F8FA',
        }}
        className={shaking ? 'fbb-shake' : ''}
      >
        {options.map((opt, i) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              style={{
                padding: '10px 4px',
                border: 'none',
                borderLeft: i > 0 ? '1.5px solid #E2E5EA' : 'none',
                background: selected ? '#4D6BFE' : 'transparent',
                color: selected ? '#fff' : '#4A5568',
                fontWeight: selected ? 600 : 400,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s',
                minHeight: 44,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <FieldError msg={error} />}
    </div>
  );
}

function CheckboxGrid({ options, values, onChange, error, shaking }) {
  const toggle = id => {
    const next = values.includes(id) ? values.filter(v => v !== id) : [...values, id];
    onChange(next);
  };
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '8px 12px',
        }}
        className={shaking ? 'fbb-shake' : ''}
      >
        {options.map(opt => {
          const checked = values.includes(opt.id);
          return (
            <label
              key={opt.id}
              className="fbb-check-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 8,
                border: `1.5px solid ${checked ? '#4D6BFE' : '#E2E5EA'}`,
                background: checked ? '#EEF1FF' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.12s',
                minHeight: 44,
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt.id)}
              />
              <span style={{ fontSize: 13, color: checked ? '#3B57D9' : '#4A5568', fontWeight: checked ? 500 : 400 }}>
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && <FieldError msg={error} />}
    </div>
  );
}

function NumberStepper({ value, onChange, min = 5, max = 100 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid #E2E5EA', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{ width: 44, height: 44, background: '#F7F8FA', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568' }}
      >
        <Minus size={16} />
      </button>
      <span style={{ padding: '0 20px', fontSize: 16, fontWeight: 600, color: '#1A1D23', minWidth: 56, textAlign: 'center', lineHeight: '44px' }}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{ width: 44, height: 44, background: '#F7F8FA', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568' }}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: '#4A5568', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SKELETON LOADER
   ───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ border: '1.5px solid #E8EBF2', borderRadius: 12, padding: '20px 18px', flex: 1, minWidth: 0 }}>
      <div className="fbb-skel" style={{ height: 14, width: '60%', marginBottom: 10 }} />
      <div className="fbb-skel" style={{ height: 28, width: '45%', marginBottom: 14 }} />
      <div className="fbb-skel" style={{ height: 11, width: '80%', marginBottom: 16 }} />
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <div className="fbb-skel" style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0 }} />
          <div className="fbb-skel" style={{ height: 12, width: `${50 + i * 8}%` }} />
        </div>
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="fbb-fadein">
      <div style={{ textAlign: 'center', padding: '20px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 20, height: 20, border: '2.5px solid #E2E5EA', borderTopColor: '#4D6BFE', borderRadius: '50%' }} className="fbb-spin" />
          <span style={{ fontSize: 15, fontWeight: 500, color: '#1A1D23' }}>Building your pricing strategy</span>
        </div>
        <p style={{ fontSize: 13, color: '#718096', margin: 0 }}>Analysing your inputs and generating packages tailored to you</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="fbb-package-grid">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div style={{ marginTop: 20 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <div className="fbb-skel" style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 4, flexShrink: 0 }} />
            <div className="fbb-skel" style={{ height: 12, width: `${55 + i * 7}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PACKAGE CARD
   ───────────────────────────────────────────── */
function PackageCard({ pkg, isHighlighted }) {
  const isBlurred = pkg._blurred;
  return (
    <div
      className={isHighlighted ? 'fbb-card-highlight package-card' : 'package-card'}
      style={{
        borderRadius: 12,
        padding: '20px 18px',
        flex: 1,
        minWidth: 0,
        border: isHighlighted ? 'none' : '1.5px solid #E2E5EA',
        background: isHighlighted ? undefined : '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {isHighlighted && (
        <div style={{ marginBottom: 10 }}>
          <span className="fbb-badge" style={{ background: '#00C48C', color: '#fff' }}>
            <Star size={11} fill="#fff" />
            Most Popular
          </span>
        </div>
      )}
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: isHighlighted ? 'rgba(255,255,255,0.7)' : '#718096' }}>
          {pkg.tier === 'starter' ? 'Starter' : pkg.tier === 'core' ? 'Core' : 'Premium'}
        </span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: isHighlighted ? '#fff' : '#1A1D23', marginBottom: 2 }}>
        {pkg.name}
      </div>
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: isHighlighted ? '#fff' : '#1A1D23' }}>
          ${pkg.price_monthly.toLocaleString()}
        </span>
        <span style={{ fontSize: 13, color: isHighlighted ? 'rgba(255,255,255,0.7)' : '#718096', marginLeft: 3 }}>/mo</span>
      </div>

      <div className={isBlurred ? 'fbb-blur' : ''}>
        <p className="fbb-tagline" style={{ fontSize: 13, color: isHighlighted ? undefined : '#4A5568', marginBottom: 14, lineHeight: 1.5, fontStyle: 'italic' }}>
          {pkg.tagline || ''}
        </p>

        <div style={{ marginBottom: 14 }}>
          {(pkg.includes || []).map((item, i) => (
            <div key={i} className="fbb-include-item" style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
              <Check className="fbb-check-icon" size={14} style={{ flexShrink: 0, marginTop: 2, color: isHighlighted ? '#fff' : '#4D6BFE' }} />
              <span style={{ fontSize: 13, color: isHighlighted ? undefined : '#4A5568', lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: `1px solid ${isHighlighted ? 'rgba(255,255,255,0.2)' : '#EEF1F5'}` }}>
          <div style={{ marginBottom: 6 }}>
            <span className="fbb-ideal-label" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: isHighlighted ? undefined : '#718096' }}>
              Ideal for
            </span>
            <p className="fbb-ideal-text" style={{ fontSize: 12, color: isHighlighted ? undefined : '#4A5568', margin: '3px 0 0', lineHeight: 1.4 }}>
              {pkg.ideal_for || ''}
            </p>
          </div>
          <span className="fbb-meta-chip" style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 6, background: isHighlighted ? undefined : '#F0F3FF', color: isHighlighted ? undefined : '#4D6BFE' }}>
            {pkg.delivery_summary || ''}
          </span>
        </div>
      </div>

      {isBlurred && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 12,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'none',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   REVENUE TABLE
   ───────────────────────────────────────────── */
function RevenueTable({ projection, pricing }) {
  const { starter_clients: sc, core_clients: cc, premium_clients: pc, total_monthly_revenue: total } = projection;
  const starterRev  = sc * pricing.starter;
  const coreRev     = cc * pricing.core;
  const premiumRev  = pc * pricing.premium;
  const names       = ['Starter', 'Core', 'Premium'];
  const clients     = [sc, cc, pc];
  const prices      = [pricing.starter, pricing.core, pricing.premium];
  const revenues    = [starterRev, coreRev, premiumRev];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="fbb-rev-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#F7F8FA' }}>
            <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #E2E5EA' }}>Tier</th>
            <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, fontSize: 12, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #E2E5EA' }}>Clients</th>
            <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, fontSize: 12, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #E2E5EA' }}>Price</th>
            <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, fontSize: 12, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #E2E5EA' }}>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {names.map((name, i) => (
            <tr key={name} style={{ borderBottom: '1px solid #EEF1F5' }}>
              <td style={{ padding: '11px 14px', fontWeight: 500, color: '#1A1D23' }}>{name}</td>
              <td style={{ padding: '11px 14px', textAlign: 'center', color: '#4A5568' }}>{clients[i]}</td>
              <td style={{ padding: '11px 14px', textAlign: 'right', color: '#4A5568' }}>${prices[i].toLocaleString()}</td>
              <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 500, color: '#1A1D23' }}>${revenues[i].toLocaleString()}</td>
            </tr>
          ))}
          <tr style={{ background: '#F7F8FA', fontWeight: 700 }}>
            <td style={{ padding: '11px 14px', color: '#1A1D23', fontWeight: 700 }}>Total</td>
            <td style={{ padding: '11px 14px', textAlign: 'center', color: '#1A1D23', fontWeight: 700 }}>{sc + cc + pc}</td>
            <td style={{ padding: '11px 14px' }} />
            <td style={{ padding: '11px 14px', textAlign: 'right', color: '#4D6BFE', fontWeight: 800, fontSize: 16 }}>${total.toLocaleString()}/mo</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FITBUDD CTA CARD
   ───────────────────────────────────────────── */
const TRIAL_URL  = 'https://www.fitbudd.com/your-brand-awaits-your-app-self-sign-up?utm_source=ai_tool&utm_medium=lead_magnet&utm_campaign=pricing_package_builder&utm_content=bottom_cta';
const SEE_URL    = 'https://www.fitbudd.com?utm_source=ai_tool&utm_medium=lead_magnet&utm_campaign=pricing_package_builder&utm_content=see_how_it_works';

function FitBuddCTA({ ref: fwdRef }) {
  return (
    <div
      ref={fwdRef}
      style={{
        background: 'linear-gradient(135deg,#EEF1FF 0%,#F5F7FF 100%)',
        border: '1.5px solid #D6DCFF',
        borderRadius: 12,
        padding: '24px 22px',
        marginTop: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 10, background: '#4D6BFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingUp size={20} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 700, color: '#1A1D23' }}>
            Ready to sell these packages?
          </h3>
          <p style={{ margin: '0 0 18px', fontSize: 14, color: '#4A5568', lineHeight: 1.6 }}>
            Trainers on FitBudd sell packages directly from their own branded app and website — with zero commission on payments. Set up your packages, automate onboarding, and start collecting payments in minutes.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <a
              href={TRIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#4D6BFE', color: '#fff',
                padding: '11px 22px', borderRadius: 8,
                fontWeight: 600, fontSize: 14,
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              Start Your Free Trial <ArrowRight size={15} />
            </a>
            <a
              href={SEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, color: '#4D6BFE', fontWeight: 500, textDecoration: 'none' }}
            >
              See how it works →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
export default function PricingPackageBuilder() {
  const [step, setStep]               = useState(1);
  const [leaving, setLeaving]         = useState(false);
  const [formData, setFormData]       = useState({
    coachingFormat: '',
    niche: '',
    experienceLevel: '',
    services: [],
    programDuration: '',
    incomeGoal: '',
    hoursPerWeek: '',
    maxClients: 20,
    name: '',
    email: '',
  });
  const [errors, setErrors]           = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [output, setOutput]           = useState(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const ctaRef    = useRef(null);
  const topRef    = useRef(null);
  const styleRef  = useRef(null);

  // Inject global styles once
  useEffect(() => {
    if (styleRef.current) return;
    const tag = document.createElement('style');
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    styleRef.current = tag;
    return () => { if (styleRef.current) { document.head.removeChild(styleRef.current); styleRef.current = null; } };
  }, []);

  // Sticky CTA observer
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || !emailSubmitted) return;
    const obs = new IntersectionObserver(([e]) => setStickyVisible(!e.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [emailSubmitted, output]);

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateStep = s => {
    const e = {};
    if (s === 1) {
      if (!formData.coachingFormat)  e.coachingFormat  = 'Select a coaching format';
      if (!formData.niche)           e.niche           = 'Select your fitness niche';
      if (!formData.experienceLevel) e.experienceLevel = 'Select your experience level';
    } else if (s === 2) {
      if (formData.services.length === 0) e.services       = 'Select at least one service';
      if (!formData.programDuration)      e.programDuration = 'Select a program duration';
    } else if (s === 3) {
      if (!formData.incomeGoal)   e.incomeGoal   = 'Select your income goal';
      if (!formData.hoursPerWeek) e.hoursPerWeek = 'Select your hours per week';
    }
    return e;
  };

  const goNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShakeFields(Object.keys(errs));
      setTimeout(() => setShakeFields([]), 400);
      return;
    }
    setLeaving(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setLeaving(false);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 180);
  };

  const goBack = () => {
    setLeaving(true);
    setTimeout(() => {
      setStep(s => s - 1);
      setLeaving(false);
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 180);
  };

  const handleEmailSubmit = async e => {
    e.preventDefault();
    const nameErr  = !formData.name.trim() ? 'Enter your name' : null;
    const emailErr = !formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ? 'Enter a valid email address' : null;
    if (nameErr || emailErr) {
      setErrors({ name: nameErr, email: emailErr });
      setShakeFields(['name', 'email'].filter(f => (f === 'name' ? nameErr : emailErr)));
      setTimeout(() => setShakeFields([]), 400);
      return;
    }

    setEmailSubmitted(true);
    setLoading(true);

    // Submit lead to HubSpot (fire-and-forget — never blocks the UX)
    submitToHubSpot(formData).catch(() => {});

    // Brief animation window, then generate packages client-side
    await new Promise(r => setTimeout(r, 1400));
    const pricing = calculatePricing(formData);
    setOutput({ ...generatePackages(formData, pricing), pricing });
    setLoading(false);
  };

  // Preview pricing for the blurred teaser in step 4
  const previewPricing = calculatePricing(formData);
  const nicheNames     = NICHE_NAMES[formData.niche] || NICHE_NAMES['Other'];
  const previewPackages = [
    { tier: 'starter', name: nicheNames[0], price_monthly: previewPricing.starter, _blurred: true, tagline: 'Entry-level coaching tailored to your goals.', includes: ['Custom plan', 'Weekly check-ins', 'Progress tracking'], ideal_for: 'Clients ready to start their transformation.', delivery_summary: 'App-based · Weekly check-ins' },
    { tier: 'core',    name: nicheNames[1], price_monthly: previewPricing.core,    _blurred: true, tagline: 'The complete coaching experience.', includes: ['Everything in Starter', 'Nutrition plan', 'Video calls', 'Bi-weekly check-ins'], ideal_for: 'Committed clients who want real accountability.', delivery_summary: 'App + video calls · Bi-weekly' },
    { tier: 'premium', name: nicheNames[2], price_monthly: previewPricing.premium, _blurred: true, tagline: 'High-touch, high-accountability coaching.', includes: ['Everything in Core', 'Weekly calls', 'Unlimited messaging', 'Priority support', 'Bonus resources'], ideal_for: 'Clients who want direct, personal access.', delivery_summary: 'Full-access app + weekly calls' },
  ];

  /* ── Nav bar ── */
  const NavBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 20 }}>
      {step > 1 ? (
        <button
          type="button"
          onClick={goBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: '1.5px solid #E2E5EA', borderRadius: 8,
            padding: '10px 18px', fontSize: 14, fontWeight: 500, color: '#4A5568',
            cursor: 'pointer', minHeight: 44,
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>
      ) : <div />}
      <button
        type="button"
        onClick={goNext}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: '#4D6BFE', border: 'none', borderRadius: 8,
          padding: '10px 22px', fontSize: 14, fontWeight: 600, color: '#fff',
          cursor: 'pointer', minHeight: 44,
          boxShadow: '0 2px 10px rgba(77,107,254,0.28)',
        }}
      >
        Continue <ChevronRight size={16} />
      </button>
    </div>
  );

  /* ── STEP 1 ── */
  const renderStep1 = () => (
    <div className={leaving ? 'fbb-exit' : 'fbb-enter'}>
      <h2 style={{ margin: '0 0 4px', fontSize: 19, fontWeight: 700, color: '#1A1D23' }}>Tell us about your coaching business</h2>
      <p style={{ margin: '0 0 22px', fontSize: 14, color: '#718096' }}>We'll use this to personalise your package recommendations.</p>

      <div style={{ marginBottom: 18 }}>
        <SectionLabel>Coaching format</SectionLabel>
        <PillGroup
          options={COACHING_FORMATS}
          value={formData.coachingFormat}
          onChange={v => update('coachingFormat', v)}
          error={errors.coachingFormat}
          shaking={shakeFields.includes('coachingFormat')}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <SectionLabel>Your fitness niche</SectionLabel>
        <select
          className={`fbb-input fbb-select ${errors.niche ? 'fbb-input-error' : ''}`}
          value={formData.niche}
          onChange={e => update('niche', e.target.value)}
        >
          <option value="">Select your niche</option>
          {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        {errors.niche && <FieldError msg={errors.niche} />}
      </div>

      <div style={{ marginBottom: 6 }}>
        <SectionLabel>Experience level</SectionLabel>
        <PillGroup
          options={EXPERIENCE_LEVELS}
          value={formData.experienceLevel}
          onChange={v => update('experienceLevel', v)}
          error={errors.experienceLevel}
          shaking={shakeFields.includes('experienceLevel')}
        />
      </div>

      <NavBar />
    </div>
  );

  /* ── STEP 2 ── */
  const renderStep2 = () => (
    <div className={leaving ? 'fbb-exit' : 'fbb-enter'}>
      <h2 style={{ margin: '0 0 4px', fontSize: 19, fontWeight: 700, color: '#1A1D23' }}>What do you include in your coaching?</h2>
      <p style={{ margin: '0 0 22px', fontSize: 14, color: '#718096' }}>Select everything you offer — we'll distribute them across your tiers.</p>

      <div style={{ marginBottom: 18 }}>
        <SectionLabel>Services you offer</SectionLabel>
        <CheckboxGrid
          options={SERVICES}
          values={formData.services}
          onChange={v => update('services', v)}
          error={errors.services}
          shaking={shakeFields.includes('services')}
        />
      </div>

      <div style={{ marginBottom: 6 }}>
        <SectionLabel>Typical program duration</SectionLabel>
        <PillGroup
          options={PROGRAM_DURATIONS}
          value={formData.programDuration}
          onChange={v => update('programDuration', v)}
          error={errors.programDuration}
          shaking={shakeFields.includes('programDuration')}
        />
      </div>

      <NavBar />
    </div>
  );

  /* ── STEP 3 ── */
  const renderStep3 = () => (
    <div className={leaving ? 'fbb-exit' : 'fbb-enter'}>
      <h2 style={{ margin: '0 0 4px', fontSize: 19, fontWeight: 700, color: '#1A1D23' }}>Your income & capacity goals</h2>
      <p style={{ margin: '0 0 22px', fontSize: 14, color: '#718096' }}>These numbers drive your pricing recommendations.</p>

      <div style={{ marginBottom: 18 }}>
        <SectionLabel>Monthly income goal</SectionLabel>
        <SegmentedControl
          options={INCOME_GOALS}
          value={formData.incomeGoal}
          onChange={v => update('incomeGoal', v)}
          error={errors.incomeGoal}
          shaking={shakeFields.includes('incomeGoal')}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <SectionLabel>Hours per week for coaching</SectionLabel>
        <SegmentedControl
          options={HOURS_OPTIONS}
          value={formData.hoursPerWeek}
          onChange={v => update('hoursPerWeek', v)}
          error={errors.hoursPerWeek}
          shaking={shakeFields.includes('hoursPerWeek')}
        />
      </div>

      <div style={{ marginBottom: 6 }}>
        <SectionLabel>Max clients you want to manage</SectionLabel>
        <NumberStepper value={formData.maxClients} onChange={v => update('maxClients', v)} min={5} max={100} />
        <p style={{ margin: '5px 0 0', fontSize: 12, color: '#718096' }}>We'll spread clients across your three tiers to hit your income goal.</p>
      </div>

      <NavBar />
    </div>
  );

  /* ── STEP 4 — Email Gate ── */
  const renderStep4 = () => (
    <div className={leaving ? 'fbb-exit' : 'fbb-enter'}>
      <h2 style={{ margin: '0 0 4px', fontSize: 19, fontWeight: 700, color: '#1A1D23' }}>Your packages are ready</h2>
      <p style={{ margin: '0 0 18px', fontSize: 14, color: '#718096' }}>Enter your email to unlock the full pricing strategy — including package names, delivery details, and your revenue projection.</p>

      {/* Blurred preview teaser */}
      <div style={{ marginBottom: 20, position: 'relative' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            pointerEvents: 'none',
          }}
          className="fbb-package-grid"
        >
          {previewPackages.map((pkg, i) => (
            <PackageCard key={i} pkg={pkg} isHighlighted={i === 1} />
          ))}
        </div>
        {/* Fade overlay at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, #F7F8FA, transparent)', borderRadius: '0 0 12px 12px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: 'rgba(247,248,250,0.6)' }}>
          <div style={{ background: '#fff', border: '1.5px solid #E2E5EA', borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarSign size={16} color="#4D6BFE" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1D23' }}>Your pricing strategy is ready</span>
          </div>
        </div>
      </div>

      {/* Email form */}
      <form onSubmit={handleEmailSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            className={`fbb-input ${errors.name ? 'fbb-input-error' : ''} ${shakeFields.includes('name') ? 'fbb-shake' : ''}`}
            placeholder="Your full name"
            value={formData.name}
            onChange={e => update('name', e.target.value)}
            autoComplete="name"
          />
          {errors.name && <FieldError msg={errors.name} />}
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            className={`fbb-input ${errors.email ? 'fbb-input-error' : ''} ${shakeFields.includes('email') ? 'fbb-shake' : ''}`}
            placeholder="Your email address"
            value={formData.email}
            onChange={e => update('email', e.target.value)}
            autoComplete="email"
          />
          {errors.email && <FieldError msg={errors.email} />}
        </div>
        <button
          type="submit"
          style={{
            width: '100%', padding: '13px 20px', background: '#4D6BFE', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
            cursor: 'pointer', minHeight: 48,
            boxShadow: '0 3px 12px rgba(77,107,254,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          Get My Pricing Strategy <ArrowRight size={16} />
        </button>
        <p style={{ margin: '10px 0 0', fontSize: 12, color: '#718096', textAlign: 'center' }}>
          Free. No spam. Unsubscribe anytime.
        </p>
      </form>

      <div style={{ marginTop: 14 }}>
        <button
          type="button"
          onClick={goBack}
          style={{ background: 'none', border: 'none', color: '#718096', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}
        >
          <ChevronLeft size={14} /> Back
        </button>
      </div>
    </div>
  );

  /* ── OUTPUT SCREEN ── */
  const renderOutput = () => {
    if (loading) return <LoadingState />;

    if (!output) return null;

    const { packages, strategy_notes, revenue_projection, pricing } = output;
    const midTierPrice  = pricing.core;
    const totalClients  = pricing.starterClients + pricing.coreClients + pricing.premiumClients;
    const projected     = revenue_projection.total_monthly_revenue;

    return (
      <div className="fbb-fadein">
        {/* Summary banner */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
          {[
            { icon: <DollarSign size={16} color="#4D6BFE" />, label: 'Recommended range', value: `$${pricing.starter.toLocaleString()} – $${pricing.premium.toLocaleString()}/mo` },
            { icon: <Users size={16} color="#4D6BFE" />,      label: 'Ideal capacity',    value: `${totalClients} clients` },
            { icon: <TrendingUp size={16} color="#00C48C" />,  label: 'Projected revenue', value: `$${projected.toLocaleString()}/mo` },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                flex: '1 1 160px',
                background: '#fff',
                border: '1.5px solid #E2E5EA',
                borderRadius: 10,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 8, background: '#F0F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#718096', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D23', marginTop: 1 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Package cards */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4A5568', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Your Three-Tier Package Structure</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="fbb-package-grid">
            {packages.map((pkg, i) => (
              <PackageCard key={pkg.tier} pkg={pkg} isHighlighted={i === 1} />
            ))}
          </div>
        </div>

        {/* Strategy notes */}
        <div style={{ marginTop: 24, marginBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4A5568', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Pricing Strategy Notes</div>
          <div style={{ background: '#fff', border: '1.5px solid #E2E5EA', borderRadius: 12, padding: '16px 18px' }}>
            {(strategy_notes || []).map((note, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < strategy_notes.length - 1 ? 14 : 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#EEF1FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#4D6BFE' }}>{i + 1}</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: '#4A5568', lineHeight: 1.65 }}>{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue projection */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#4A5568', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Revenue Projection</div>
          <div style={{ background: '#fff', border: '1.5px solid #E2E5EA', borderRadius: 12, overflow: 'hidden' }}>
            <RevenueTable projection={revenue_projection} pricing={pricing} />
          </div>
          {projected < parseInt(formData.incomeGoal) && (
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#718096' }}>
              Tip: to hit your ${parseInt(formData.incomeGoal).toLocaleString()} goal, consider adding {Math.ceil((parseInt(formData.incomeGoal) - projected) / pricing.core)} more core clients or raising your core price by ${Math.round((parseInt(formData.incomeGoal) - projected) / pricing.coreClients / 10) * 10}.
            </p>
          )}
        </div>

        {/* FitBudd CTA */}
        <div ref={ctaRef}>
          <FitBuddCTA />
        </div>

        {/* Restart */}
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setEmailSubmitted(false);
              setOutput(null);
              setErrors({});
              setFormData({ coachingFormat: '', niche: '', experienceLevel: '', services: [], programDuration: '', incomeGoal: '', hoursPerWeek: '', maxClients: 20, name: '', email: '' });
            }}
            style={{ background: 'none', border: 'none', color: '#718096', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Start over with different inputs
          </button>
        </div>
      </div>
    );
  };

  const STEP_LABELS = ['Coaching Profile', 'Services', 'Goals', 'Unlock'];

  return (
    <div
      className="fbb"
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: 0,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Tool container — visible boundary on white pages */}
      <div
        style={{
          background: '#F7F8FA',
          border: '1px solid #E2E5EA',
          borderRadius: 16,
          padding: '24px 22px',
          boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
        }}
      >
        <div ref={topRef} />

        {!emailSubmitted ? (
          <>
            {/* Step indicator */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#718096', fontWeight: 500 }}>
                  Step {step} of 4 — <strong style={{ color: '#4D6BFE' }}>{STEP_LABELS[step - 1]}</strong>
                </span>
                <span style={{ fontSize: 12, color: '#718096' }}>{Math.round((step / 4) * 100)}% complete</span>
              </div>
              {/* Progress bar */}
              <div style={{ height: 4, background: '#E2E5EA', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(step / 4) * 100}%`, background: '#4D6BFE', borderRadius: 999, transition: 'width 0.3s ease' }} />
              </div>
            </div>

            {/* Step content */}
            <div style={{ marginTop: 20 }}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </div>
          </>
        ) : (
          <>
            {/* Output header */}
            {!loading && output && (
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1.5px solid #E2E5EA' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#00C48C', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Your custom pricing strategy
                </div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1A1D23' }}>
                  Pricing packages for {formData.name?.split(' ')[0] || 'your'} coaching business
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#718096' }}>
                  Based on your {formData.niche} focus · {formData.experienceLevel} trainer · ${parseInt(formData.incomeGoal).toLocaleString()}/mo goal
                </p>
              </div>
            )}

            {renderOutput()}
          </>
        )}
      </div>

      {/* Sticky mobile CTA */}
      {stickyVisible && emailSubmitted && !loading && output && (
        <div className="fbb-sticky no-print">
          <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1D23' }}>Ready to sell these packages?</span>
          <a
            href={TRIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#4D6BFE', color: '#fff',
              padding: '9px 18px', borderRadius: 8,
              fontWeight: 600, fontSize: 13,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Start Free Trial <ArrowRight size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
