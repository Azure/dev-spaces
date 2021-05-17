# Azure Dev Spaces is retired as of May 15, 2021.

Azure Dev Spaces is retired as of May 15, 2021. Developers should use [Bridge to Kubernetes](https://aka.ms/bridge-to-k8s-ga), a client developer tool.

The purpose of Azure Dev Spaces was about easing developers into developing on Kubernetes. A significant tradeoff in the approach of Azure Dev Spaces was putting extra burden on developers to understand Docker and Kubernetes configurations as well as Kubernetes deployment concepts. Over time, it also became clear that the approach of Azure Dev Spaces did not effectively decrease the speed of inner loop development on Kubernetes. Bridge to Kubernetes effectively decreases the speed of inner loop development and avoids unnecessary burden on developers.

The core mission remains unchanged: Build the best developer experiences to develop, test, and debug microservice code in the context of the larger application.

### How does this affect me?
Azure Dev Spaces is no longer supported, and all projects using Azure Dev Spaces will no longer function.

### What action should I take?
Transition to [Bridge to Kubernetes](https://aka.ms/bridge-to-k8s-ga). More information on migration options is available [here](https://aka.ms/migrate-to-bridge).
If you have migration questions, or need technical assistance, please email [BridgeToKubernetes-Talk@microsoft.com](BridgeToKubernetes-Talk@microsoft.com).

# Contributing
This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
