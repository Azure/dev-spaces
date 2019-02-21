FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["webfrontend.csproj", "."]
RUN dotnet restore "webfrontend.csproj"
COPY . .
RUN dotnet build "webfrontend.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "webfrontend.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "webfrontend.dll"]