import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex bg-white text-white text-black">
      <div className="w-1/2 p-12 space-y-8">
        <div className="flex items-center space-x-2">
          <GlobeIcon className="text-white w-6 h-6" />
          <span className="font-bold text-xl">Acme Inc</span>
        </div>
        <blockquote>
          <p className="text-lg font-medium">
            This library has saved me countless hours of work and helped me
            deliver stunning designs to my clients faster than ever before
          </p>
          <footer className="mt-4">
            <p className="text-base font-normal">Sofia Davis</p>
          </footer>
        </blockquote>
      </div>
      <div className="w-1/2 p-12 space-y-6">
        <div className="flex justify-end">
          <Link className="text-sm font-medium hover:underline" href="#">
            Login
          </Link>
        </div>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create an account</h1>
          <p className="text-sm mb-6">
            Enter your email below to create your account
          </p>
          <div className="space-y-4">
            <Input placeholder="name@example.com" type="email" />
            <Button className="w-full">Sign In with Email</Button>
          </div>
          <div className="relative my-6">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full border-t border-white border-opacity-25" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#121212] text-white">
                OR CONTINUE WITH
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              className="flex items-center space-x-2"
              variant="ghost"
            ></Button>
          </div>
          <p className="text-xs text-center mt-6">
            By clicking continue, you agree to our
            <Link className="hover:underline" href="#">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link className="hover:underline" href="#">
              Privacy Policy
            </Link>
            .{'\n              '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
