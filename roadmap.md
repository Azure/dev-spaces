# Azure Dev Spaces Roadmap
Dev Spaces is an Azure developer service that enables a fast, iterative development experience for Kubernetes. Teams can work within the same Azure Dev Spaces resource, and test code end-to-end without simulating or mocking dependencies.

These are examples of the work we will be focusing on in the next 3-6 months. It is not a complete list, but it is a good reflection of our direction. We continuously tune the plan based on feedback. Follow along and [let us know what you think](https://github.com/Azure/dev-spaces/issues)!

Legend of annotations:

![Completed](https://placehold.it/15/15ef36/000000?text=+) = Completed

![Work in progress](https://placehold.it/15/1589F0/000000?text=+) = Ongoing work

![Under discussion](https://placehold.it/15/F07B16/000000?text=+) = Under discussion with the team

## Performance
Providing a fast, iterative development experience is at the heart of Dev Spaces. We aspire to make the inner loop performance and workflow in Dev Spaces as comparable to local development as possible, with the added benefits of working in the cloud of course. 

*Update:
Performance is an area of ongoing investment, some recent wins are called out below:*

![Completed](https://placehold.it/15/15ef36/000000?text=+) 
Dev Spaces controller creation time: was 6+ min, now  <2 min​

![Completed](https://placehold.it/15/15ef36/000000?text=+)
Visual Studio F5 warmup time: was ~7 min, now ~50 sec​

![Completed](https://placehold.it/15/15ef36/000000?text=+)
VS Code debugger launch/attach scenarios (multi-language): was ~35-45s, now 15-20s.

![Completed](https://placehold.it/15/15ef36/000000?text=+)
Faster code sync times from dev machine to AKS by batching smaller files.

![Completed](https://placehold.it/15/15ef36/000000?text=+)
Speed up iterative development cycle (edit code, build, see change in app).

![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
Speed up CLI commands like `azds list-up` and `azds list-uris`.

## Azure Portal experience ![Completed](https://placehold.it/15/15ef36/000000?text=+)
Experience for creating, sharing, and managing Azure Dev Spaces in the [Azure portal](https://portal.azure.com).

*Update: You can now enable Dev Spaces for an AKS cluster directly in the Azure portal. Navigate to your AKS cluster, and select the *Dev Spaces* tab to enable/disable Dev Spaces for that cluster. Tell us what else you'd like to see here.*

## Java debugging ![Completed](https://placehold.it/15/15ef36/000000?text=+)
Support a Kubernetes debugging experience for Java containers, similar to current support for .NET Core and Node.js code.

*Update: Iteratively developing and debugging Java Springboot applications using VS Code is now supported. Check out the Java quickstart: https://docs.microsoft.com/azure/dev-spaces/quickstart-java* (...and more samples are on the way).

## More datacenter regions ![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
Our goal is for Dev Spaces to support [all regions that AKS clusters can run](https://docs.microsoft.com/en-us/azure/aks/container-service-quotas#region-availability). We have continued to expand [regional support for Dev Spaces](https://docs.microsoft.com/azure/dev-spaces/), and more are planned over the coming months (prioritized by demand).

## Improve ingress controller reliability ![Work in progress](https://placehold.it/15/1589F0/000000?text=+)
We've encountered significant reliability and latency issues with providing public endpoints via an ingress controller. We are currently working on switching over to a different ingress implementation using [Traefik](https://docs.traefik.io/).

## End-to-end Testing with CI/CD
We've seen a surge of interest in using Dev Spaces to test changes in a continuous integration / continuous deployment pipeline. Several customers are helping us explore patterns to make their testing more effective, particularly in the context of  microservices and large development teams. 

![Completed](https://placehold.it/15/15ef36/000000?text=+)
Publish how-to content for setting up and using CI/CD in conjunction with Dev Spaces. See https://docs.microsoft.com/en-us/azure/dev-spaces/how-to/setup-cicd.

![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
Streamline the Pull Request workflow with dynamically created dev spaces.

## Real World App Sample ![Work in progress](https://placehold.it/15/1589F0/000000?text=+)
We're building a more comprehensive, real-world sample to show off Dev Spaces experiences. Check out the BikeSharing repo: https://github.com/ContosoBikeRental/BikeSharingSampleApp 

## Custom VNet support ![Completed](https://placehold.it/15/15ef36/000000?text=+)
Clusters are often placed in custom virtual networks to secure access. We have completed preliminary work to validate that developers can continue to use Dev Spaces with an AKS cluster that resides in a custom VNet.

## Improve experience for project references ![Completed](https://placehold.it/15/15ef36/000000?text=+)
It is not straightforward to successfully F5/debug projects that have VS project-to-project references. *Update: We have streamlined this experience for common Visual Studio solution structures.*

## Enable non-http protocols ![Completed](https://placehold.it/15/15ef36/000000?text=+)
Loosen requirements on service-to-service communication to allow raw TCP, websockets, etc.

## Publish to AKS from Visual Studio ![Completed](https://placehold.it/15/15ef36/000000?text=+)
Provide a familiar experience for publishing a project to AKS via the Visual Studio publish wizard, as defined by the Dockerfile and Helm chart assets in the project.

## Reliability ![Work in progress](https://placehold.it/15/1589F0/000000?text=+)
We're squashing bugs like crazy! Log issues here: https://github.com/Azure/dev-spaces/issues