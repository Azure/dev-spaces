// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const addReviewUrl = require('../lib/AddReviewUrl').default;
describe('Add-review-url tests', () =>  {

    beforeEach(() => {
        process.env.GITHUB_REPOSITORY = 'someactionowner/reponame';
    });
    describe('getOwnerAndRepo', () => {

        it('should return Owner And Repo', () => {

            let value = new addReviewUrl('')
            var a = value.getOwnerAndRepo();
            let obj = JSON.parse(JSON.stringify(a));
            expect(obj.owner).toBe('someactionowner');
            expect(obj.repo).toBe('reponame');
        });
    });
});