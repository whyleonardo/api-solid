import { PrismaClient } from "@prisma/client"
import "dotenv/config"
import { execSync } from "node:child_process"
import { randomUUID } from "node:crypto"
import type { Environment } from "vitest"

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error("Please Provide a Database URL environment variable")
	}

	const url = new URL(process.env.DATABASE_URL)

	url.searchParams.set("schema", schema)

	return url.toString()
}

export default (<Environment>{
	name: "Prisma",
	transformMode: "ssr",
	async setup() {
		const schema = randomUUID()
		const databaseURL = generateDatabaseURL(schema)

		process.env.DATABASE_URL = databaseURL

		execSync("pnpm dlx prisma migrate deploy")

		return {
			async teardown() {
				await prisma.$executeRawUnsafe(
					`DROP SCHEMA IF EXISTS "${schema}" CASCADE`
				)

				await prisma.$disconnect()
			}
		}
	}
})
