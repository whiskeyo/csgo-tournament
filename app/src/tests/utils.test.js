import utils from "../services/utils";

const values = {
  min: 0,
  max: 10,
};

const teams = [
  {id: "id1", name: "team 1"},
  {id: "id2", name: "team 2"},
  {id: "id3", name: "team 3"},
  {id: "id4", name: "team 4"},
];

describe("utils tests", () => {
  test("getRandomInt creates value in range", () => {
    const randomInt = utils.getRandomInt(values.min, values.max);
    expect(randomInt).toBeGreaterThanOrEqual(values.min);
    expect(randomInt).toBeLessThan(values.max);
  });

  test("getObjectFromProxy successfully converts to object", () => {
    const proxy = new Proxy(values, {});
    const result = utils.getObjectFromProxy(proxy);

    expect(result.min).toBe(values.min);
    expect(result.max).toBe(values.max);
  });

  test("getTeamNameById returns a name of the team if ID is found in array", () => {
    expect(utils.getTeamNameById(teams[0].id, teams)).toBe(teams[0].name);
    expect(utils.getTeamNameById(teams[1].id, teams)).toBe(teams[1].name);
    expect(utils.getTeamNameById(teams[2].id, teams)).toBe(teams[2].name);
    expect(utils.getTeamNameById(teams[3].id, teams)).toBe(teams[3].name);
  })

  test("getTeamNameById returns a name TBD if ID is empty", () => {
    expect(utils.getTeamNameById("", teams)).toBe("TBD");
  })

  test("removeItemFromArray removes existing item from array", () => {
    let arr = teams;
    utils.removeItemFromArray(arr[0], arr);
    expect(arr.length).toBe(3);
  })
});
