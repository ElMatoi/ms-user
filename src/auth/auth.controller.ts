import {Controller, Post,Body, Get, UseGuards, Request} from "@nestjs/common";
import {AuthService} from './auth.service';
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import {ResetPasswordDto} from "./dto/resetPassword.dto";
import { CreateTeamDto } from "./dto/createteam.dto";
import {UpdateTeamUserDto} from "./dto/updateteamuser.dto";
import {AuthGuard} from "./auth.guard";
import {DeleteTeamDto} from "./dto/deleteTeam";
import { Showteamuserdto } from "./dto/showteamuserdto";
import { CatchUserDto } from "./dto/catchuser.dto";
import { CatchTeamDto } from "./dto/catchteam.dto";
import { CatchUserTeamDto } from "./dto/catchUserTeamDto";
import { TestDto } from "./dto/test.dto";
import { CatchUserTaskDto } from "./dto/catchtaskusercreator.dto";
import { Showuserteamdto } from "./dto/showuserteam.dto";
import { getDataUserDto } from "./dto/getDataUser.dto";

@Controller('auth') 
export class AuthController{
    constructor(
        private readonly authService: AuthService,
    ){}
    @Post('ShowTeamUser')
    ShowTeamUser(
        @Body()
        showteamuser: Showteamuserdto,
    ){
        return this.authService.showTeamUser(showteamuser);
    }
    @Post('ShowUsersInTeam')
    ShowUsersInTeamUser(
        @Body()
        showusersinteam: Showuserteamdto,
    ){
        return this.authService.showUsersInTeam(showusersinteam);
    }
    @Post('getDataUser')
    getDataUser(
        @Body()
        getdatauserdto: getDataUserDto,
    ){
        return this.authService.getDataUser(getdatauserdto);
    }



    @Post('CatchUserTeamIDto')
    catchUserTeam(
        @Body()
        testdto: TestDto,
    ){
        return this.authService.CatchUserTeamIDto(testdto)
    }

    @Post('catchTeam')
    catchTeam(
        @Body()
        catchteamdto: CatchTeamDto,
    ){
        return this.authService.CatchTeamDto(catchteamdto)
    }
    @Post('catchUser')
    catchUser(
        @Body()
        catchuserdto: CatchUserDto,
    ){
        return this.authService.CatchUserDto(catchuserdto)
    }
    @Post('catchUserTaskCreator')
    catchUserTaskCreator(
        @Body()
        catchusertaskcreatordto: CatchUserTaskDto,
    ){
        return this.authService.catchTaskCreatorUser(catchusertaskcreatordto)
    }

    @Post('register')
    register(
        @Body()
        registerDto: RegisterDto,
    ){
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(
        @Body()
        loginDto: LoginDto,
    ){
        return this.authService.login(loginDto);
    }
    

    @Post('resetPassword')
    resetPassword(
        @Body()
        resetPasswordDto: ResetPasswordDto,
    ){
        return this.authService.resetPassword(resetPasswordDto);
    }
    @Post('createTeam')
    createTeam(
        @Body()
        createTeam: CreateTeamDto,
    ){
        return this.authService.createTeam(createTeam);
    }
    @Post('addUserToTeamByEmail')
    addUserToTeamByEmail(
        @Body()
        updateteamuserdto: UpdateTeamUserDto,
    ){
        return this.authService.addUserToTeamByEmail(updateteamuserdto);
    }
    
    @Post('deleteteam')
    DeleteTeamDto(
        @Body()
        deleteteam:DeleteTeamDto,
    ){
        return this.authService.deleteTeam(deleteteam);
    }

    @Get('dashboard')
    @UseGuards(AuthGuard)
    dashboard(
        @Request() req
    ) {
        return req.user;
    }
    
    
}
