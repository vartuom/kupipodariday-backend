import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Для валидации данных от клиента в DTO в Nest.js есть встроенный класс ValidationPipe.
    // Чтобы использовать ValidationPipe, понадобится установить два модуля:
    // class-validator, который экспортирует удобные декораторы для валидации свойств класса;
    // class-transformer, который трансформирует данные от клиента в объекты наших DTO-классов.
    // !!!! { whitelist: true } вырезает из приходящих DTO все косячные поля типа "usernaFme"
    // и не позволяет ловить эксепшены при сохранении в БД неизвестных полей
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.listen(3000);
}

bootstrap();
