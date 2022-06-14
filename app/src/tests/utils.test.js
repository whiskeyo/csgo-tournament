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

  test("calculateNextMatchIndex successfully counts indexes for 2 teams", () => {
    const numberOfTeams = 2;
    expect(utils.calculateNextMatchIndex(0, numberOfTeams)).toBe(-1);
  });

  test("calculateNextMatchIndex successfully counts indexes for 4 teams", () => {
    const numberOfTeams = 4;
    expect(utils.calculateNextMatchIndex(0, numberOfTeams)).toBe(2);
    expect(utils.calculateNextMatchIndex(1, numberOfTeams)).toBe(2);
    expect(utils.calculateNextMatchIndex(2, numberOfTeams)).toBe(-1);
  });

  test("calculateNextMatchIndex successfully counts indexes for 8 teams", () => {
    const numberOfTeams = 8;
    expect(utils.calculateNextMatchIndex(0, numberOfTeams)).toBe(4);
    expect(utils.calculateNextMatchIndex(1, numberOfTeams)).toBe(4);
    expect(utils.calculateNextMatchIndex(2, numberOfTeams)).toBe(5);
    expect(utils.calculateNextMatchIndex(3, numberOfTeams)).toBe(5);
    expect(utils.calculateNextMatchIndex(4, numberOfTeams)).toBe(6);
    expect(utils.calculateNextMatchIndex(5, numberOfTeams)).toBe(6);
    expect(utils.calculateNextMatchIndex(6, numberOfTeams)).toBe(-1);
  });

  test("calculateNextMatchIndex successfully counts indexes for 16 teams", () => {
    const numberOfTeams = 16;
    expect(utils.calculateNextMatchIndex(0, numberOfTeams)).toBe(8);
    expect(utils.calculateNextMatchIndex(1, numberOfTeams)).toBe(8);
    expect(utils.calculateNextMatchIndex(2, numberOfTeams)).toBe(9);
    expect(utils.calculateNextMatchIndex(3, numberOfTeams)).toBe(9);
    expect(utils.calculateNextMatchIndex(4, numberOfTeams)).toBe(10);
    expect(utils.calculateNextMatchIndex(5, numberOfTeams)).toBe(10);
    expect(utils.calculateNextMatchIndex(6, numberOfTeams)).toBe(11);
    expect(utils.calculateNextMatchIndex(7, numberOfTeams)).toBe(11);
    expect(utils.calculateNextMatchIndex(8, numberOfTeams)).toBe(12);
    expect(utils.calculateNextMatchIndex(9, numberOfTeams)).toBe(12);
    expect(utils.calculateNextMatchIndex(10, numberOfTeams)).toBe(13);
    expect(utils.calculateNextMatchIndex(11, numberOfTeams)).toBe(13);
    expect(utils.calculateNextMatchIndex(12, numberOfTeams)).toBe(14);
    expect(utils.calculateNextMatchIndex(13, numberOfTeams)).toBe(14);
    expect(utils.calculateNextMatchIndex(14, numberOfTeams)).toBe(-1);
  });
});
