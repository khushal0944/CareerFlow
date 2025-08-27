import { PrismaClient } from "@prisma/client"

console.log(globalThis.prisma)
export const db= globalThis.prisma || new PrismaClient()
console.log("globalThis.prisma - ", globalThis.prisma)
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}