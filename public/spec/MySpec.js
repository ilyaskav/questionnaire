describe("Effectifity Calc", function() {

  it("should return KPI for given user full name", () => {
    let dev = 'Eugene Novikov',
      expectedRes = 0.92;

    expect(getKPI(dev)).toEqual(expectedRes);
  });


  it('should throw an exception for given unknown user', () => {
    let dev = 'Ilya Skavronskiy';

    expect(() => getKPI(dev)).toThrowError('user was not found');
  });


  it('should return sprint code quality for correct length of sprint value', () => {
    let lengthOfSprint = 5,
      codeQuality = 10,
      expectedRes = 2;

    expect(getSprintCodeQuaility(codeQuality, lengthOfSprint)).toEqual(expectedRes);
  });


  it('should throw exception for length of sprint value = 0', () => {
    let lengthOfSprint = 0,
      codeQuality = 10;

    expect(() => getSprintCodeQuaility(codeQuality, lengthOfSprint)).toThrowError('length of sprint should be positive');
  });


  it('should throw exception for length of sprint value < 0', () => {
    let lengthOfSprint = -5,
      codeQuality = 10;

    expect(() => getSprintCodeQuaility(codeQuality, lengthOfSprint)).toThrowError('length of sprint should be positive');
  });

});

describe('Effectifity Calc alert output', () => {
  let container = {};
  const containerId = 'testElement';

  beforeEach(() => {
    container = document.createElement('div');

    container.setAttribute('id', containerId);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = {};
  });

  it('should show message "Medium sprint quality" for question rating = average Sprint Quality', () => {
    let questionRating = averageSprintQuality,
      expectedRes = 'Medium sprint quality';

    showSprintStatus(questionRating, '#' + containerId);
    let message = $('#' + containerId).find('.alert').text();

    expect(message.indexOf(expectedRes)).toBeGreaterThan(0);
  });

  it('should show message "Low sprint quality" for question rating < average Sprint Quality', () => {
    let questionRating = averageSprintQuality - 1,
      expectedRes = 'Low sprint quality';

    showSprintStatus(questionRating, '#' + containerId);
    let message = $('#' + containerId).find('.alert').text();

    expect(message.indexOf(expectedRes)).toBeGreaterThan(0);
  });

  it('should show message "High sprint quality" for question rating = average Sprint Quality', () => {
    let questionRating = averageSprintQuality +1,
      expectedRes = 'High sprint quality';

    showSprintStatus(questionRating, '#' + containerId);
    let message = $('#' + containerId).find('.alert').text();

    expect(message.indexOf(expectedRes)).toBeGreaterThan(0);
  });
});