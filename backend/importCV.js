const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const CourseCertification = require('./models/CourseCertification');

dotenv.config();

const skills = [
  // Programming
  { name: 'Python', category: 'Programming', level: 'Expert', description: 'Core language for AI, Backend, and Automation.' },
  { name: 'JavaScript', category: 'Programming', level: 'Expert', description: 'Full-stack development with Node.js and React.' },
  { name: 'TypeScript', category: 'Programming', level: 'Advanced', description: 'Typed JavaScript for scalable applications.' },

  // AI/ML
  { name: 'Machine Learning', category: 'AI/ML', level: 'Expert', description: 'Supervised, Unsupervised, and Deep Learning models.' },
  { name: 'Deep Learning', category: 'AI/ML', level: 'Advanced', description: 'Neural Networks, CNNs, and RNNs.' },
  { name: 'Natural Language Processing', category: 'AI/ML', level: 'Expert', description: 'Text analysis, sentiment, and LLM integrations.' },
  { name: 'Computer Vision', category: 'AI/ML', level: 'Intermediate', description: 'Image processing and object detection.' },
  { name: 'Large Language Models (LLMs)', category: 'AI/ML', level: 'Expert', description: 'OpenAI, LangChain, Llama, and fine-tuning.' },
  { name: 'RAG Systems', category: 'AI/ML', level: 'Expert', description: 'Retrieval-Augmented Generation for specialized knowledge.' },

  // Backend & APIs
  { name: 'FastAPI', category: 'Backend', level: 'Expert', description: 'High-performance Python web APIs.' },
  { name: 'Node.js', category: 'Backend', level: 'Expert', description: 'Scalable backend services.' },
  { name: 'Express.js', category: 'Backend', level: 'Expert', description: 'Web application framework for Node.js.' },
  { name: 'MongoDB', category: 'Database', level: 'Advanced', description: 'NoSQL database for flexible data modeling.' },
  { name: 'PostgreSQL', category: 'Database', level: 'Advanced', description: 'Relational database for structured data.' },

  // Frontend
  { name: 'React', category: 'Frontend', level: 'Expert', description: 'Building modern, interactive user interfaces.' },
  { name: 'Next.js', category: 'Frontend', level: 'Advanced', description: 'Server-side rendering and static site generation.' },
  { name: 'Tailwind CSS', category: 'Frontend', level: 'Expert', description: 'Utility-first CSS framework for rapid UI development.' },

  // Automation & Tools
  { name: 'AI Voice Agents', category: 'Automation', level: 'Expert', description: 'Automated voice interactions with Vapi, Retell, and Twilio.' },
  { name: 'Zapier / Make.com', category: 'Automation', level: 'Expert', description: 'Workflow automation and tool integration.' },
  { name: 'Docker', category: 'DevOps', level: 'Advanced', description: 'Containerization for consistent deployment.' },
  { name: 'Git / GitHub', category: 'Tools', level: 'Expert', description: 'Version control and collaboration.' }
];

const projects = [
  {
    title: 'AI Voice Receptionist',
    description: 'A fully automated AI voice agent capable of handling customer calls, scheduling appointments, and answering queries in real-time using Vapi and Twilio.',
    techStack: ['Python', 'Vapi', 'Twilio', 'OpenAI'],
    githubUrl: 'https://github.com/masadjamil',
    demoUrl: 'https://vapi.ai',
    featured: true
  },
  {
    title: 'Multi-Agent RAG System',
    description: 'An advanced RAG system utilizing multiple specialized AI agents to process large document sets and provide accurate, context-aware answers.',
    techStack: ['LangChain', 'OpenAI', 'Pinecone', 'FastAPI'],
    githubUrl: 'https://github.com/masadjamil',
    demoUrl: 'https://langchain.com',
    featured: true
  },
  {
    title: 'Smart AI CRM',
    description: 'An AI-powered CRM with integrated voice agents, automated lead scoring, and personalized email outreach systems.',
    techStack: ['React', 'Node.js', 'MongoDB', 'OpenAI'],
    githubUrl: 'https://github.com/masadjamil',
    demoUrl: 'http://localhost:3000/demo',
    featured: true
  },
  {
    title: 'Automated Content Generator',
    description: 'An AI tool that generates SEO-optimized blog posts and social media content based on simple keywords and trends.',
    techStack: ['Next.js', 'Python', 'OpenAI', 'Tailwind'],
    githubUrl: 'https://github.com/masadjamil',
    demoUrl: 'https://openai.com',
    featured: false
  }
];

const certificates = [
  {
    title: 'Machine Learning Specialization',
    provider: 'DeepLearning.AI',
    type: 'Certification',
    date: new Date('2024-01-15'),
    description: 'Comprehensive specialization covering Supervised Learning, Advanced Learning Algorithms, and Unsupervised Learning.',
    skillsLearnt: ['Neural Networks', 'Decision Trees', 'Recommender Systems'],
    credentialId: 'ML-123456'
  },
  {
    title: 'AI Automation Engineering',
    provider: 'AI Academy',
    type: 'Certification',
    date: new Date('2024-02-20'),
    description: 'Advanced course on building AI agents, workflow automation, and integrating LLMs into business processes.',
    skillsLearnt: ['LangChain', 'Zapier', 'Make.com', 'AutoGPT'],
    credentialId: 'AUTO-789012'
  },
  {
    title: 'Full Stack Web Development',
    provider: 'Meta',
    type: 'Course',
    date: new Date('2023-11-10'),
    description: 'Professional certificate covering front-end and back-end development using React and Node.js.',
    skillsLearnt: ['React', 'Node.js', 'Express', 'MongoDB'],
    credentialId: 'META-345678'
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Import...');

    // Get existing data to avoid duplicates
    const existingSkills = await Skill.find({}, 'name');
    const existingProjects = await Project.find({}, 'title');
    const existingCerts = await CourseCertification.find({}, 'title');

    const existingSkillNames = existingSkills.map(s => s.name.toLowerCase());
    const existingProjectTitles = existingProjects.map(p => p.title.toLowerCase());
    const existingCertTitles = existingCerts.map(c => c.title.toLowerCase());

    // Filter out duplicates
    const newSkills = skills.filter(s => !existingSkillNames.includes(s.name.toLowerCase()));
    const newProjects = projects.filter(p => !existingProjectTitles.includes(p.title.toLowerCase()));
    const newCerts = certificates.filter(c => !existingCertTitles.includes(c.title.toLowerCase()));

    if (newSkills.length > 0) {
      await Skill.insertMany(newSkills);
      console.log(`${newSkills.length} New Skills Imported!`);
    } else {
      console.log('No new skills to import.');
    }

    if (newProjects.length > 0) {
      await Project.insertMany(newProjects);
      console.log(`${newProjects.length} New Projects Imported!`);
    } else {
      console.log('No new projects to import.');
    }

    if (newCerts.length > 0) {
      await CourseCertification.insertMany(newCerts);
      console.log(`${newCerts.length} New Certificates Imported!`);
    } else {
      console.log('No new certificates to import.');
    }

    console.log('Data import process completed.');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
