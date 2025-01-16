import React from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'recruiter' | 'candidate';
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  createdAt: string;
  updatedAt: string;
  recruiterId: string;
  status: 'draft' | 'published';
  question: Question[];
  applications: Application[] | [];
}

// export interface Question {
//   id: string;
//   jobId: string;
//   text: string;
//   order: number;
//   answer: string;
// }

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'pending' | 'submitted' | 'reviewed' | 'shortlisted' | 'rejected';
  createdAt: string;
  candidateInfo: {
    name: string;
    email: string;
    resume: string;
  };
}

export interface JobApplication {
  id: any;
  candidate: Candidate;
  jobPosting: Job;
  videoResponses: VideoResponseDTO[];
  status: string | "";
}

export interface VideoResponse {
  id: any;
  applicationId: string;
  questionId: string;
  videoUrl: string;
  createdAt: string;
}

export interface VideoResponseDTO {
  id: any;
  videoUrl: string;
  transcript: string;
  summary: string;
  feedback: string;
  application: {
    id: any
  };
  question: {
    id: number;
    text: string
  };
}

// new types:

export interface Recruiter {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phoneNumber: string;
}

export interface Question {
  id: number;
  text: string;
  jobPosting?: JobPosting;
}

export interface PortalDTO {
  id: string;
  name: string;
  description: string;
  header: string;
  videoLink: string;
  recruiter: Recruiter;
  jobPosting?: JobPosting;
}

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  company: string | null;
  location: string | null,
  jobTypes: string | null;
  yearsOfExperience: string | null;
  benefits: string | null;
  tags: string[] | null;
  brand: OnboardingData | null;
  recruiter: Recruiter;
  questions: Question[];
  companyPortal: PortalDTO | null
}

export interface Candidate {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  resumeUrl: string;
}

export interface ApplicationResponse {
  id: number;
  candidate: Candidate;
  jobPosting: JobPosting;
}

export interface OnboardingData {
  templateName: string;
  brandName: string;
  brandLogoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  hrRepresentativeName: string;
  hrRepresentativePosition: string;
  representativeImageUrl: string;
  welcomeVideoUrl: string;
  email: string;
  id: any;
}


export interface Slide {
  id: number;
  content: React.ReactNode;
  background: string;
}

export interface SlideContent {
  contents: Slide[];
  currentIndex: number;
}

export interface LoginDTO {
  status: string;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  recruiter: {
    id: number;
    email: string;
    contactName: string;
  };
}