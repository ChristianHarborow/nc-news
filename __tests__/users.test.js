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

describe("GET /api/users/:username", () => {
    test("200: Returns the user with the specified id", () => {
        return request(app).get("/api/users/lurker").expect(200)
        .then((response) => {
            const {user} = response.body
            const expectedUser = {
                username: "lurker",
                name: 'do_nothing',
                avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
            }
            expect(user).toEqual(expectedUser)
        })
    })
    test("204: Returns a 404 status code when a non existant username is passed", () => {
        return request(app).get("/api/users/not-a-user").expect(404)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toEqual("User not found")
        })
    })
})