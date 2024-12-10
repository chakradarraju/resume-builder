'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import GoogleButton from 'react-google-button'

const Page: React.FC = () => {
  const { data: session, status } = useSession();
  if (status !== 'loading' && session) {
    console.log('Logged in, redirecting to home');
    redirect('/builder/');
  }
  return (<div className='h-full m-auto bg-slate-100 dark:bg-slate-900 pt-20'>
    <div className='flex flex-col p-10 text-center items-center shadow-lg w-1/4 min-w-96 m-auto bg-white dark:bg-black'>
      <Image src="/resumeGenie.webp" alt="Logo" width={300} height={300} />
      <h1 className='text-2xl font-black m-6'>Login to Resume Genie</h1>
      <GoogleButton className='m-4' onClick={() => signIn('google')} />
    </div>
  </div>)
}

export default Page;