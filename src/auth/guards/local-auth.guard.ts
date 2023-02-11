import { AuthGuard } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

//гарды тоже провайдеры, не забываем Injectable
@Injectable()
// говорим паспорту какой тип стратегии тут используется, для локальной - local
// сами стратгии регистрируются в провайдерах модуля
export class LocalAuthGuard extends AuthGuard("local") {}
