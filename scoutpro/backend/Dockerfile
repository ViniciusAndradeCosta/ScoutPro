# Estágio 1: Build
# AS em maiúsculo e usamos a versão Alpine do Maven para padronizar
FROM maven:3.9-eclipse-temurin-17-alpine AS build

# Atualiza os pacotes do SO para remover vulnerabilidades
RUN apk upgrade --no-cache

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Estágio 2: Execução
FROM eclipse-temurin:17-jre-alpine AS production

# Atualiza os pacotes do SO final para garantir segurança
RUN apk upgrade --no-cache

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]