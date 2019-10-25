# Deploy the Bike Sharing sample application to Azure Kubernetes Service

BikeSharing is a microservices-based sample application that helps showcase the sandboxing capbilities of [Azure Dev Spaces](https://aka.ms/devspaces). 

Follow the steps below to deploy this sample app to Azure Kubernete Service (AKS).

## Prerequisites
* [Azure subscription](https://azure.microsoft.com/free)
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
* [Helm 2.13 (or greater)](https://github.com/helm/helm/blob/master/docs/install.md)

## Configure Azure resources

1. **Create an Azure Kubernetes Service cluster.** You must create an AKS cluster in a [supported region](https://docs.microsoft.com/azure/dev-spaces/about#supported-regions-and-configurations). The below commands create a resource group called `bikesharing-group` and an AKS cluster called `bikesharing-cluster` in the `eastus` region.

    ```bash
    GROUP_NAME=bikesharing-group
    AKS_NAME=bikesharing-cluster
    LOCATION=eastus

    az group create --name $GROUP_NAME --location $LOCATION
    az aks create -g $GROUP_NAME -n $AKS_NAME --location $LOCATION --disable-rbac --generate-ssh-keys
    ```

1. **Enable Azure Dev Spaces on the AKS cluster.**
    ```bash
    az aks use-dev-spaces -g $GROUP_NAME -n $AKS_NAME --space master --yes
    ```

<!-- 1. **Create an Azure Container Registry.** Save the loginServer value from the output because it is used in a later step.
    ```bash
    ACR_NAME=bikesharing-container-registry
    az acr create -g $GROUP_NAME --name $ACR_NAME --sku Basic
    ```

1. **Set up role access for the cluster and container registry.** Note: The user running these commands needs to be an *owner* of the target resources.
    ```bash
    # Save the output from this command, you'll need the `clientId` value for the next commands
    az ad sp create-for-rbac --sdk-auth --skip-assignment 

    # Get the AKS resource id
    az aks show -g $GROUP_NAME -n $AKS_NAME --query id -o tsv

    # Create role assignment for access to AKS cluster
    az role assignment create --assignee <clientId> --scope "<aksResourceId>" --role Contributor

    # Get the container registry (ACR) id
    az acr show -g $GROUP_NAME -n $ACR_NAME --query id -o tsv
    
    # Create role assignment for 'push access' to container registry
    az role assignment create --assignee  <clientId>  --scope "<acrResourceId>" --role AcrPush
    ```
 -->


## Deploy the BikeSharing sample app

1. **Create a fork of this GitHub repo.** We need a *fork* because we'll be setting some GitHub Secrets to configure GitHub Actions in our workflow.

1. **Clone your fork and navigate into its directory**.
    ```bash
    git clone https://github.com/USERNAME/dev-spaces
    cd dev-spaces/samples/BikeSharingApp/
    ```

1. **Retrieve the HostSuffix for the `master` dev space.**
    ```bash
    azds show-context

    Name                ResourceGroup     DevSpace  HostSuffix
    ------------------  ----------------  --------  -----------------------
    MyAKS               MyResourceGroup   master    fedcab0987.eus.azds.io
    ```

1. **Update the Helm chart with your HostSuffix.** Open [`charts/values.yaml`](https://github.com/Azure/dev-spaces/blob/master/samples/BikeSharingApp/charts/values.yaml) and replace all instances of `<REPLACE_ME_WITH_HOST_SUFFIX>` with the HostSuffix value you retrieved earlier. Save your changes and close the file.

1. **Deploy the sample application to Kubernetes.** We'll use Helm to run this sample application, but other tooling could be used to run your entire application in a namespace within a cluster. The Helm commands are targeting the namespace named `master` you created earlier, and can take several minutes to complete.
    ```bash
    cd charts/
    helm init --wait
    helm install -n bikesharing . --dep-up --namespace master --atomic
    ```
    Note: **If you are using an RBAC-enabled cluster**, be sure to configure [a service account for Tiller](https://helm.sh/docs/using_helm/#role-based-access-control). Otherwise, `helm` commands will fail.

1. **Open your browser to the app's website.** Navigate to the `bikesharingweb` service by opening the public URL from the `azds list-uris` command. In the below example, the public URL for the `bikesharingweb` service is http://master.bikesharingweb.fedcab0987.eus.azds.io/. Select **Aurelia Briggs (customer)** as the user, then select a bike to rent.
    ```bash
    azds list-uris

    Uri                                                   Status
    --------------------------------------------------    ---------
    http://master.bikesharingweb.fedcab0987.eus.azds.io/  Available
    http://master.gateway.fedcab0987.eus.azds.io/         Available
    ```

## Next Steps
Now that you have the BikeSharing app deployed in AKS, try these walkthroughs:

1. **[Use your public endpoint in the cloud to privately debug backend code that’s running on your local dev machine.](https://aka.ms/devspaces/connect)** This minimizes what you need to set up on your dev machine – the only thing you need to run on your machine is the microservice you’re working on and your preferred dev tools, no need to set up mocks or simulators. You don’t even need Kubernetes YAML or Docker configuration to do this, and you won’t affect the currently deployed app or anyone who’s using the AKS cluster.

1. **[Combine GitHub Actions with Dev Spaces in a pull request review.](https://aka.ms/devspaces/pr-flow)** You can use GitHub Actions to automatically deploy to a new sandbox whenever a pull request is opened so that your team can review a live version of the app that includes your pull request changes – all before that code is merged into your main branch! As a bonus, team members such as product managers and designers can become part of the review process during early stages of development.
