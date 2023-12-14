
import { IsEmail } from "class-validator";

export class CatchUserTaskDto {
  @IsEmail()
  emailCreator: string;
}
