import {BadRequestException, Injectable,UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { TeamService } from "src/users/teams.service";
import { UseTeamService } from "src/users/userteam.services";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { CreateTeamDto } from "./dto/createteam.dto";
import { ResetPasswordDto } from "./dto/resetPassword.dto";
import { UpdateUserDto } from "src/users/dto/user/update-user.dto";
import { UpdateTeamUserDto } from "./dto/updateteamuser.dto";
import {DeleteTeamDto} from "./dto/deleteTeam";
import { Showteamuserdto } from "./dto/showteamuserdto";
import { JwtService } from "@nestjs/jwt";
import { NotFoundException } from '@nestjs/common';
import { CatchUserDto } from "./dto/catchuser.dto";
import { CatchTeamDto } from "./dto/catchteam.dto";
import { CatchUserTeamDto } from "./dto/catchUserTeamDto";
import { TestDto } from "./dto/test.dto";
import { CatchUserTaskDto } from "./dto/catchtaskusercreator.dto";
import { Showuserteamdto } from "./dto/showuserteam.dto";
import { getDataUserDto } from "./dto/getDataUser.dto";
import { QueryUserProjectDto } from "./dto/queryuserproject.dto";


@Injectable()
export class AuthService{
    constructor(
      private readonly usersService: UsersService,
      private readonly teamService: TeamService,
      private readonly userteamService : UseTeamService,
      private readonly jwtService: JwtService){} // variable que almacena los metodos

      async addUserToTeamByEmail({name, email,rol}:UpdateTeamUserDto) {  // add user in team
        /// en el mismo boton que ingresa el quipo, que envie para esta peticion
        const team=await this.teamService.findOneByName(name); 
        const user = await this.usersService.findOneByEmail(email);
        console.log(user);
        console.log(team);
        
        if (!team || !user) {
          
          throw new NotFoundException('Team or user not found');
        }
      const createUserTeam= await this.userteamService.create({
          user,
          team,
          rol,
        });
        const usersInTeam = await this.userteamService.findUsersByTeamId(team.id);
        
        return true;
        
        
      }
      //////////////////////////////////////////////////////////////////////////////////
      async CatchUserDto({email}:CatchUserDto){
        const user=await this.usersService.findOneByEmail(email);
        if(!user){
          throw new NotFoundException ('user not found');
        }
        return user.id;
      }
      /////////////////////////////////////////////////////////////////////////////////
      async catchTaskCreatorUser({emailCreator}:CatchUserTaskDto){
        const user=await this.usersService.findOneByEmail(emailCreator);
        if(!user){
          throw new NotFoundException ('user not found');
        }
        return user.id;
      }
      async CatchTeamDto({name}:CatchTeamDto){
        const team=await this.teamService.findOneByName(name);
        if(!team){
          throw new NotFoundException ('team not found');
        }
        return team.id;
      }

      async CatchUserTeamDto({email,name}:CatchUserTeamDto){
        const user = await this.usersService.findOneByEmail(email);
        const team = await this.teamService.findOneByName(name);
        const userTeam = await this.userteamService.findOneByUserIdAndTeamId(user.id, team.id);
        console.log(user.email);
        console.log(team.name);
        console.log(userTeam.rol);
        if(!userTeam){
          throw new NotFoundException ('team user not found');
        }
        return userTeam.id;
      }

      async CatchUserTeamIDto({idUser,idTeam}:TestDto){
        console.log(idUser)
        console.log(idTeam)
        
        const userTeam = await this.userteamService.findOneByUserIdAndTeamId(idUser, idTeam);
        
        if(!userTeam){
          throw new NotFoundException ('team user not found');
        }
        return userTeam.id;
      }
      //////////////////////////////////////////////////////////////////////////////
      async createTeam({name}:CreateTeamDto){//create team
        const team=await this.teamService.findOneByName(name); 
        if(team){
          throw new BadRequestException('Ya existe un equipo con ese nombre');
        }
        const createTeam=await this.teamService.createTeam({
          name
  
        });
        return true;
      }
      
   
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      
  async deleteTeam({ name }: DeleteTeamDto): Promise<boolean> {
    try {
      console.log(name);

      // Buscar el equipo por nombre
      const team = await this.teamService.findOneByName(name);

      if (!team) {
        
        throw new NotFoundException('Team not found');
      }

     
      await this.userteamService.removeUserTeamsByTeamId(team.id);

      
      await this.teamService.deleteTeamByName(name);

      return true;
    } catch (error) {
      
      console.error('Error ', error);
     
      throw new Error('Error');
    }
  }

      private generateToken(userId: number): string {
      // ervicio JwtService para generar token
      const payload = { sub: userId }; 
      const token = this.jwtService.sign(payload);
  
      return token;
    }
    
    async register({ name, email, password }: RegisterDto) {
      const user = await this.usersService.findOneByEmail(email); // pregunta si existe el usuario en la base
      if (user) {
        throw new BadRequestException('Ya existe un usuario con ese correo');
      }
    // Llama al método create del userServicio y lo mete a la base de datos
      const createdUser = await this.usersService.create({
        name,
        email,
        password,
      });
      const token = this.generateToken(createdUser.id);

      return true;
    }
    async login({ email, password }: LoginDto) {
        const user = await this.usersService.findOneByEmail(email);
        
        if (!user) {
          throw new UnauthorizedException('email incorrecto');
        }
      
        
        if (!password) {
          throw new UnauthorizedException('contraseña incorrecta');
        }

        const payload = { email: user.email };

        const token = await this.jwtService.signAsync(payload);

        return {
          token,
          email,
        };
        
      }
      async resetPassword({ email, newPassword }: ResetPasswordDto) {
      // Buscar al usuario por correo electrónico
      const user = await this.usersService.findOneByEmail(email);
    // Actualizar la contraseña solo para el usuario encontrado
      const updateUserDto = new UpdateUserDto();
      updateUserDto.password = newPassword;
    
      await this.usersService.resetPass(user.id, updateUserDto); 
    
      return user;
    }
    //////////////////////////////////////////////////////////////////////////
    async showTeamUser({ email }: Showteamuserdto) {
      try {
        const user = await this.usersService.findOneByEmail(email);
    
        const userteam = await this.userteamService.showTeamUser(user.id);
        return userteam;
      }catch (error) {
        console.error("Error no hay equipos para el usuario ", error);
      }
    }
////////////////////////////////////////////////////////////////////////////////////
    async showUsersInTeam({name}:Showuserteamdto){
      try{
        const team= await this.teamService.findOneByName(name);
        const userTeam=await this.userteamService.showUsersInTeam(team.id);
        return userTeam;

      }catch(error){
        console.error("Error")
      }
    }
    ////////////////////////////////////////////////
    async getDataUser({email}:getDataUserDto){
      const user= await this.usersService.findOneByEmail(email);
      if(!user){
        throw new NotFoundException ('user not found');
      }

      return user;
    }
    async getUserTeamIdProjects({idUser}:QueryUserProjectDto){
      const teamuser= await this.userteamService.queryUserTeamIDProject(idUser);
      if(!teamuser){
        throw new NotFoundException ('user havent teams');
        }
       
      return  teamuser;
      }
     
    
   
    
    }



  
  
  
  