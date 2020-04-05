#!/bin/bash
function get_random_string()
{
  random=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9!@#$%^&*()' | fold -w 12 | head -n 1)
  echo $random
}

echo "This script will deploy resouces which will enable you to work securely in a private virtual network".
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
echo "Enter the location:" &&
read region &&
echo "Enter the managed identity name:" &&
read idName &&

# 1. Create resource group
az group create -n $resourceGroupName -l $region

# 2. Create user assigned MI for running scripts in ARM templates
identity=$(az identity create -g $resourceGroupName -n $idName --query id -o tsv)

# 3. Assign contributor role for the MI on the RG
mi_principal_id=$(az identity show -g $resourceGroupName -n $idName --query principalId -o tsv)
az role assignment create --role 'Contributor' -g $resourceGroupName --assignee $mi_principal_id

# 4. Create Service principal to be used by the AKS cluster
sp_name="aks-sp-"$(get_random_string)
aks_sp_secret=$(az ad sp create-for-rbac --name "http://$sp_name" -o tsv --query password)
aks_sp_id=$(az ad sp show --id http://$sp_name -o tsv --query appId)

# 5. Updating the parameters of the ARM template
$password=$(get_random_string)
sed -i "s/{identity}/$identity/g" devspaces-vnet-parameters.json
sed -i "s/{aks_sp_secret}/$aks_sp_secret/g" devspaces-vnet-parameters.json
sed -i "s/{aks_sp_id}/$aks_sp_id/g" devspaces-vnet-parameters.json
sed -i "s/{password}/$password/g" devspaces-vnet-parameters.json

# 6. Deploy the resources
az group deployment create -g $resourceGroupName --template-file devspaces-vnet-template.json --parameters devspaces-vnet-parameters.json

# 7. Get the Public IP of the VM
ip=$(az network public-ip show -g $resourceGroupName -n "bridge-vm_ip" --query ipAddress -o tsv)

# 8. Get the kube-api server IP
api_server=$(kubectl get endpoints -o=jsonpath='{.items[?(@.metadata.name == "kubernetes")].subsets[].addresses[].ip}')

# add the api server ip to the firewall
az extension add --name azure-firewall
az network firewall network-rule create --firewall-name private-firewall --resource-group $resourceGroupName --collection-name "aksnetwork" --destination-addresses "$api_server"  --destination-ports 22 443 9000 --name "allow network" --protocols "TCP" --source-addresses "*" --action "Allow" --description "aks network rule" --priority 100

# clean up the mi created for deploying the resources
az role assignment delete --role 'Contributor' -g $resourceGroupName --assignee $mi_principal_id
az identity delete -g $resourceGroupName -n $idName

echo "Use '$password' password to connect to the '$ip' windows VM created in the Resource group '$resourceGroupName' to securely debug your projects with Azure Dev Spaces."
echo "Please follow the documentation here https://aka.ms/azds-networking to try out different endpoint scenarios."
