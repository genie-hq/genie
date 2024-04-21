"use client";

import { Button } from '@/components/ui/button';
import { ServerOff } from 'lucide-react';
import { useRouter } from 'next/navigation'

const ErrorPage = () => {
    const router = useRouter()

    return (
        <div className='w-full h-full flex flex-col items-center justify-center gap-5'>
            <ServerOff className='w-28 h-28 stroke-1' />

            <div className='text-3xl font-semibold'>
                Installation Failed
            </div>

            <div className='opacity-50 flex items-center flex-col'>
                Installation Token Not Detected or Unauthorized Account.
            </div>

            <Button className='mt-5 font-semibold' size="lg" onClick={() => router.push('/login')}>
                Go back to home
            </Button>

            <Button variant="link" size="icon">
                Re-Install
            </Button>
        </div>
    )
};

export default ErrorPage;