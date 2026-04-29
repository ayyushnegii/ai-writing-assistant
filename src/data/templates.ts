export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  taskExample: string;
  icon: string;
}

export const templates: Template[] = [
  // Writing & Content
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Generate a complete blog post with introduction, body, and conclusion',
    category: 'Writing & Content',
    taskExample: 'Write a blog post about the benefits of remote work, targeting startup founders',
    icon: '📝',
  },
  {
    id: 'email-newsletter',
    name: 'Email Newsletter',
    description: 'Create engaging newsletter content for your subscribers',
    category: 'Writing & Content',
    taskExample: 'Write a weekly newsletter about AI trends, including 3 main stories and a tip',
    icon: '📧',
  },
  {
    id: 'social-media-post',
    name: 'Social Media Post',
    description: 'Craft engaging posts for Twitter, LinkedIn, or Instagram',
    category: 'Writing & Content',
    taskExample: 'Write a LinkedIn post announcing our new product launch, professional tone',
    icon: '💬',
  },
  {
    id: 'product-description',
    name: 'Product Description',
    description: 'Write compelling product descriptions that convert',
    category: 'Writing & Content',
    taskExample: 'Write a product description for wireless noise-canceling headphones, focus on benefits',
    icon: '🛍️',
  },

  // Business & Professional
  {
    id: 'professional-email',
    name: 'Professional Email',
    description: 'Draft professional emails for any business scenario',
    category: 'Business & Professional',
    taskExample: 'Write an email to decline a meeting invitation while keeping the relationship warm',
    icon: '✉️',
  },
  {
    id: 'meeting-agenda',
    name: 'Meeting Agenda',
    description: 'Create structured meeting agendas with time allocations',
    category: 'Business & Professional',
    taskExample: 'Create an agenda for a sprint planning meeting with 5 team members',
    icon: '📋',
  },
  {
    id: 'project-proposal',
    name: 'Project Proposal',
    description: 'Write persuasive project proposals with objectives and timelines',
    category: 'Business & Professional',
    taskExample: 'Write a proposal to upgrade our company\'s CRM system, include ROI estimates',
    icon: '📊',
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter',
    description: 'Generate tailored cover letters for job applications',
    category: 'Business & Professional',
    taskExample: 'Write a cover letter for a Senior Developer role at a fintech startup',
    icon: '📄',
  },

  // Creative & Marketing
  {
    id: 'ad-copy',
    name: 'Ad Copy',
    description: 'Create compelling ad copy for Google, Facebook, or LinkedIn ads',
    category: 'Creative & Marketing',
    taskExample: 'Write Facebook ad copy for an online course about digital marketing, focus on urgency',
    icon: '🎯',
  },
  {
    id: 'landing-page',
    name: 'Landing Page Copy',
    description: 'Write persuasive landing page headlines and body copy',
    category: 'Creative & Marketing',
    taskExample: 'Write hero section copy for a SaaS project management tool, emphasize speed',
    icon: '🚀',
  },
  {
    id: 'video-script',
    name: 'Video Script',
    description: 'Create scripts for YouTube videos, TikTok, or Instagram Reels',
    category: 'Creative & Marketing',
    taskExample: 'Write a 60-second YouTube script about productivity hacks for developers',
    icon: '🎥',
  },
  {
    id: 'press-release',
    name: 'Press Release',
    description: 'Draft professional press releases for company announcements',
    category: 'Creative & Marketing',
    taskExample: 'Write a press release about our company raising $5M in Series A funding',
    icon: '📰',
  },

  // Technical & Developer
  {
    id: 'technical-docs',
    name: 'Technical Documentation',
    description: 'Write clear technical documentation and API references',
    category: 'Technical & Developer',
    taskExample: 'Write API documentation for a user authentication endpoint',
    icon: '💻',
  },
  {
    id: 'code-comments',
    name: 'Code Comments & Docs',
    description: 'Generate clear code comments and documentation strings',
    category: 'Technical & Developer',
    taskExample: 'Write JSDoc comments for a function that validates email addresses',
    icon: '📑',
  },
  {
    id: 'bug-report',
    name: 'Bug Report',
    description: 'Write detailed bug reports with steps to reproduce',
    category: 'Technical & Developer',
    taskExample: 'Write a bug report for login failure on mobile devices',
    icon: '🐛',
  },
  {
    id: 'git-commit',
    name: 'Git Commit Messages',
    description: 'Generate conventional commit messages from code changes',
    category: 'Technical & Developer',
    taskExample: 'Write a commit message for adding user authentication feature',
    icon: '🌳',
  },

  // Education & Learning
  {
    id: 'lesson-plan',
    name: 'Lesson Plan',
    description: 'Create structured lesson plans with objectives and activities',
    category: 'Education & Learning',
    taskExample: 'Create a 45-minute lesson plan about photosynthesis for 7th graders',
    icon: '🎓',
  },
  {
    id: 'study-guide',
    name: 'Study Guide',
    description: 'Generate comprehensive study guides for any topic',
    category: 'Education & Learning',
    taskExample: 'Create a study guide for the JavaScript fundamentals chapter',
    icon: '📚',
  },
  {
    id: 'quiz-questions',
    name: 'Quiz Questions',
    description: 'Generate quiz questions with multiple choice answers',
    category: 'Education & Learning',
    taskExample: 'Create 10 multiple-choice questions about World War II',
    icon: '❓',
  },
];

export const categories = [...new Set(templates.map(t => t.category))];
