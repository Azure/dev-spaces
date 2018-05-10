# VS Connected Environment Roadmap
VSCE is an Azure developer service that enables a fast, iterative development experience for Kubernetes. Teams can work within the same Connected Environment, and test code end-to-end without simulating or mocking dependencies.

These are examples of the work we will be focusing on in the next 3-6 months. It is not a complete list, but it is a good reflection of our direction. We continuously tune the plan based on feedback. Please follow along and let us know what you think!

![Ongoing work](https://placehold.it/15/1589F0/000000?text=+) = Ongoing work


## Inner loop performance ![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
Providing a fast, iterative development experience is at the heart of VSCE. We aspire to make the inner loop performance and workflow for VSCE as close to local development as possible. We recently made significant improvements to .NET Core debug performance in VS Code, and we're currenty working on applying this to Visual Studio 2017.
 
## Improve experience for project references ![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
It is currently not straightforward to successfully F5/debug projects that have VS project-to-project references. We want to streamline this experience for common VS solution structure patterns.
 
## Azure portal experience
Provide an experience for creating, sharing, and managing Connected Environments in the [Azure portal](https://portal.azure.com).
 
## Custom Virtual Network support ![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
The ability to place a Connected Environment, at the time of creation, into an existing Virtual Network. Two key scenarios: 1) Containers running in the Kubernetes cluster need to access Azure services, like SQL and Redis, that are provisioned in an existing VNet. 2) Lock down VSCE endpoints so that they are only accessible from inside the VNet.
 
## Connected Environment size and customization ![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
Provide a way to specify Kubernetes cluster size to best fit budget and workload requirements. We are also considering support for connecting VSCE to an existing AKS instance for more flexibility. 

## Enable non-http protocols ![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
Loosen requirements on service-to-service communication to allow raw TCP, websockets, etc.

## Java debugging
Support a Kubernetes debugging experience for Java containers, similar to current support for .NET Core and Node.js code.
 
## Expand Azure regions 
VSCE is currently available in `eastus` and `westeurope`. More regions will be added based on usage patterns.
 
## Publish to AKS from Visual Studio
Provide a familiar experience for publishing a project to AKS via the Visual Studio publish wizard, as defined by the Dockerfile and Helm chart assets in the project. A related scenario under consideration is publishing a solution (of multiple projects).
