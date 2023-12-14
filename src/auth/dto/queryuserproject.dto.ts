import { IsNumber } from "class-validator";

export class QueryUserProjectDto {
  @IsNumber()
  idUser: number;
}
