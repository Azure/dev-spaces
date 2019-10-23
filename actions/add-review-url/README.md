# Azure Dev Spaces GiTHub Action can  be used by specifying the below ynl snippet in your flow, for example refer to: https://github.com/Azure/dev-spaces/blob/master/.github/workflows/bikes.yml:

- uses: azure/dev-spaces/actions/add-review-url@Releases/v1              
      with:
        repo-token: ${{ secrets.GITHUB_TOKEN }}  
        host: ${{ secrets.HOST }}