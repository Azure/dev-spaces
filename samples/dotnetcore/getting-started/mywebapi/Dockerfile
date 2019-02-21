FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["mywebapi.csproj", "."]
RUN dotnet restore "mywebapi.csproj"
COPY . .
RUN dotnet build "mywebapi.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "mywebapi.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "mywebapi.dll"]