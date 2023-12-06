import { IsString} from 'class-validator';

export class Showuserteamdto {
    @IsString()
    name:string
}