
# created by shoegazerpt

set BACK=cd

# enable devspaces
az aks use-dev-spaces -n aks -g aks --space dev --yes
# enable devspaces and update cli (if needed)
az aks use-dev-spaces -n aks -g aks --space dev --yes --upgrade

# prep api
cd samples\nodejs\getting-started\mywebapi & azds prep & azds up
cd %BACK%

# prep web
cd samples\nodejs\getting-started\webfrontend & azds prep & azds up
cd %BACK%

# list uris
azds list-uris

# create space
azds space select -n dev/feature1 --yes

# list uris again
azds list-uris