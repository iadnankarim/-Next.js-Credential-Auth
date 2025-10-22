import { AirVent } from 'lucide-react';
import Link from 'next/link';

import { Button } from './ui/button';

const Navbar = () => {
  return (
    <div className="border-b px-4">
      <div className="flex items-center justify-between mx-auto max-w-4xl h-13">
        <Link href="/" className="flex items-center gap-2">
          <AirVent className="h-6 w-6" />
          <span className="font-bold">NextSecure</span>
        </Link>

        <Button asChild>
          <Link href="/sign-in">Sign-in</Link>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
