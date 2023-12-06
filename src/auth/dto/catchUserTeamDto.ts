
import { IsEmail,IsString } from "class-validator";

export class CatchUserTeamDto {
  @IsEmail()
  email: string;
  @IsString()
  name: string;

  
}
