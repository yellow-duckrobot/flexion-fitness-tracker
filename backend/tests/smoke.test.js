// tests/smoke.test.js — run with: node --test tests/
// NOTE: requires the backend running (npm run dev). Uses the real DB with a throwaway user.
const { test, before, after } = require("node:test");
const assert = require("node:assert");

const BASE = process.env.BASE_URL || "http://localhost:5000";
const suffix = Date.now();
const TEST_USER = {
  name: "Test Runner",
  username: `tester${suffix}`,
  email: `tester${suffix}@example.com`,
  password: "secret123",
};
let token = null;

test("health check responds 200", async () => {
  const res = await fetch(`${BASE}/health`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, "ok");
});

test("register creates a user", async () => {
  const res = await fetch(`${BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(TEST_USER),
  });
  assert.strictEqual(res.status, 201);
  const body = await res.json();
  assert.ok(body.token);
  token = body.token;
});

test("duplicate registration is rejected (409)", async () => {
  const res = await fetch(`${BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(TEST_USER),
  });
  assert.strictEqual(res.status, 409);
});

test("login with wrong password fails (401)", async () => {
  const res = await fetch(`${BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: TEST_USER.username, password: "wrongpass" }),
  });
  assert.strictEqual(res.status, 401);
});

test("login returns a JWT", async () => {
  const res = await fetch(`${BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: TEST_USER.username, password: TEST_USER.password }),
  });
  assert.strictEqual(res.status, 200);
  token = (await res.json()).token;
  assert.ok(token);
});

test("protected route rejects missing token (401)", async () => {
  const res = await fetch(`${BASE}/api/workouts`);
  assert.strictEqual(res.status, 401);
});

test("CRUD: create, read, update, delete a workout", async () => {
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const created = await fetch(`${BASE}/api/workouts`, {
    method: "POST", headers,
    body: JSON.stringify({
      name: "Test Push Day", category: "strength",
      exercises: [{ name: "Bench Press", sets: 3, reps: 10, weight: 60 }],
    }),
  });
  assert.strictEqual(created.status, 201);
  const workout = await created.json();

  const list = await fetch(`${BASE}/api/workouts`, { headers });
  assert.strictEqual(list.status, 200);
  assert.ok((await list.json()).some((w) => w.name === "Test Push Day"));

  const updated = await fetch(`${BASE}/api/workouts/${workout._id}`, {
    method: "PUT", headers,
    body: JSON.stringify({ name: "Updated Push Day" }),
  });
  assert.strictEqual(updated.status, 200);

  const deleted = await fetch(`${BASE}/api/workouts/${workout._id}`, { method: "DELETE", headers });
  assert.strictEqual(deleted.status, 200);
});

test("data export endpoint returns full dump", async () => {
  const res = await fetch(`${BASE}/api/users/me/export`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.strictEqual(res.status, 200);
  const dump = await res.json();
  assert.ok(dump.profile && Array.isArray(dump.workouts) && Array.isArray(dump.meals));
});