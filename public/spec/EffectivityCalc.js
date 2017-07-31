describe("Effectivity Calc", function() {

  it("get KPI for given user full name", () => {
    let dev = 'Eugene Novikov',
      expectedRes = 0.92;

    let actualRes = getKPI(dev);

    expect(actualRes).toBe(expectedRes);
  });


  it('an exception for given unknown user', () => {
    let dev = 'Ilya Skavronskiy';

    let actualRes = () => getKPI(dev);

    expect(actualRes).toThrowError('user was not found');
  });


  it('get sprint code quality for correct length of sprint value', () => {
    let lengthOfSprint = 5,
      codeQuality = 10,
      expectedRes = 2;

    let actualRes = getSprintCodeQuaility(codeQuality, lengthOfSprint);

    expect(actualRes).toBe(expectedRes);
  });


  it('an exception for length of sprint value = 0', () => {
    let lengthOfSprint = 0,
      codeQuality = 10,
      expectedRes = 'length of sprint should be positive';

    let actualRes = () => getSprintCodeQuaility(codeQuality, lengthOfSprint);

    expect(actualRes).toThrowError(expectedRes);
  });


  it('an exception for length of sprint value < 0', () => {
    let lengthOfSprint = -5,
      codeQuality = 10,
      expectedRes = 'length of sprint should be positive';

    let actualRes = () => getSprintCodeQuaility(codeQuality, lengthOfSprint);
      
    expect(actualRes).toThrowError(expectedRes);
  });

});