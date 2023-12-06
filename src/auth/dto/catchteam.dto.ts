import {  IsString } from "class-validator";

export class CatchTeamDto {
 

  @IsString()
  name: string;
}
