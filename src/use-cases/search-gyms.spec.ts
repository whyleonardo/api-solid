import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { beforeEach, describe, expect, it } from "vitest"
import { SearchGymsUseCase } from "./search-gyms"

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe("Search Gyms Use Case", async () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymsUseCase(gymsRepository)
	})

	it("should be able to search gyms", async () => {
		await gymsRepository.create({
			id: "gym-id-01",
			title: "JS DevGym",
			latitude: 0,
			longitude: 0
		})

		await gymsRepository.create({
			id: "gym-id-02",
			title: "TS DevGym",
			latitude: 0,
			longitude: 0
		})

		const { gyms } = await sut.execute({
			query: "JS DevGym",
			page: 1
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([expect.objectContaining({ title: "JS DevGym" })])
	})

	it("should be able to fetch paginated gyms search result", async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				id: `gym-${i}`,
				title: `JS DevGym ${i}`,
				latitude: 0,
				longitude: 0
			})
		}

		const { gyms } = await sut.execute({
			query: "JS DevGym",
			page: 2
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({ id: "gym-21", title: "JS DevGym 21" }),
			expect.objectContaining({ id: "gym-22", title: "JS DevGym 22" })
		])
	})
})
