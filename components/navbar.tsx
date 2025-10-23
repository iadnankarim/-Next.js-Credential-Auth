import { AirVent } from 'lucide-react';
import Link from 'next/link';

import { Button } from './ui/button';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="border-b px-4">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-13">
        <Link href="/" className="flex items-center gap-2">
          <AirVent className="h-6 w-6" />
          <span className="font-bold">NextSecure</span>
        </Link>

        <Button asChild>
          {session ? (
            <form
              action={async () => {
                'use server';
                await auth.api.signOut({
                  headers: await headers(),
                });
                redirect('/');
              }}
            >
              <Button type="submit">Sign Out</Button>
            </form>
          ) : (
            <Link href="/sign-in">Sign-in</Link>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
