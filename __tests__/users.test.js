const app = require("../app")
const request = require("supertest")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data")
const db = require("../db/connection")

beforeEach(() => {
    return seed(testData);
});
  
afterAll(() => {
    return db.end();
});

describe("GET /api/users", () => {
    test("200: Returns an array of all users", () => {
        return request(app).get("/api/users").expect(200)
        .then((response) => {
            const {users} = response.body

            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(Object.keys(user)).toHaveLength(3)
                expect(user).toHaveProperty("username", expect.any(String))
                expect(user).toHaveProperty("name", expect.any(String))
                expect(user).toHaveProperty("avatar_url", expect.any(String))
            })
        })
    })
})