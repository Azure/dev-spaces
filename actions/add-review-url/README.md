# Azure Dev Spaces GitHub Action for adding the review url on pull request
add-review-url GitHub Action can be used to write a comment on the pull request which is the app review url hence enabling the testing prior to checkin

## Pull Request workflow can have the below snippet
Refer to the documentation for [Azure Dev-spaces sample app](https://github.com/Azure/dev-spaces/) - [Pull Request Flow Documentation for Azure Dev Spaces](https://review.docs.microsoft.com/en-us/azure/dev-spaces/how-to/github-actions?branch=pr-en-us-91033)

## Example workflow syntax on how this GitHub Action can be used 
Refer: [Pull Request worflow for Azure dev-spaces](https://github.com/Azure/dev-spaces/blob/master/.github/workflows/bikes.yml)
```
    - uses: azure/dev-spaces/actions/add-review-url@Releases/v1              
        with:
            repo-token: ${{ secrets.GITHUB_TOKEN }}  
            host: ${{ secrets.HOST }}
 ```       
where secrets.HOST value is the host for your Dev Space. Refer [Pull Request Flow Documentation for Azure Dev Spaces](https://review.docs.microsoft.com/en-us/azure/dev-spaces/how-to/github-actions?branch=pr-en-us-91033#configure-your-github-action)

## Try out the code - you will need node_modules to be built
Navigate to the directory: .\actions\add-review-url\src and run
```
    npm install
    npm run build
```
## Test infrastucture for the GitHub Action
Using Jasmine Test Framework. Please refer: https://medium.com/backticks-tildes/how-to-test-javascript-with-jasmine-framework-2e2b8dfa7a9e
Refer to tests in \actions\add-review-url\test
```     
        npm install
        npm run build
        npm run buildtest
        npm test
```