import { describe, it, expect } from "vitest";
import { processQuery, transposeData } from "./visual-helpers";

describe("processQuery", () => {
  it("replaces placeholders with corresponding values from the config", () => {
    const query = "SELECT * FROM users WHERE name = '{name}' AND age = {age}";
    const config = { name: "John", age: "30" };
    const expected = "SELECT * FROM users WHERE name = 'John' AND age = 30";

    const result = processQuery(query, config);

    expect(result).toBe(expected);
  });

  it("leaves unmatched placeholders unchanged", () => {
    const query =
      "SELECT * FROM users WHERE name = '{name}' AND age = {age} AND city = '{city}'";
    const config = { name: "John", age: "30" };
    const expected =
      "SELECT * FROM users WHERE name = 'John' AND age = 30 AND city = '{city}'";

    const result = processQuery(query, config);

    expect(result).toBe(expected);
  });

  it("works with multiple occurrences of the same placeholder", () => {
    const query =
      "SELECT * FROM users WHERE name = '{name}' OR name = '{name}'";
    const config = { name: "John" };
    const expected = "SELECT * FROM users WHERE name = 'John' OR name = 'John'";

    const result = processQuery(query, config);

    expect(result).toBe(expected);
  });

  it("returns the original query if no placeholders are present", () => {
    const query = "SELECT * FROM users";
    const config = { name: "John", age: "30" };

    const result = processQuery(query, config);

    expect(result).toBe(query);
  });
});

describe("transposeData", () => {
  it("returns an empty array if data is null or undefined", () => {
    expect(transposeData(null)).toEqual([]);
    expect(transposeData(undefined)).toEqual([]);
  });

  it("returns an empty array if data is empty", () => {
    expect(transposeData([])).toEqual([]);
  });

  it("transposes data correctly", () => {
    const data = [
      { name: "Alice", age: 25, city: "New York" },
      { name: "Bob", age: 30, city: "San Francisco" },
      { name: "Charlie", age: 35, city: "Los Angeles" },
    ];

    const expected = [
      { column: "name", value: ["Alice", "Bob", "Charlie"] },
      { column: "age", value: [25, 30, 35] },
      { column: "city", value: ["New York", "San Francisco", "Los Angeles"] },
    ];

    expect(transposeData(data)).toEqual(expected);
  });

  it("works with a single row of data", () => {
    const data = [{ name: "Alice", age: 25, city: "New York" }];

    const expected = [
      { column: "name", value: ["Alice"] },
      { column: "age", value: [25] },
      { column: "city", value: ["New York"] },
    ];

    expect(transposeData(data)).toEqual(expected);
  });

  // TO:DO fix broken test

  // it("works with missing or undefined values in data rows", () => {
  //   const data = [
  //     { name: "Alice", age: 25 },
  //     { name: "Bob", city: "San Francisco" },
  //     { name: "Charlie", age: 35, city: "Los Angeles" },
  //   ];

  //   const expected = [
  //     { column: "name", value: ["Alice", "Bob", "Charlie"] },
  //     { column: "age", value: [25, undefined, 35] },
  //     { column: "city", value: [undefined, "San Francisco", "Los Angeles"] },
  //   ];

  //   expect(transposeData(data)).toEqual(expected);
  // });
});
