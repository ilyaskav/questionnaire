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

    it('show message "Medium sprint quality" for question rating = average Sprint Quality', () => {
        let questionRating = averageSprintQuality,
            expectedRes = 'Medium sprint quality';

        showSprintStatus(questionRating, '#' + containerId);
        let actualRes = $('#' + containerId).find('.alert').text();

        expect(actualRes).toContain(expectedRes);
    });

    it('show message "Low sprint quality" for question rating < average Sprint Quality', () => {
        let questionRating = averageSprintQuality - 1,
            expectedRes = 'Low sprint quality';

        showSprintStatus(questionRating, '#' + containerId);
        let actualRes = $('#' + containerId).find('.alert').text();

        expect(actualRes).toContain(expectedRes);
    });

    it('show message "High sprint quality" for question rating = average Sprint Quality', () => {
        let questionRating = averageSprintQuality + 1,
            expectedRes = 'High sprint quality';

        showSprintStatus(questionRating, '#' + containerId);
        let actualRes = $('#' + containerId).find('.alert').text();

        expect(actualRes).toContain(expectedRes);
    });
});