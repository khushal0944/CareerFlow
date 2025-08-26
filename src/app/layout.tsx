import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/components/Header";
import { ClerkProvider } from '@clerk/nextjs'
import {Inter} from 'next/font/google'
import {dark} from '@clerk/themes'
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
	title: "CareerFlow - Ai Career Coach",
	description: "this website is to guide you in your career",
};



export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider appearance={{
            theme: dark
        }}>
			<html lang="en" suppressHydrationWarning>
				<body className={`${inter}`}>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem
						disableTransitionOnChange
					>
						<Header />
						<main className="min-h-screen">{children}</main>
                        <Toaster richColors />
						<footer className="bg-muted/50 py-12">
							<div className="container mx-auto px-4 text-center text-gray-200">
								<p>Made with ❤️ by Khushal Kumar</p>
							</div>
						</footer>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
