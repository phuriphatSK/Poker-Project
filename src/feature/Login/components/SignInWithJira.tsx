export function SignInWithJira() {
  return (
    <a href={`${import.meta.env.VITE_API_BASE_URL}/api/auth/atlassian`}>
      <button className="px-6 py-2 bg-[#5A378C] text-white text-lg rounded-lg">
        Sign in with Jira
      </button>
    </a>
  );
}
