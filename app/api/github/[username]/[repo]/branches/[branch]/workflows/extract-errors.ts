export function extractErrors(log: string) {
  const regex = /##\[error\]\s*(.*)/g;
  const matches = log.match(regex);
  if (matches) {
    return matches
      .map((match) => match.replace(/##\[error\]\s*/, ''))
      .join('\n');
  } else {
    return 'No errors found.';
  }
}
