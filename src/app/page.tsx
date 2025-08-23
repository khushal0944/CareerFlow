import HeroSection from "@/components/components/HeroSection";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { faqs } from "@/data/faqs";
import { features } from "@/data/features";
import { howItWorks } from "@/data/howitworks";
import { testimonial } from "@/data/testimonial";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
	return (
		<>
			<div className="grid-background"></div>
			<HeroSection />

			<section className="w-full py-12 md:py-24 lg:py-32 bg-background">
				<div className="container mx-auto px-4 md:px-6">
					<h1 className="text-3xl font-bold tracking-tighter text-center mb-12">
						Powerful Features for your career growth
					</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
						{features.map((feature, index) => {
							return (
								<Card
									key={index}
									className="border-2 hover:border-primary transition-all duration-300 hover:scale-105"
								>
									<CardContent>
										<div>
											{feature.icon}
											<h3 className="text-lg">{feature.title}</h3>
											<p className="text-muted-foreground mt-1">{feature.description}</p>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<section className="w-full py-12 md:py-24 bg-muted/50">
				<div className="container mx-auto px-4 md:px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
						<div className="flex flex-col items-center justify-center space-y-2">
							<h3 className="text-4xl font-bold">50+</h3>
							<p className="text-muted-foreground">
								Industries Covered
							</p>
						</div>
						<div className="flex flex-col items-center justify-center space-y-2">
							<h3 className="text-4xl font-bold">1000+</h3>
							<p className="text-muted-foreground">
								Interview Questions
							</p>
						</div>
						<div className="flex flex-col items-center justify-center space-y-2">
							<h3 className="text-4xl font-bold">95%</h3>
							<p className="text-muted-foreground">
								Success Rate
							</p>
						</div>
						<div className="flex flex-col items-center justify-center space-y-2">
							<h3 className="text-4xl font-bold">24/7</h3>
							<p className="text-muted-foreground">AI Support</p>
						</div>
					</div>
				</div>
			</section>

			<section className="w-full py-12 md:py-24 lg:py-32 bg-background">
				<div className="container mx-auto px-4 md:px-6">
					<h1 className="text-3xl font-bold tracking-tighter text-center mb-12">
						How It Works
					</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
						{howItWorks.map((each, index) => {
							return (
								<div
									key={index}
									className="flex flex-col items-center text-center space-y-2"
								>
									<div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted/50 p-2">
										{each.icon}
									</div>
									<h3 className="text-xl font-semibold">
										{each.title}
									</h3>
									<p className="text-muted-foreground">
										{each.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
				<div className="container mx-auto px-4 md:px-6">
					<h1 className="text-3xl font-bold capitalize tracking-tighter text-center mb-12">
						What our users say
					</h1>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
						{testimonial.map((item, index) => {
							return (
								<Card
									key={index}
									className="border-2 hover:border-primary transition-all duration-300 hover:scale-105 bg-background"
								>
									<CardContent>
										<div className="flex flex-col space-y-7">
											<div className="flex items-center space-x-4">
												<div className="relative h-12 w-12 shrink-0">
													<Image
														src={item.image}
														height={40}
														width={40}
														className="rounded-full object-cover border-2 border-primary/20"
														alt={item.author}
													/>
												</div>
												<div>
													<p className="font-semibold">
														{item.author}
													</p>
													<p className="text-sm text-muted-foreground">
														{item.role}
													</p>
													<p className="text-sm text-primary">
														{item.company}
													</p>
												</div>
											</div>
											<blockquote>
												<p className="relative italic text-muted-foreground">
													<span className="text-4xl text-primary absolute -top-4 -left-2">
														&quot;
													</span>
													{item.quote}
													<span className="text-4xl text-primary absolute -bottom-4">
														&quot;
													</span>
												</p>
											</blockquote>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<section className="w-full py-12 md:py-24 lg:py-32 bg-background">
				<div className="container mx-auto px-4 md:px-6">
					<h1 className="text-3xl font-bold tracking-tighter text-center mb-5">
						Frequently Asked Questions
					</h1>
					<p className="text-gray-400 text-center">
						Find answers to common questions about our platform
					</p>
					<div className="max-w-6xl mx-auto mt-20">
						<Accordion type="single" collapsible>
							{faqs.map((item, index) => {
								return (
									<AccordionItem key={index} value={`item-${index}`}>
										<AccordionTrigger>
											{item.question}
										</AccordionTrigger>
										<AccordionContent>
											{item.answer}
										</AccordionContent>
                                        <hr />
									</AccordionItem>
								);
							})}
						</Accordion>
					</div>
				</div>
			</section>

			<section className="w-full bg-muted/50">
				<div className="mx-auto py-24 gradient rounded-lg">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
					<h1 className="text-3xl sm:text-4xl md:text-5xl text-primary-foreground font-bold tracking-tighter">
						Ready to accelerate your career?
					</h1>
					<p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                        Join thousands of professionals who are advancing their careers with AI-powered guidance
					</p>
                    <Link href={"/dashboard"}>
                        <Button size={"lg"} variant={"secondary"} className="h-11 mt-5 animate-bounce">
                            Start your journey today <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </Link>
                    </div>
				</div>
			</section>
		</>
	);
}
