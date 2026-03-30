const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Journey = require('../models/Journey');

dotenv.config({ path: '../.env' });

const timelineEvents = [
    {
        date: '2022',
        title: 'Started Learning ML',
        description: 'Began my journey into Machine Learning & AI fundamentals, mastering core concepts and frameworks.',
        icon: 'FaCode',
        color: 'from-blue-500 to-cyan-400',
        order: 0
    },
    {
        date: '2023',
        title: 'Advanced AI Projects',
        description: 'Continued deep diving into ML, building initial AI projects and exploring real-world applications.',
        icon: 'FaRobot',
        color: 'from-indigo-500 to-blue-500',
        order: 1
    },
    {
        date: '2024 - 2025',
        title: 'Freelance AI Development',
        description: 'Worked on diverse freelance AI projects specializing in LLMs, FastAPI, and complex automation systems.',
        icon: 'FaBriefcase',
        color: 'from-purple-500 to-indigo-500',
        order: 2
    },
    {
        date: '2024 - 2025',
        title: 'Smart AI CRM',
        description: 'Architected and built a Smart AI CRM with advanced voice agent capabilities and end-to-end automation.',
        icon: 'FaMicrophone',
        color: 'from-blue-600 to-indigo-600',
        order: 3
    },
    {
        date: '2025',
        title: 'FairHire AI Job Portal',
        description: 'Developed FairHire, an AI-driven job portal featuring intelligent resume parsing and automated matching.',
        icon: 'FaRocket',
        color: 'from-green-500 to-emerald-400',
        order: 4
    },
    {
        date: '2025',
        title: 'Professional AI Developer',
        description: 'Worked as an AI Developer at ITGenics and Nextbridge, successfully deploying real-world AI systems at scale.',
        icon: 'FaBriefcase',
        color: 'from-indigo-600 to-purple-600',
        order: 5
    },
    {
        date: 'Present',
        title: 'AI Automation Engineer',
        description: 'Building production-level AI systems including voice agents, chatbots, and advanced automation workflows.',
        icon: 'FaRobot',
        color: 'from-blue-500 to-purple-500',
        order: 6
    }
];

const seedJourney = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        await Journey.deleteMany();
        console.log('Old Journey Data Removed...');

        await Journey.insertMany(timelineEvents);
        console.log('Journey Data Seeded Successfully!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedJourney();
