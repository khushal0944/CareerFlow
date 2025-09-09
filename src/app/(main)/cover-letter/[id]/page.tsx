import React from 'react'
import { getCoverLetter } from '../../../../../actions/coverLetter';
import CoverLetterPreview from '../_components/CoverLetterPreview';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const page = async ({params}: any) => {
    const param = await params;
    const id = param.id

    const coverLetter = await getCoverLetter(id);

  return (
  <div className='space-y-4'>
    <Link href={"/cover-letter"}>
        <Button variant={"link"}>
            <ArrowLeft className='w-4 h-4'/>
            Back to cover letter
        </Button>
    </Link>
    <h1 className='gradient-title text-4xl md:text-5xl'>
      {coverLetter?.jobTitle ? coverLetter.jobTitle.charAt(0).toUpperCase() + coverLetter.jobTitle.slice(1) : ""} at {coverLetter?.companyName}
    </h1>

    <CoverLetterPreview content={coverLetter?.content || ""}/>
  </div>
  )
}

export default page