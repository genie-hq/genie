const sampleMessages = [
  { content: 'Hello! How can I assist you today?', isUser: false },
  { content: "Hi there! I'm looking for some guidance.", isUser: true },
  {
    content: "Of course, I'm here to help. What do you need assistance with?",
    isUser: false,
  },
  { content: "I'm trying to write a test case for my website.", isUser: true },
  {
    content:
      'Testing is essential for ensuring your website functions correctly. What specific aspect of testing are you struggling with?',
    isUser: false,
  },
  {
    content:
      "I'm unsure about how to write effective unit tests for my components.",
    isUser: true,
  },
  {
    content:
      "Ah, unit testing is crucial for verifying individual components' behavior. Let me provide you with some guidance.",
    isUser: false,
  },
  { content: 'That would be great, thank you!', isUser: true },
];

const githubAccounts = [{ value: 'genie-hq', label: 'genie-hq' }];

const githubRepos = [{ value: 'genie', label: 'genie' }];

const branches = [
  { value: 'main', label: 'Main' },
  { value: 'dev', label: 'Dev' },
  { value: 'feature-branch', label: 'Feature Branch' },
  { value: 'bugfix-branch', label: 'Bugfix Branch' },
  { value: 'release', label: 'Release' },
];

const programmingLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
];

const testingLibraries = [
  { value: 'vitest', label: 'Vitest' },
  { value: 'jest', label: 'Jest', disabled: true },
];

const testVersions = [{ value: 'v0', label: 'Version 0' }];

export {
  sampleMessages,
  githubAccounts,
  githubRepos,
  branches,
  programmingLanguages,
  testingLibraries,
  testVersions,
};
