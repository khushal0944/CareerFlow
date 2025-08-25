import { industries } from '@/data/industries'
import React from 'react'
import OnboardingForm from './_components/OnboardingForm'
import { getUserOnboardingStatus } from '@/../actions/user'
import { redirect } from 'next/navigation'

const page = async () => {
    const { isOnboarded } = await getUserOnboardingStatus()

    if (isOnboarded) {
        redirect("/dashboard")
    }
  return (
    <main>
        <OnboardingForm industries={industries}/>
    </main>
  )
}

export default page