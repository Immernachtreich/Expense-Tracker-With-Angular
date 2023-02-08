find ./src/swagger/api/*.service.ts -type f -exec sed -i '' -e 's/rxjs\//rxjs/' {} \;
find ./src/swagger/api/*.service.ts -type f -exec sed -i '' -e 's/formParams = formParams/formParams/' {} \;
find ./src/swagger/api/*.service.ts -type f -exec sed -i '' -e 's/ || formParams//' {} \;
find ./src/swagger/api.module.ts -type f -exec sed -i '' -e 's/: ModuleWithProviders/: ModuleWithProviders<ApiModule>/' {} \;