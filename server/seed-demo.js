// seed-demo.js — fills the site with editable demo content for the CMS.
// Run it whenever you want to reset the demo data:
//   node seed-demo.js                      (local server, http://localhost:5000)
//   $env:API_URL="https://your-api.vercel.app/api"; node seed-demo.js
// (Requires a running server — local or deployed. The script logs in as admin.)
// IMPORTANT: everything here is a starting point. You can change it all from
// the admin dashboard — this script just gets you a complete site quickly.

const BASE = process.env.API_URL || 'http://localhost:5000/api';

async function req(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

async function clearAll(token, name) {
  const all = await req('/' + name, { token });
  for (const item of all) await req('/' + name + '/' + item.id, { method: 'DELETE', token });
}

async function createMany(token, name, items) {
  for (const item of items) await req('/' + name, { method: 'POST', token, body: item });
  console.log(name + ':', items.length);
}

async function main() {
  const { token } = await req('/auth/login', {
    method: 'POST',
    body: { username: 'admin', password: 'admin123' },
  });
  console.log('Logged in.');

  // ---- profile ------------------------------------------------------------
  await req('/profile', {
    method: 'PUT',
    token,
    body: {
      name: 'Rohit Walankikar',
      title: 'Real Estate Business Coordinator',
      headline: 'Driving sales growth & operations excellence in real estate',
      intro:
        "I help buyers, sellers and developers move deals forward smoothly — from registration and banking to possession. 5+ years coordinating real estate operations.",
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      cover_image: img('1600596542815-ffad4c1539a9'),
      about_image: img('1560448204-e02f11c3d0e2'),
      bio:
        "With over five years in the real estate industry, I've coordinated end-to-end operations for a leading developer — managing presales and CRM teams, banking relations, legal and registration processes, marketing campaigns and post-sales support.\n\nI've built reporting systems that track targets, collections and sales on a daily basis, and I still work hands-on with teams to make sure every customer query is resolved on time.\n\nMy earlier stints at Samsung and L&T Finance taught me retail discipline and channel sales — skills I now apply to real estate.",
      about_title: 'Turning operations into results',
      highlights:
        '5+ years in real estate operations\nPresales, CRM & sales team management\nBanking, legal & registration coordination\nMIS, reporting & advanced Excel\nMarketing & lead generation',
      experience: '5+ years',
      hero_heading: '',
      hero_subheading: '',
      hero_description: '',
      btn_primary_text: 'My experience',
      btn_primary_link: '#experience',
      btn_secondary_text: 'Let\u2019s talk',
      btn_secondary_link: '#contact',
      email: 'walankikarrohit@gmail.com',
      phone: '+91 7030 748222',
      location: 'Pune, Maharashtra, India',
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
    },
  });
  console.log('Profile updated.');

  // ---- experiences --------------------------------------------------------
  await clearAll(token, 'experiences');

  const experiences = [
    {
      company: 'XRBIA Developers',
      designation: 'Real Estate Business Coordinator',
      start_date: 'May 2023',
      end_date: 'Present',
      description:
        'Running end-to-end sales operations for a residential developer — from lead to possession.',
      responsibilities:
        'Manage presales, CRM and sales officer teams and daily sales follow-ups\nHandle banking relations, loan processing, legal & registration\nCoordinate marketing campaigns and lead generation\nBuild MIS reports on targets, collections and sales',
      achievements:
        'Implemented Salesforce end-to-end for presales & CRM\nBuilt a bank empanelment system that cut home-loan turnaround time\nDigitised marketing and MIS reporting with advanced Excel automation',
      team_handled: 'Presales & CRM teams',
      business_handled: 'End-to-end sales operations',
      sort_order: 0,
    },
    {
      company: 'Samsung',
      designation: 'Sales Executive — SEC',
      start_date: '2021',
      end_date: '2023',
      description:
        'Retail and channel sales for consumer electronics — achieving monthly, quarterly and annual targets.',
      responsibilities:
        'Drive retail sales and channel partner engagement\nTrack stock, promotions and market trends\nReport daily sales numbers and close deals',
      achievements:
        'Consistently achieved sales targets across cycles',
      team_handled: '',
      business_handled: 'Retail & channel sales',
      sort_order: 1,
    },
    {
      company: 'L&T Finance',
      designation: 'Sales Officer',
      start_date: '2019',
      end_date: '2021',
      description:
        'Customer acquisition for finance products, building strong relationships with dealers and channel partners.',
      responsibilities:
        'Acquire customers and grow a referral network\nManage documentation and loan processing\nSupport collection and target delivery',
      achievements:
        'Achieved company-level monthly, quarterly and annual targets',
      team_handled: '',
      business_handled: 'Customer acquisition',
      sort_order: 2,
    },
  ];
  await createMany(token, 'experiences', experiences);

  // ---- expertise ----------------------------------------------------------
  await clearAll(token, 'expertise');

  const expertise = [
    { name: 'Sales Management', description: 'Planning, tracking and closing sales through structured processes.', category: 'Sales', icon: 'target', sort_order: 0 },
    { name: 'Team Leadership', description: 'Building and leading presales, CRM and sales teams.', category: 'Leadership', icon: 'users', sort_order: 1 },
    { name: 'Business Development', description: 'New channels, partnerships and market expansion.', category: 'Sales', icon: 'trending-up', sort_order: 2 },
    { name: 'MIS & Reporting', description: 'Daily, weekly and monthly dashboards for sales and collections.', category: 'Operations', icon: 'bar-chart', sort_order: 3 },
    { name: 'Advanced Excel', description: 'Automation, formulas and dashboards that save hours every day.', category: 'Operations', icon: 'line-chart', sort_order: 4 },
    { name: 'CRM (Salesforce)', description: 'CRM setup, rollout and disciplined usage across teams.', category: 'Technology', icon: 'clipboard', sort_order: 5 },
    { name: 'Banking & Legal', description: 'Loan processing, registration and legal coordination.', category: 'Operations', icon: 'shield', sort_order: 6 },
    { name: 'Marketing & Strategy', description: 'Campaigns and positioning that feed the sales funnel.', category: 'Sales', icon: 'lightbulb', sort_order: 7 },
  ];
  await createMany(token, 'expertise', expertise);

  // ---- metrics (real numbers only — update these from the admin) ------------
  await clearAll(token, 'metrics');

  const metrics = [
    { value: '5+', label: 'Years experience', description: 'In real estate operations and sales.', icon: 'trending-up', sort_order: 0 },
    { value: '3', label: 'Industries', description: 'Real estate, consumer electronics and finance.', icon: 'briefcase', sort_order: 1 },
    { value: '4', label: 'Verticals handled', description: 'Banking, legal, marketing and MIS.', icon: 'clipboard', sort_order: 2 },
  ];
  await createMany(token, 'metrics', metrics);

  // ---- achievements ---------------------------------------------------------
  await clearAll(token, 'achievements');

  const achievements = [
    { title: 'Bank empanelment system', description: 'Built and implemented a system that reduced home-loan turnaround time for customers.', image_url: img('1554224155-6726b3ff858f'), sort_order: 0 },
    { title: 'Salesforce rollout', description: 'Implemented Salesforce end-to-end for presales and CRM at XRBIA.', image_url: img('1551288049-bebda4e38f71'), sort_order: 1 },
    { title: 'Excel-driven MIS', description: 'Digitised marketing and MIS reporting with automation that saves hours daily.', image_url: img('1553729459-efe14ef6055d'), sort_order: 2 },
    { title: 'Target delivery', description: 'Achieved company-level monthly, quarterly and annual targets at L&T Finance.', image_url: '', sort_order: 3 },
  ];
  await createMany(token, 'achievements', achievements);

  // ---- certifications (left empty — add yours from the admin) ----------------
  await clearAll(token, 'certifications');
  console.log('certifications: 0 (add from the admin dashboard)');

  // ---- testimonials ----------------------------------------------------------
  await clearAll(token, 'testimonials');

  const testimonials = [
    { name: 'Meera Deshmukh', role: 'Home Buyer', company: 'Pune', content: 'Rohit handled everything from loan approval to registration. Our possession was smooth and completely stress-free.', rating: 5, sort_order: 0 },
    { name: 'Vikram Shah', role: 'Business Head', company: 'XRBIA Developers', content: 'One person who always keeps targets, timelines and reports in order. An asset to any real estate business.', rating: 5, sort_order: 1 },
    { name: 'Anita Kulkarni', role: 'Branch Manager', company: 'A leading bank', content: 'Professional, prompt and extremely well organised. A pleasure to coordinate with on every single case.', rating: 4, sort_order: 2 },
    { name: 'Rahul Patil', role: 'Sales Executive', company: 'XRBIA Developers', content: 'Rohit made our CRM simple to use and kept the whole sales team on track with clear daily reports.', rating: 5, sort_order: 3 },
  ];
  await createMany(token, 'testimonials', testimonials);

  // ---- articles ---------------------------------------------------------------
  await clearAll(token, 'articles');

  const articles = [
    {
      title: 'How to Evaluate a Property Before You Invest',
      category: 'Investing',
      article_date: '2 Aug 2026',
      cover_image: img('1560518883-ce09059eeffa'),
      published: true,
      content:
        'Before you sign anything, check the essentials.\n\n# Title and approvals\nMake sure the title is clean and all approvals — RERA, sanction plans, IOD/CC — are in place. A seller who hesitates on paperwork is a red flag.\n\n# Track record\nAsk about project delivery history. Past possessions matter more than glossy brochures.\n\n# The numbers\nCompare the price with recent registrations in the same locality, not just the quoted rate.\n\nTake a checklist, visit the site twice (weekday and weekend) and talk to residents, not just the sales team.',
      sort_order: 0,
    },
    {
      title: 'Why CRM Discipline Wins You Deals',
      category: 'Sales',
      article_date: '19 Jul 2026',
      cover_image: img('1551288049-bebda4e38f71'),
      published: true,
      content:
        'Most sales teams lose deals in the follow-up, not in the pitch.\n\n# One source of truth\nKeep every lead, call and follow-up in one CRM. When a customer calls back, your team should know their full story in seconds.\n\n# Follow the numbers\nTrack calls made, meetings done and conversions weekly. The dashboard tells you which stage of the funnel needs attention.\n\n# Close the loop\nA customer who is never called back is a customer you paid to acquire. Set reminders, stick to them.\n\nDiscipline in the CRM is what separates consistent achievers from one-off winners.',
      sort_order: 1,
    },
    {
      title: 'The Art of the Follow-Up in Real Estate',
      category: 'Sales',
      article_date: '28 Jun 2026',
      cover_image: img('1556761175-4b46a572b786'),
      published: true,
      content:
        'In real estate, the first meeting starts the relationship — the follow-ups close it.\n\n# Be useful, not pushy\nShare something relevant: a price update, a financing tip, a new launch. Value keeps you top of mind.\n\n# Have a rhythm\nCall after three days, then a week, then monthly. Consistent, respectful contact builds trust.\n\n# Know the objection\nWhen a buyer goes quiet, find out why — budget, timing, family? Address the real objection.\n\nGreat follow-up is simply great listening, repeated.',
      sort_order: 2,
    },
  ];
  await createMany(token, 'articles', articles);

  // ---- gallery (left empty — add photos from the admin) ------------------------
  await clearAll(token, 'gallery');
  console.log('gallery: 0 (add photos from the admin dashboard)');

  console.log('\nDone! Refresh the public site at http://localhost:5173');
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
