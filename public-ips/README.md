This readme give you information about the IP addresses used by Azure Dev Spaces infrastructure in each Azure region. 

Azure Dev Spaces now supports Azure Service Tag feature. If you want to whitelist Azure Dev Spaces IPs, you can use `AzureDevSpaces` service tag in your NSGs or Firewalls. 
If you want to get the current set of public ips being used by Azure Dev Spaces per region, please refer to [Service Tags official documentation](https://docs.microsoft.com/en-us/azure/virtual-network/service-tags-overview#available-service-tags). 

If your AKS cluster is deployed with additional security that limits the IP addresses that can interact with it, Azure Dev Spaces functionality may be blocked. Common situations where this happens include: 
-	Your AKS cluster is in a custom VNET with rules that whitelist specific ingress/egress IPs.
-	You have secured access to your kube-apiserver using authorized IP address ranges. 

To enable Azure Dev Spaces in a secured cluster, you’ll need to update your configuration to allow IP addresses used by Azure Dev Spaces infrastructure services. The set of IP addresses is different for each Azure region, so you’ll need to use the IP addresses from the file in this directory that corresponds to your cluster’s region. 

To use debugging, port forwarding, and other Dev Spaces CLI features, you will also need to whitelist your dev machine IP ranges to allow direct communication with the cluster. 

# Note
These IPs are not static and the official list of IPs provided by Service Tags will be updated when there are changes in Dev Spaces infrastructure. 
