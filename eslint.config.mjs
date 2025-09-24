// eslint.config.js
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

export default [
	// Ignores
	{
		ignores: [
			"node_modules/**",
			".next/**",
			"dist/**",
			"build/**",
			"src/generated/prisma/**", // This is the key line for your issue
			"**/*.d.ts",
		],
	},

	// Extend Next.js config
	...compat.extends("next/core-web-vitals"),

	// Additional rules if needed
	{
		rules: {
			// Your custom rules
		},
	},
];
