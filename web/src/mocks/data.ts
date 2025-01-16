import { Job, Application, Question, VideoResponse, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Recruiter',
    email: 'recruiter@example.com',
    role: 'recruiter',
  },
  {
    id: '2',
    name: 'Jane Candidate',
    email: 'candidate@example.com',
    role: 'candidate',
  },
];
// export const mockQuestions: Question[] = [
//   {
//     id: 1,
//     text: 'Tell us about your most challenging project and how you overcame the obstacles.',

//   },
//   {
//     id: 2,
//     text: 'How do you stay updated with the latest frontend technologies?',
//   },
// ];

// export const mockJobs: Job[] = [
//   {
//     id: '1',
//     title: 'Frontend Engineer',
//     description: 'We are looking for a software engineer to join our team.',
//     status: 'published',
//     createdAt: '2022-01-01T00:00:00.000Z',
//     requirements: `
//     - Bachelor\'s degree in Computer Science or related field
//     - 3+ years of software development experience
//     - Strong problem-solving skills`,
//     updatedAt: '2020-01-01T00:00:00.000Z',
//     recruiterId: '12',
//     question: [
//       mockQuestions[0]
//     ],
//     applications: []
//   },
//   {
//     id: '2',
//     title: 'Backend Engineer',
//     description: 'We are looking for a software engineer to join our team.',
//     status: 'published',
//     createdAt: '2022-01-01T00:00:00.000Z',
//     requirements: `
//     - Bachelor\'s degree in Computer Science or related field
//     - 3+ years of software development experience
//     - Strong problem-solving skills`,
//     updatedAt: '2020-01-01T00:00:00.000Z',
//     recruiterId: '12',
//     question: [
//       mockQuestions[0]
//     ],
//     applications: []
//   },
//   {
//     id: '3',
//     title: 'DevOps Engineer',
//     description: 'We are looking for a software engineer to join our team.',
//     status: 'published',
//     createdAt: '2022-01-01T00:00:00.000Z',
//     requirements: `
//     - Bachelor\'s degree in Computer Science or related field
//     - 3+ years of software development experience
//     - Strong problem-solving skills`,
//     updatedAt: '2020-01-01T00:00:00.000Z',
//     recruiterId: '12',
//     question: [
//       mockQuestions[0]
//     ],
//     applications: []
//   },
//   {
//     id: '4',
//     title: 'Business Development Analyst',
//     description: 'We are looking for a software engineer to join our team.',
//     status: 'published',
//     createdAt: '2022-01-01T00:00:00.000Z',
//     requirements: `
//     - Bachelor\'s degree in Computer Science or related field
//     - 3+ years of software development experience
//     - Strong problem-solving skills`,
//     updatedAt: '2020-01-01T00:00:00.000Z',
//     recruiterId: '12',
//     question: [
//       mockQuestions[0]
//     ],
//     applications: []
//   },
//   {
//     id: '5',
//     title: 'Head of Engineering',
//     description: 'We are looking for a software engineer to join our team.',
//     status: 'published',
//     createdAt: '2022-01-01T00:00:00.000Z',
//     requirements: `
//     - Bachelor\'s degree in Computer Science or related field
//     - 3+ years of software development experience
//     - Strong problem-solving skills`,
//     updatedAt: '2020-01-01T00:00:00.000Z',
//     recruiterId: '12',
//     question: [
//       mockQuestions[0]
//     ],
//     applications: []
//   },
// ];

// export const mockApplications: Application[] = [
//   {
//     id: '1',
//     jobId: '1',
//     candidateId: '2',
//     status: 'submitted',
//     createdAt: '2024-02-21T10:00:00Z',
//     candidateInfo: {
//       name: 'Jane Doe',
//       email: 'jane@example.com',
//       resume: 'resume.pdf',
//     },
//   },
// ];

// export const mockVideoResponses: VideoResponse[] = [
//   {
//     id: '1',
//     applicationId: '1',
//     questionId: '1',
//     videoUrl: 'https://example.com/video1.webm',
//     createdAt: '2024-02-21T10:30:00Z',
//   },
// ];

export interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  status: 'Hired' | 'Rejected' | 'Pending';
  applicationDate: string;
  experience: number;
  skills: string[];
}

export const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    position: "Frontend Developer",
    status: "Pending",
    applicationDate: "2023-05-15",
    experience: 3,
    skills: ["React", "JavaScript", "CSS"]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    position: "UX Designer",
    status: "Hired",
    applicationDate: "2023-05-10",
    experience: 5,
    skills: ["Figma", "User Research", "Prototyping"]
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    position: "Backend Developer",
    status: "Rejected",
    applicationDate: "2023-05-12",
    experience: 2,
    skills: ["Node.js", "Express", "MongoDB"]
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.brown@example.com",
    position: "Product Manager",
    status: "Pending",
    applicationDate: "2023-05-18",
    experience: 4,
    skills: ["Agile", "Jira", "Product Strategy"]
  },
  {
    id: 5,
    name: "David Lee",
    email: "david.lee@example.com",
    position: "Data Scientist",
    status: "Hired",
    applicationDate: "2023-05-08",
    experience: 6,
    skills: ["Python", "Machine Learning", "SQL"]
  }
];

