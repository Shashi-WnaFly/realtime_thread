
export default function SignInPage() {
  return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>
          <form className="space-y-4"></form>
          <div className="flex flex-col items-center justify-center">
            <a href="/sign-up" className="text-blue-500 hover:underline">
              Don't have an account? Sign up
            </a>
          </div>
        </div>
      </div>
  );
}
