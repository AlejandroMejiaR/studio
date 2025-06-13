
import type { Project } from '@/types';
import { getSupabaseImageUrl } from '@/lib/supabase';

export const projects: Project[] = [
  {
    id: 'project-showcase-platform',
    slug: 'project-showcase-platform',
    title: 'Interactive Project Showcase',
    category: 'Web Development',
    date: 'Summer 2023',
    shortDescription: 'A dynamic platform for creatives to showcase their work with interactive elements and rich media.',
    thumbnailUrl: getSupabaseImageUrl('project1', '011_lighting_AlejandroMejia.png'),
    dataAiHint: 'abstract portfolio',
    bannerUrl: getSupabaseImageUrl('project1', '011_lighting_AlejandroMejia.png'),
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Framer Motion', 'Supabase'],
    problemStatement: "Artists and designers needed a more engaging way to present their portfolios online, moving beyond static images and text. Traditional portfolio sites often lack interactivity and fail to convey the depth of creative projects.",
    solutionOverview: "Developed a web platform allowing users to create rich, interactive project showcases. Features include embedded videos, 3D model viewers, and custom animations, all managed through an intuitive dashboard.",
    keyFeatures: [
      { title: 'Dynamic Content Embedding', description: 'Easily embed videos, audio, and interactive media.', icon: 'Briefcase' },
      { title: 'Real-time Collaboration', description: 'Allow team members to co-edit project showcases.', icon: 'Zap' },
      { title: 'Analytics Dashboard', description: 'Track views, engagement, and user interactions for each project.', icon: 'BarChart3' },
    ],
    galleryImages: [
      getSupabaseImageUrl('project1', '011_lighting_AlejandroMejia.png'),
      'https://placehold.co/800x600/41A693/F2F2F2.png?text=Gallery+1.2',
      'https://placehold.co/800x600/194039/F2F2F2.png?text=Gallery+1.3',
      'https://placehold.co/800x600/122624/FFFFFF.png?text=Gallery+1.4',
      'https://placehold.co/800x600/277365/EEEEEE.png?text=Gallery+1.5',
    ],
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'eco-tracker-mobile-app',
    slug: 'eco-tracker-mobile-app',
    title: 'EcoTracker Mobile App',
    category: 'Mobile Development',
    date: 'Spring 2023',
    shortDescription: 'A mobile application to help users track and reduce their carbon footprint through daily habits.',
    thumbnailUrl: 'https://placehold.co/600x400/277365/F2F2F2.png?text=Project+2',
    dataAiHint: 'mobile app',
    bannerUrl: 'https://placehold.co/1200x400/277365/F2F2F2.png?text=EcoTracker+Banner',
    technologies: ['React Native', 'Firebase', 'GraphQL', 'Node.js'],
    problemStatement: "Growing environmental concerns highlight the need for tools that empower individuals to make sustainable choices. Many people are unaware of their environmental impact or lack guidance on how to improve.",
    solutionOverview: "Designed and built a cross-platform mobile app that allows users to log activities, calculate their carbon footprint, and receive personalized tips for a greener lifestyle. Incorporated gamification and community features to encourage engagement.",
    keyFeatures: [
      { title: 'Carbon Footprint Calculator', description: 'Accurately estimates CO2 emissions based on user input.', icon: 'Briefcase' },
      { title: 'Personalized Eco-Tips', description: 'Provides actionable advice tailored to user habits.', icon: 'Zap' },
      { title: 'Community Challenges', description: 'Engage with friends in friendly environmental competitions.', icon: 'BarChart3' },
    ],
    galleryImages: [
      'https://placehold.co/800x600/122624/F2F2F2.png?text=Gallery+2.1',
      'https://placehold.co/800x600/41A693/F2F2F2.png?text=Gallery+2.2',
      'https://placehold.co/800x600/277365/FFFFFF.png?text=Gallery+2.3',
      'https://placehold.co/800x600/194039/EEEEEE.png?text=Gallery+2.4',
    ],
    liveUrl: '#',
  },
  {
    id: 'ai-powered-data-analyzer',
    slug: 'ai-powered-data-analyzer',
    title: 'AI Data Analyzer',
    category: 'AI/Machine Learning',
    date: 'Fall 2022',
    shortDescription: 'An AI-driven tool for automated data analysis and insight generation for businesses.',
    thumbnailUrl: 'https://placehold.co/600x400/41A693/122624.png?text=Project+3',
    dataAiHint: 'data analytics',
    bannerUrl: 'https://placehold.co/1200x400/41A693/122624.png?text=AI+Analyzer+Banner',
    technologies: ['Python', 'TensorFlow', 'Flask', 'Docker', 'AWS Sagemaker'],
    problemStatement: "Businesses accumulate vast amounts of data but often struggle to extract meaningful insights efficiently. Manual data analysis is time-consuming, error-prone, and requires specialized skills.",
    solutionOverview: "Developed an AI tool that automates data cleaning, analysis, and visualization. It uses machine learning models to identify trends, predict outcomes, and generate actionable reports, enabling data-driven decision-making.",
     keyFeatures: [
      { title: 'Automated Data Cleaning', description: 'Preprocesses raw data for accurate analysis.', icon: 'Briefcase' },
      { title: 'Predictive Modeling', description: 'Utilizes ML algorithms for forecasting and trend analysis.', icon: 'Zap' },
      { title: 'Insightful Visualizations', description: 'Generates interactive charts and dashboards.', icon: 'BarChart3' },
    ],
    galleryImages: [
      'https://placehold.co/800x600/122624/F2F2F2.png?text=Gallery+3.1',
      'https://placehold.co/800x600/277365/F2F2F2.png?text=Gallery+3.2',
      'https://placehold.co/800x600/41A693/FFFFFF.png?text=Gallery+3.3',
    ],
    repoUrl: '#',
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(p => p.slug === slug);
};

export const getAllProjects = (): Project[] => {
  return projects;
};
