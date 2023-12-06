
import { IsEmail } from "class-validator";

export class CatchUserDto {
  @IsEmail()
  email: string;

  
}
