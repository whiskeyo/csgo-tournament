import utils from "../services/utils";

const values = {
  min: 0,
  max: 10,
};

describe("utils tests", () => {
  test("getRandomInt creates value in range", () => {
    const randomInt = utils.getRandomInt(values.min, values.max);
    expect(randomInt).toBeGreaterThan(values.min);
    expect(randomInt).toBeLessThan(values.max);
  });
});
