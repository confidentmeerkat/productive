type Webhook = {
  event_type: 'proposal_created';
  payload: unknown;
};

type ProposalCreatedPayload = {
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  skills: string[];
  accountName: string;
  coverLetter: string;
  additionalQuestions: {
    question: string;
    answer: string;
  }[];
  keywords: string[];
  status: string;
};
