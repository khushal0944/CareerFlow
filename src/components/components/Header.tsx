import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Logo from "./Logo";
import Link from "next/link";
import { Button } from "../ui/button";
import {
	ChevronDown,
	FileText,
	GraduationCap,
	LayoutDashboard,
	PenBox,
	StarsIcon,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import React from "react";

function Header() {
	return (
		<header className="fixed top-0 py-2 px-3 border-b shadow-xl w-full text-white bg-[#0f0f0f60] backdrop-blur-md z-10">
			<div className=" flex justify-between items-center">
				<Logo />
				<div id="right" className="flex items-center gap-x-2">
					<SignedIn>
						<Link href="/dashboard">
							<Button
								variant="outline"
								className="flex items-center gap-2"
							>
								<LayoutDashboard className="w-4 h-4" />
								<span className="hidden md:block">
									Industry Insights
								</span>
							</Button>
						</Link>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="flex items-center gap-2">
									<StarsIcon className="w-4 h-4" />
									Growth Tools
									<ChevronDown className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem asChild>
									<Link
										href="/resume"
										className="flex items-center gap-2"
									>
										<FileText className="w-4 h-4" />
										<span>Build Resume</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										href="/cover-letter"
										className="flex items-center gap-2"
									>
										<PenBox className="w-4 h-4" />
										<span>Cover Letter</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link
										href="/interview"
										className="flex items-center gap-2"
									>
										<GraduationCap className="w-4 h-4" />
										<span>Interview</span>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<UserButton
							appearance={{
								elements: {
									rootBox: "ml-2",
									avatarBox: "w-14 h-14 rounded-full",
									avatarImage: "w-14 h-14 rounded-full",
									userButtonPopoverCard:
										"shadow-xl rounded-2xl border border-gray-200",
									userPreviewMainIdentifier:
										"font-semibold text-gray-800",
								},
							}}
							afterSignOutUrl="/"
						/>
					</SignedIn>

					<SignedOut>
						<SignInButton>
							<Button variant="outline">Sign In</Button>
						</SignInButton>
					</SignedOut>
				</div>
			</div>
		</header>
	);
}

export default Header;
