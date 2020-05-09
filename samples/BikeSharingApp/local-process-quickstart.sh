#!/bin/bash

# Please install the below pre-requisites if using this on your local machine, or alternately, you can just use azure bash cloudshell for a seamless experience.
#1. az
#2. kubectl
#3. curl
#4. gunzip
#5. tar
#6. perl

INGRESSNAME=bikesharing-traefik
PIPNAME=BikeSharingPip
HELMDIR=/var/tmp/helm_azds
HELMROOT=${HELMDIR}/darwin-amd64

helpFunction()
{
   echo ""
   echo "Usage: $1 -g ResourceGroupName -n AKSName -r DevSpacesRepoRoot"
   echo -e "\t-g Name of resource group of AKS Cluster"
   echo -e "\t-n Name of AKS Cluster"
   echo -e "\t-r Path to Root of dev spaces repo"
   echo -e "\t-c Cleanup"
   exit 1 # Exit script after printing help
}

installHelmFunction()
{
   mkdir $HELMDIR
   if [[ "$OSTYPE" == "linux-gnu"* ]]; then
      curl -fsSL -o $HELMDIR/helm.tar.gz https://get.helm.sh/helm-v3.2.1-linux-amd64.tar.gz
      gunzip -c $HELMDIR/helm.tar.gz | tar xopf - -C $HELMDIR
      mv $HELMDIR/linux-amd64/helm $HELMDIR
   elif [[ "$OSTYPE" == "darwin"* ]]; then
      curl -fsSL -o $HELMDIR/helm.tar.gz https://get.helm.sh/helm-v3.2.1-darwin-amd64.tar.gz
      gunzip -c $HELMDIR/helm.tar.gz | tar xopf - -C $HELMDIR
      mv $HELMDIR/darwin-amd64/helm $HELMDIR
   else
      echo "OS not recognized. Please either run on linux-gnu or osx"
   fi
}

cleanupFunction()
{
   echo ""
   ${HELMDIR}/helm --namespace dev uninstall bikesharingapp
   ${HELMDIR}/helm --namespace $INGRESSNAME uninstall $INGRESSNAME
   kubectl delete namespace dev
   kubectl delete ns $INGRESSNAME
   rm -rf $HELMDIR
   res=$(az network public-ip delete --name $PIPNAME --resource-group $RGNAME | grep "still allocated to resource")
   if [[ "$res" -ne "" ]]
   then
      echo "Please delete the Public IP address ${PIPNAME} in resource group ${RGNAME} manually"
   fi
   exit 1
}

while getopts "g:n:r:c" opt
do
   case "$opt" in
      c ) CLEANUP="true"  ;;
      g ) RGNAME="$OPTARG"  ;;
      n ) AKSNAME="$OPTARG"  ;;
      r ) REPOROOT="$OPTARG"  ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

# Print helpFunction in case parameters are empty
if [ ! -z "$CLEANUP" ]
then
   if [ -z "$RGNAME" ]
   then
      echo "Please pass -g when calling -c"
      helpFunction
   else
      cleanupFunction
   fi
elif [ -z "$RGNAME" ] || [ -z "$AKSNAME" ] || [ -z "$REPOROOT" ]
then
   echo "Some or all of the parameters are empty";
   helpFunction
fi

installHelmFunction
 
echo "Setting the Kube context"
az aks get-credentials -g $RGNAME -n $AKSNAME
 
PUBLICIP=$(az network public-ip create --resource-group $RGNAME --name $PIPNAME --sku Standard --allocation-method static --query publicIp.ipAddress -o tsv)
echo "BikeSharing ingress Public ip: " $PUBLICIP
 
echo "Create namespace ${INGRESSNAME}"
kubectl create namespace $INGRESSNAME
 
# Use Helm to deploy a traefik ingress controller
echo "helm repo add && helm repo update"
${HELMDIR}/helm repo add stable https://kubernetes-charts.storage.googleapis.com/
${HELMDIR}/helm repo update
echo "helm install traefik ingress controller"
kubectl api-versions | grep "rbac.authorization.k8s.io"
if [[ $? -eq 0 ]]
then
   ${HELMDIR}/helm install $INGRESSNAME stable/traefik \
      --namespace $INGRESSNAME \
      --set kubernetes.ingressClass=traefik \
      --set fullnameOverride=$INGRESSNAME \
      --set rbac.enabled=true \
      --set service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-resource-group"="$RGNAME" \
      --set loadBalancerIP=$PUBLICIP \
      --set kubernetes.ingressEndpoint.useDefaultPublishedService=true \
      --version 1.85.0
else
   ${HELMDIR}/helm install $INGRESSNAME stable/traefik \
      --namespace $INGRESSNAME \
      --set kubernetes.ingressClass=traefik \
      --set fullnameOverride=$INGRESSNAME \
      --set rbac.enabled=false \
      --set service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-resource-group"="$RGNAME" \
      --set loadBalancerIP=$PUBLICIP \
      --set kubernetes.ingressEndpoint.useDefaultPublishedService=true \
      --version 1.85.0
fi
 
NIPIOFQDN=${PUBLICIP}.nip.io
echo "The Nip.IO FQDN would be " $NIPIOFQDN
 
CHARTDIR=${REPOROOT}/samples/BikeSharingApp/charts/
echo "---"
echo "Chart directory: $CHARTDIR"
 
echo "Create namespace dev"
kubectl create ns dev

echo "Replacing ingress controller annotation in values.yaml"
perl -i -pe's/traefik-azds/traefik/g' ${CHARTDIR}/values.yaml

echo "helm install bikesharingapp"
${HELMDIR}/helm install bikesharingapp $CHARTDIR \
                --set bikesharingweb.ingress.hosts={dev.bikesharingweb.${NIPIOFQDN}} \
                --set gateway.ingress.hosts={dev.gateway.${NIPIOFQDN}} \
                --dependency-update \
                --namespace dev \
                --atomic \

echo ""
echo "To try out the app, open the url:"
kubectl -n dev get ing bikesharingweb -o jsonpath='{.spec.rules[0].host}'
echo ""
