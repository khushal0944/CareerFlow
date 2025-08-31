"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

function HeroSection() {
	const imageRef = useRef<HTMLDivElement>(null);
	const [showIcon, setShowIcon] = useState<"started" | "demo" | null>(null)

    useEffect(() => {
        const imageEle = imageRef.current;
        function handleScroll() {
            const scrollPos = window.scrollY;
            const scrollThreshold = 150;
            if (!imageEle) return;
			if (scrollPos > scrollThreshold) {
				imageEle.classList.add("scrolled");
			} else {
				imageEle.classList.remove("scrolled");
			}
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

  return (
		<section className="w-full pt-36 md:pt-48 pb-10">
			<div className="flex items-center justify-center flex-col">
				<div className="mb-5 px-5">
					<h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center gradient-title">
						Your AI Career Coach For
						<br />
						Professional Success
					</h1>
				</div>
				<div className="mx-auto px-5">
					<h1 className="text-xl my-5 text-center text-gray-400">
						Advance your career with Personalized Guidance,
						Interview Prep, and AI-Powered tools for Job Success.
					</h1>
				</div>
				<div className="space-x-2 mt-2">
					<Link href="/dashboard">
						<Button size="lg" className="px-8"
                            onClick={() => setShowIcon("started")}
                        >
							{showIcon === "started" && (
								<Loader2 className="w-4 h-4 animate-spin"></Loader2>
							)}
							Get Started
						</Button>
					</Link>
					<Link href="/watch-demo">
						<Button
							size="lg"
							className="px-8"
							variant="outline"
							onClick={() => setShowIcon("demo")}
						>
							{showIcon === "demo" && (
								<Loader2 className="w-4 h-4 animate-spin"></Loader2>
							)}
							Watch Demo
						</Button>
					</Link>
				</div>
				<div className="hero-image-wrapper m-4">
					<div ref={imageRef} className="hero-image">
						<Image
							src={"/banner.jpg"}
							height={720}
							width={1280}
							alt="Banner Image"
							className="rounded-lg shadow-2xl border mx-auto"
							priority
						/>
					</div>
				</div>
			</div>
		</section>
  );
}

export default HeroSection