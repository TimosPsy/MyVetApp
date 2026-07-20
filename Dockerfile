 
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY MyVetApp/*.csproj MyVetApp/
RUN dotnet restore MyVetApp/MyVetApp.csproj

COPY MyVetApp/ MyVetApp/

WORKDIR /src/MyVetApp
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

COPY --from=build /app .

ENTRYPOINT ["dotnet", "MyVetApp.dll"]