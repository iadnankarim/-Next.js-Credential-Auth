import React from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const DasbboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect('/');
  }

  const user = session?.user;
  return (
    <div className="mt-10 text-center">
      <div className="text-2xl font-bold underline">Welcome to the dashboard</div>

      <ul>
        <li> Name {user.name}</li>
        <li>Email : {user.email}</li>
      </ul>
    </div>
  );
};

export default DasbboardPage;
