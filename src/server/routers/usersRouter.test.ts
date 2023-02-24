import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../database/models/User";
import connectDatabase from "../../database/connectDatabase";
import request from "supertest";
import { app } from "..";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a POST '/users/register' endpoint", () => {
  const endpoint = "/users/register";
  const userData: UserDataStructure = {
    username: "User",
    password: "123",
    avatar: "image.png",
    email: "user@user.com",
  };

  describe("When it receives a request with username 'User', password '123', avatar 'image.png' and email 'user@user.com'", () => {
    test("Then the response body should include the username 'User' and the message 'User registered successfully'", async () => {
      const expectedStatusCode = 201;
      const expectedResponseBody = {
        username: userData.username,
        message: "User registered successfully",
      };

      const response = await request(app)
        .post(endpoint)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });

  describe("When it receives a request with username 'User', avatar 'image.png', email 'user@user.com' and no password", () => {
    const userData = {
      username: "User",
      password: null,
      avatar: "image.png",
      email: "user@user.com",
    };
    test("Then it should respond with status code 500", async () => {
      const expectedStatusCode = 500;

      const response = await request(app)
        .post(endpoint)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.status).toBe(expectedStatusCode);
    });

    test("Then it should respond with error message 'Couldn't register the user'", async () => {
      const expectedStatusCode = 500;
      const expectedErrorMessage = { error: "Couldn't register the user" };

      const response = await request(app)
        .post(endpoint)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });
});
