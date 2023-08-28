const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const { DB_HOST, PORT = 3000 } = process.env;
mongoose.set("strictQuery", true);

const req = { email: "v@gmail.com", password: "123456" };

describe("test login controller", () => {
  beforeAll(() => {
    mongoose
      .connect(DB_HOST)
      .then(() => {
        app.listen(PORT);
        console.log("Database connection successful");
      })
      .catch((error) => {
        console.log(error.message);
        process.exit(1);
      });
  });

  test("status - 200", async () => {
    const response = await request(app).post("/users/login").send(req);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("token - presence", async () => {
    const response = await request(app).post("/users/login").send(req);
    expect(response.body).toHaveProperty("token");
  });

  test("user - presence with 2 fields (email,subscription) with String values", async () => {
    const response = await request(app).post("/users/login").send(req);
    expect(response.body).toHaveProperty("user");

    const user = response.body.user;

    expect(user).toMatchObject(
      expect.objectContaining({
        email: expect.any(String),
        subscription: expect.any(String),
      })
    );
  });

  afterAll(() => {
    mongoose.disconnect();
  });
});
