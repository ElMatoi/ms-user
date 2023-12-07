import { IsEmail } from "class-validator";

export class getDataUserDto {
  @IsEmail()
  email: string;

  
}
