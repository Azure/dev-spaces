# Bike Sharing Sample: Iteratively Develop and Debug Microservices in Kubenertes

## Prerequisites
1. An Azure subscription. If you don't have one, you can create a [free account](https://azure.microsoft.com/free).
1. [Visual Studio Code](https://code.visualstudio.com/download).
1. [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) version 2.0.43 or higher.
1. [Helm](https://github.com/helm/helm/blob/master/docs/install.md)


## Setup

1. Create an AKS resource group, specifying its name and region:

    ```
    az group create --name bikesharinggroup --location eastus2
    ```

1. Create a Kubernetes cluster in AKS:

    ```
    az aks create -g bikesharinggroup -n bikesharingcluster --location eastus2 --node-vm-size Standard_DS2_v2 --node-count 1 --generate-ssh-keys --disable-rbac
    ```

1. Enable Azure Dev Spaces for the cluster we just created:

    ```
    az aks use-dev-spaces -g bikesharinggroup -n bikesharingcluster --space dev --yes
    ```

    We now have an AKS cluster named `bikesharingcluster` in resource group `bikesharinggroup` in the `eastus2` region with Azure Dev Spaces enabled.

1. We now need to retrieve the host suffix. To do this, run the following command and note the `HostSuffix` field's value:

    ```
    azds show-context
    ```

1. We have to update some of our code with this host suffix. Open the `./charts/values.yaml` file and replace the occurrences of `<REPLACE_ME_WITH_HOST_SUFFIX>` in this file with the host suffix.

1. From the source repository's root folder, navigate to the `charts` folder:

    ```
    cd charts
    ```

1. Run the app's API and Data services:

    ```
    helm init --wait
    helm install -n bikesharing . --dep-up --namespace dev --wait
    ```

1. Run `azds list-uris` to display the web frontend's url, and open it in a browser. Select one of the sample customer accounts to sign into the web app.


## Set the app's state for the demo
If you want to demo finding and fixing a bug: bikes are still (incorrectly) displayed as available even if the bike is currently in use.
1. Open the webapp in the browser, and select one of the sample user accounts (e.g. *Aurelia Briggs*).
1. Select a bike and rent it. Remember the bike, as we'll refer to it later.
1. Navigate to the sign-in page by appending '/devsignin' to the root URL.

## Add multiple dev spaces to the same cluster
We'll demonstrate how multiple developers on a team can use the same cluster, so let's create multiple child dev spaces:
```
azds space select -n dev/stephen
azds space select -n dev/lisa
azds space select -n dev/john
```

## Walkthrough
 
1. Our team is building a Bike Sharing app where you can view available bikes in your area, rent a bike, and then later return it to a designated location. You're billed for the time you used the bike when you return it.
    1. Select another use to sign into the web app, for example **Terrence Freeland**
    1. Select a bike, then click "Rent".
    1. Click through the experience for returning a bike: click "Return bike", then "Confirm return". Optionally submit a review.
1. Most of the time this process works, but we currently seem to have a bug where, sometimes, a bike can't be rented.
    1. Select the bike that *Aurelia* has checked out.
    1. Click "Rent" - nothing happens: no confirmation, no error.
1. Our app consists of several services -- users, bikes, reservations, billing, reviews, etc -- and I've been asked to track the bug down. I'll start with the *`Bikes`* service, as maybe I can glean some clues about what's different about this particular problem bike. First, let's connect to the cluster where the full app is running:
    1. Open a terminal window, and run: `az aks use-dev-spaces -g bikesharinggroup -n bikesharingcluster` (Your resource group and cluster name may be different.)
    1. When prompted, select a child dev space, for example: `dev/john` (you can always change selection via `azds space select`).
    
1. Now let's debug the `bikes` service:
    1. Open VS Code on the `./Bikes` folder. If prompted by the Dev Spaces extension, click 'Yes' to generate debug configuration.
    1. Set a debug breakpoint in `server.js` inside `GET bike` (around line 228).
        ``` javascript
        // get bike ------------------------------------------------------------
        app.get('/api/bikes/:bikeId', function(req, res) {
        ```
    1. Enzure the AZDS debugger profile is selected: **Attach to server (AZDS)**.
    1. Hit F5 - this syncs code to AKS, builds the container image, deploys it in a pod, and attaches the debugger to it.
    1. Open the browser to the page that displays available bikes, and then select the "problem bike". Our debug breakpoint is not hit - that's a good sign that shows how anyone else working in the same cluster will be unaffected by our activity in our own dev space. 
    1. To reach our specific instance of the `Bikes` service, prefix the web app's URL  with `<dev-space-name>.s.` For example: `http://john.s.dev.bikesharingweb...aksapp.io`. This will route requests to `http://bikes` to our version of the `bikes` service running in the `john` namespace.
        1. Prefix the URL appropriately in the browser and refresh the page - the debug breakpoint in VS Code will activate.
        1. Step through the code - even though the container we're debugging is running in AKS, you'll notice that the debugger is reasonably responsive. And, we have access to the full richness of data in the debugger: local variables, call stacks, streaming logs, etc.
    1. Stepping through the code we notice that a Mongo database request is made to retrieve bike details. We can inspect the local variable `theBike` to glean detailed bike info.
        1. Set another breakpoint on the last line of code (because it's part of a separate callback function):
            ``` javascript
            res.send(theBike);
            ```
        1. Continue execution to hit this last breakpoint. 
        1. Inspecting `theBike` in the debugger, we notice something doesn't seem right: `theBike.available = false`. 
1. It may be that this bike shouldn't have been displayed as an *available bike* in the app's preceeding page.
    1. Navigate to the function that handles `GET availableBikes` (around line 99):
        ``` javascript
        // find bike ------------------------------------------------------------
        app.get('/api/availableBikes', function (req, res) {
        ```
    1. Set a breakpoint on the last line of code for that function:
        ``` javascript
        res.send(data);
        ```
    1. In the web app, navigate to view the list of available bikes (click on the app's logo in the header).
    1. In the debugger, view the `data` variable. We notice that aside from our "problem bike", the other bikes are `availabe = true`.
1. Let's experiment with a fix. 
    1. Uncomment line 104 that modifies the `query` filter object that is passed to mongo. 
        ``` javascript
        // BUG! Uncomment code to fix :)
        query = { available: true };
        ```
    1. Save the code file.
    1. Refresh the page in the browser. Our problem bike is filtered out! Notice how seeing the updated behavior is fast - the container image didn't need to be recreated; instead, the updated code was synced directly to the running container and `nodemon` was restarted (for compiled languages like C# or Java then a re-compilation is kicked off inside the container instance).
    1. Notice that if we remove the `john.s.` prefix in the browser's URL, then we see the original behavior (our modified `bikes` service in `dev/john` is not hit).

Our next step would be to continue testing our fix, then commit and push to the source repo. If we have a CI/CD pipeline set up, it will be triggered to update the team's baseline (the 'dev' namespace). At that point, everyone working in our AKS cluster will automatically see the updated behavior (this is another benefit of working in a shared team cluster, because the team always work with up to date dependencies).

## Clean up cloud resources
Delete the AKS cluster's **resource group** to permanently delete all Azure resources created in this walkthrough.
```bash
# View AKS clusters
az aks list -o table

# Delete all resources in group `bikesharinggroup`
az group delete -n bikesharinggroup --no-wait
```