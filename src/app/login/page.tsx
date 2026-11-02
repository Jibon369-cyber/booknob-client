'use client';

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
    const router = useRouter();
    const [passwordError, setPasswordError] = useState("");

    const validatePassword = (pw: string) => {
      if (pw.length < 6) return "Password must be at least 6 characters";
      if (!/[A-Z]/.test(pw)) return "Password must contain an uppercase letter";
      if (!/[a-z]/.test(pw)) return "Password must contain a lowercase letter";
      return "";
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const user = Object.fromEntries(formData.entries()) as {
            email: string;
            password: string;
        };

        const err = validatePassword(user.password);
        if (err) {
            setPasswordError(err);
            return;
        }
        setPasswordError("");

        const { data, error } = await authClient.signIn.email({
          ...user,
        });
        console.log(data)

        if (data) {
          router.push("/");
          router.refresh();
        }

        if (error) {
          console.log(error);
        }

        
    };

    const handleGoogleSignIn = async () => {
      const data = await authClient.signIn.social({
        provider: "google",
      });
      if (data) {
        router.push("/");
        router.refresh();
      }
    };

    return (
      <div className='min-h-screen bg-white dark:bg-[#070b19] flex items-center justify-center p-4'>
        {/* Outer Card Container */}
        <div className='w-full max-w-2xl bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-[#1e2942]/60 rounded-2xl p-8 shadow-2xl shadow-black/10 dark:shadow-black/50 text-slate-900 dark:text-slate-200'>
          {/* Top Icon Badge */}
          <div className='flex justify-center mb-4'>
            <div className='w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#172038] border border-slate-200 dark:border-[#263556]/50 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-inner'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
                />
              </svg>
            </div>
          </div>

          {/* Header Titles */}
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1.5'>
              Login to Your Account
            </h1>
            <p className='text-sm text-slate-500 dark:text-slate-400'>
              Join the BookNook community library
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
           

            {/* Email Address Field */}
            <div>
              <label className='block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
                Email Address <span className='text-indigo-500 dark:text-indigo-400'>*</span>
              </label>
              <input
                type='email'
                name='email'
                placeholder='jane@example.com'
                className='w-full bg-slate-50 dark:bg-[#11182c] border border-slate-200 dark:border-[#1f2d4e] rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all'
              />
            </div>

            {/* Password Field */}
            <div>
              <label className='block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5'>
                Password <span className='text-indigo-500 dark:text-indigo-400'>*</span>
              </label>
              <input
                type='password'
                name='password'
                placeholder='••••••••'
                className='w-full bg-slate-50 dark:bg-[#11182c] border border-slate-200 dark:border-[#1f2d4e] rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all'
              />
              {passwordError && (
                <p className='text-xs text-red-500 mt-1'>{passwordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full mt-2 bg-gradient-to-r from-[#5a52ff] to-[#6366f1] hover:from-[#4f46e5] hover:to-[#5558e6] text-white font-medium py-2.5 px-4 rounded-lg text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99]'>
              Complete Login
            </button>
          </form>

          {/* Divider */}
          <div className='relative flex py-5 items-center'>
            <div className='flex-grow border-t border-slate-200 dark:border-[#1e2a4a]'></div>
            <span className='flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-[11px] tracking-wider uppercase font-semibold'>
              or
            </span>
            <div className='flex-grow border-t border-slate-200 dark:border-[#1e2a4a]'></div>
          </div>

          {/* Google Sign-up Button */}
          <button
            type='submit'
            onClick={handleGoogleSignIn}
            className='w-full flex items-center justify-center gap-2.5 bg-slate-50 dark:bg-[#12192e] hover:bg-slate-100 dark:hover:bg-[#18223c] border border-slate-200 dark:border-[#223154] text-slate-900 dark:text-slate-200 font-medium py-2.5 px-4 rounded-lg text-sm transition-all duration-200'>
            {/* Google G Logo */}
            <svg className='w-4 h-4' viewBox='0 0 24 24'>
              <path
                fill='#4285F4'
                d='M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z'
              />
              <path
                fill='#34A853'
                d='M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.18 21.3 7.23 24 12 24z'
              />
              <path
                fill='#FBBC05'
                d='M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.44 8.14 0 9.89 0 12s.44 3.86 1.2 5.4l4.08-3.15z'
              />
              <path
                fill='#EA4335'
                d='M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.7 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z'
              />
            </svg>
            Login with Google
          </button>

          {/* Footer Link */}
          <p className='text-center text-xs text-slate-500 dark:text-slate-400 mt-6'>
            Don&apos;t have an account?{" "}
            <a
              href='/register'
              className='text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors'>
              Register here
            </a>
          </p>
        </div>
      </div>
    );
};

export default LoginPage;