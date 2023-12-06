import { IsNumber } from "class-validator";

export class TestDto {
  @IsNumber()
  idUser: number;

  @IsNumber()
  idTeam: number;
}
