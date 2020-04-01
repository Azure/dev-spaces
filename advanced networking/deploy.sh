#!/bin/bash
echo "This script will deploy resouces which will enable you to work securely in a private virtual network".
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
echo "Enter the managed identity name:" &&
read idName &&
echo "Enter a password for connecting to vm:" &&
read password &&
# 1. Create resource group
az group create -n $resourceGroupName -l southcentralus

# 2. Create user assigned MI for running scripts in ARM templates
identity=$(az identity create -g $resourceGroupName -n $idName --query id -o tsv)

# 3. Assign contributor role for the MI on the RG
az role assignment create --role 'Contributor' -g $resourceGroupName --assignee $(az identity show -g $resourceGroupName -n $idName --query principalId -o tsv)

# 4. Create Service principal to be used by the AKS cluster
aks_sp_secret=$(az ad sp create-for-rbac --name "http://private-aks-sp" -o tsv --query password)
aks_sp_id=$(az ad sp show --id http://private-aks-sp -o tsv --query appId)

# 5. Updating the parameters of the ARM template
sed -i "s/{identity}/$identity/g" devspaces-vnet-parameters.json
sed -i "s/{aks_sp_secret}/$aks_sp_secret/g" devspaces-vnet-parameters.json
sed -i "s/{aks_sp_id}/$aks_sp_id/g" devspaces-vnet-parameters.json
sed -i "s/{password}/$password/g" devspaces-vnet-parameters.json

# 6. Deploy the resources
az group deployment create -g $resourceGroupName --template-file deployScripts.json --parameters @devspaces-vnet-parameters.json

# 7. Get the Public IP of the VM
ip=$(az network public-ip show -g $resourceGroupName -n "private-vm_ip" --query ipAddress -o tsv)

echo "Use '$password' password to connect to the '$ip' windows VM created in the Resource group '$resourceGroupName' to securely debug your projects with Azure Dev Spaces."
echo "Please follow the documentation here https://aka.ms/azds-networking to try out different endpoint scenarios."
