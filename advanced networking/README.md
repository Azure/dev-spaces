This directory contains scripts and ARM templates to deploy resources which would show how to securely debug your projects using Azure Dev Spaces in a secured virtual network.  

## Overview
These templates deploy a virtual network with an Azure firewall where the traffic from/to the vnet is secured/monitored by the firewall. The Azure Kubernetes cluster is deployed into a private virutal network in it's own subnet `aks-subnet`. An Azure Dev Spaces controller with `private` endpoint is created on this AKS cluster so that the endpoint is only available in the vnet where AKS is deployed. Further, to start debugging your projects, the arm templates deploy a windows 10 virtual machine in the subnet `vm-subnet` of the same virutal network. 
The routing features enabled by Dev Spaces & the endpoint of your services are only available to the resources deployed in your virtual network which ensures the security of your services & development environment.

To learn further about configuring the endpoint types & newtork architecture of an Azure Dev Spaces controller, please look at the documentation here: https://aka.ms/azds-networking

## Deployment
This folder contains following files which would help in deploying resources:
 * deploy.sh
 * devspaces-vnet-parameters.json
 * devspaces-vnet-template.json  

The script `deploy.sh` would automate the process of deploying the resources using the arm templates. 
It requires following inputs:
```
This script will deploy resouces which will enable you to work securely in a private virtual network.
Enter the Resource Group name:
< Enter a resource group name >
Enter the managed identity name:
< Enter a name for managed identity >
Enter a password for connecting to vm:
< Enter password for the windows VM that is used as a development machine to debug your projects > 
```

## Secure Development
Connect to the VM using the ipaddress & password from the deployment script and start developing projects using Azure Dev Spaces by following this [documentation.](https://aka.ms/azds-quickstart-netcore)

## Note
The resources deployed using this templates should be used only as a starting point to secure your virtual network. 