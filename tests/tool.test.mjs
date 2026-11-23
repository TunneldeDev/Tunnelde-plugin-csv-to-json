import assert from "node:assert/strict";
import { test } from "node:test";
import { calculate as csv } from "../tool.mjs";

test("CSV retains quoted CRLFs, escaped quotes, blank rows, final cells and leading zeros", () => {
  assert.deepEqual(JSON.parse(csv('\uFEFFx,x\r\n"001\r\n""",\r\n\r\n', {}).text), [
    ["x", "x"],
    ['001\r\n"', ""],
    [""],
  ]);
  assert.deepEqual(JSON.parse(csv("a\tb\t", { delimiter: "tab" }).text), [["a", "b", ""]]);
  assert.equal(csv('a\n"broken', {}).error, true);
  assert.equal(csv('"closed"bad', {}).error, true);
  assert.equal(csv(",".repeat(16384), {}).error, true);
  assert.deepEqual(JSON.parse(csv("", {}).text), []);
});