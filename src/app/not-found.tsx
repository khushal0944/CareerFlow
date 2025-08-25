import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

const page = () => {
  return (
		<div className="h-screen flex flex-col space-y-5 justify-center items-center">
			<h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center gradient-title">
				404
			</h1>
            <p className='text-xl'>
                Page Not Found
            </p>
            <p className='text-muted-foreground'>
                Oops! The page you're looking for does not exist or been moved.
            </p>
            <Link href={'/'}>
                <Button>
                    Return Home
                </Button>
            </Link>
		</div>
  );
}

export default page