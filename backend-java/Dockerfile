# 1. ビルド環境（Javaをコンパイルする環境）
FROM eclipse-temurin:25-jdk-jammy AS build
WORKDIR /app
# 必要なファイルをすべてコピー
COPY . .
# Gradleを実行可能な状態にして、テストをスキップしてビルド
RUN chmod +x ./gradlew
RUN ./gradlew bootJar -x test

# 2. 実行環境（実際に動かすための軽量な環境）
FROM eclipse-temurin:25-jre-jammy
WORKDIR /app
# ビルド環境で作られた .jar ファイルだけをコピー
COPY --from=build /app/build/libs/*.jar app.jar
# ポート8080を開放
EXPOSE 8080
# アプリケーションを起動
ENTRYPOINT ["java", "-jar", "app.jar"]