# Azure Dev Spaces Roadmap
AZDS is an Azure developer service that enables a fast, iterative development experience for Kubernetes. Teams can work within the same Azure Dev Spaces resource, and test code end-to-end without simulating or mocking dependencies.

These are examples of the work we will be focusing on in the next 3-6 months. It is not a complete list, but it is a good reflection of our direction. We continuously tune the plan based on feedback. Please follow along and let us know what you think!

![Ongoing work](https://placehold.it/15/1589F0/000000?text=+) = Ongoing work


## Inner loop performance ![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
Providing a fast, iterative development experience is at the heart of AZDS. We aspire to make the inner loop performance and workflow for AZDS as close to local development as possible. We recently made significant improvements to .NET Core debug performance in VS Code, and we're currenty working on applying this to Visual Studio 2017.

## Improve experience for project references ![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
It is currently not straightforward to successfully F5/debug projects that have VS project-to-project references. We want to streamline this experience for common VS solution structure patterns.

## Azure Portal experience
Provide an experience for creating, sharing, and managing Azure Dev Spaces in the [Azure portal](https://portal.azure.com).

## Enable non-http protocols ![Ongoing work](https://placehold.it/15/1589F0/000000?text=+)
Loosen requirements on service-to-service communication to allow raw TCP, websockets, etc.

## Java debugging
Support a Kubernetes debugging experience for Java containers, similar to current support for .NET Core and Node.js code.

## Publish to AKS from Visual Studio
Provide a familiar experience for publishing a project to AKS via the Visual Studio publish wizard, as defined by the Dockerfile and Helm chart assets in the project. A related scenario under consideration is publishing a solution (of multiple projects).
