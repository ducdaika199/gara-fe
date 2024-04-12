import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const Login = () => {
  return (
    <div className="flex items-center min-h-screen p-6 lg:justify-center">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Acme</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Login to your account
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Username" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link className="ml-auto inline-block text-sm underline" href="#">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" placeholder="Password" type="password" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label className="text-sm leading-none" htmlFor="remember">
              Remember me
            </Label>
          </div>
          <Button className="w-full">Login</Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
