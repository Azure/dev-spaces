This directory contains files that list the IP addresses used by Azure Dev Spaces infrastructure in each Azure region. 

If your AKS cluster is deployed with additional security that limits the IP addresses that can interact with it, Azure Dev Spaces functionality may be blocked. Common situations where this happens include: 
-	Your AKS cluster is in a custom VNET with rules that whitelist specific ingress/egress IPs.
-	You have secured access to your kube-apiserver using authorized IP address ranges. 

To enable Azure Dev Spaces in a secured cluster, you’ll need to update your configuration to allow IP addresses used by Azure Dev Spaces infrastructure services. The set of IP addresses is different for each Azure region, so you’ll need to use the IP addresses from the file in this directory that corresponds to your cluster’s region. 

To use debugging, port forwarding, and other Dev Spaces CLI features, you will also need to whitelist your dev machine IP ranges to allow direct communication with the cluster. 

# Note
These IPs are not static and these files will be updated when IPs change due to changes in Dev Spaces infrastructure. 
