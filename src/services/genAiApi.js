const AI_PLACEHOLDER_DELAY = 800;

export async function generateApplicantSummary({ applicant, answers }) {
  const apiKey = import.meta.env.VITE_LLM_API_KEY;
  if (!applicant) {
    throw new Error('Applicant details are required');
  }

  // TODO: Replace this placeholder with a call to the production LLM endpoint once available.
  await new Promise((resolve) => setTimeout(resolve, AI_PLACEHOLDER_DELAY));

  if (!apiKey) {
    return `AI summary placeholder for ${applicant.firstname} ${applicant.surname}.\n` +
      'Provide a valid VITE_LLM_API_KEY to enable real LLM-powered insights.';
  }

  const answerHighlights = (answers || [])

    .map((answer, index) => `Q${index + 1}: ${answer.transcript?.slice(0, 140) || 'No transcript yet.'}`)

    .join('\n');

  return `AI Summary (simulated) for ${applicant.firstname} ${applicant.surname}:\n` +
    `Role: ${applicant.job_role || 'Unknown role'}\n` +
    `Key takeaways:\n${answerHighlights}\n` +
    'TODO: Replace with actual LLM response.';
}
