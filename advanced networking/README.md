# Advanced Networking
This directory contains scripts and ARM templates to deploy resources which would show how to securely debug your projects using Azure Dev Spaces in a secured virtual network.  

## Overview
These ARM templates deploy a virtual network with an Azure firewall. The virtual network and Azure firewall ensure the traffic into and out of the virtual network is secured and monitored by the firewall. The AKS cluster is deployed into a private virutal network into the `aks-subnet`. An Azure Dev Spaces controller with `private` endpoint is also created on this AKS cluster and the controller's endpoint is only available in the same virtual network as the AKS cluster. To use Azure Dev Spaces to start debugging your projects, the ARM templates deploy a Windows 10 virtual machine in the `vm-subnet` subnet, which is also in the same virtual network as the AKS cluster.
The Azure Dev Spaces routing capabilities as well as the endpoints of your services are only available within the virtual network.

To learn more about the network architecture of Azure Dev Spaces and configuring its endpoint types see [Configure networking for Azure Dev Spaces in different network topologies.](https://aka.ms/azds-networking)

## Prerequisites
1. This scripts requires `az cli` & `kubectl` to set up the resources.
2. Ensure that the subscription has `Microsoft.ContainerInstance` & `Microsoft.Storage` resource providers are registered. This is required as the
   templates uses arm's deploymentScripts resource.

## Deploying the ARM template
This folder contains following files which would help in deploying resources:
 * `devspaces-vnet-template.json` is the ARM template 
 * `devspaces-vnet-parameters.json` defines the parameter values for the ARM template 
 * `deploy.sh` is a script you can use to automate the deployment of the ARM template

When using the `deploy.sh` script to deploy the ARM template, the script prompts you for the necessary values. For example:
```
$ chmod +x ./deploy.sh
$ ./deploy.sh
This script will deploy resouces which will enable you to work securely in a private virtual network.
Enter the Resource Group name:
< Enter a resource group name >
Enter the managed identity name:
< Enter a name for managed identity >
Enter a password for connecting to vm:
< Enter password for the windows VM that is used as a development machine to debug your projects > 
```
After the deployment is done, the script outputs the required details to connect to the VM for debugging. For example:
```
Use '< password >' password to connect to the '< ipaddress >' windows VM created in the Resource group '< resource group name >' to securely debug your projects with Azure Dev Spaces.
```

**Important:** The resources deployed using these templates should be used only as a starting point to secure your virtual network.

## Connecting to the virtual network for secure development
Use the virtual machine created by the ARM template on the virtual network to start developing on your AKS cluster with Azure Dev Spaces. You can use the IP address and the password you set when deploying the ARM template to connect to the virtual machine. For more details on developing with Azure Dev Spaces, see the [Azure Dev Spaces quickstart.](https://aka.ms/azds-quickstart-netcore)