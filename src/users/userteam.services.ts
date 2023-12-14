import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/user/create-user.dto';
import { CreateUserTeamDto } from './dto/user/create-user-team';
import { Repository } from 'typeorm';
import { UpdateRolUserDto } from './dto/user/update-roluser.dto';
import {UserTeam} from './entities/userTeam.entity'; 
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';


export class UseTeamService {
    constructor(
      @InjectRepository(UserTeam)
      private readonly userTeamRepository: Repository<UserTeam>
    ){}
  
    create(CreateUserTeamDto: CreateUserTeamDto) {
      return this.userTeamRepository.save(CreateUserTeamDto);
    }
    

    
    async findUsersByTeamId(teamId: number) {
      //  buscar los registros de la tabla intermedia UserTeam
      // que pertenecen al equipo con el ID especificado
      return this.userTeamRepository.find({
        where: { team: { id: teamId } }, // busca por el ID del equipo
        relations: ['team'], //printea todos los usuarios con la relacion team-user
      });
    }
    async findOneByUserIdAndTeamId(userId: number, teamId: number): Promise<UserTeam | null> {
      try {
        const userTeam = await this.userTeamRepository.findOne({
          where: { user: { id: userId }, team: { id: teamId } },
        });
    
        return userTeam || null;
      } catch (error) {
        
        console.error("Error en findOneByUserIdAndTeamId:", error);
        return null;
      }
    }
    async queryUserTeamIDProject(userId: number): Promise<number | null> {
      try {
        const userTeam = await this.userTeamRepository.findOne({
          where: { user: { id: userId } },
          relations: ['team'],
        });
    
        return userTeam ? userTeam.id : null; 
      } catch (error) {
        console.error("Error en findOneByUserIdAndTeamId:", error);
        return null;
      }
    }
    
    async showUsersInTeam(teamId:number){
      try{
        const team= await this.userTeamRepository.find({
          where :{team:{id:teamId}},
          relations:['user']
        });
        const result = team.map(userTeam => ({
          user:userTeam.user.email,
          rol:userTeam.rol,
        }));
  
        return result;

      } catch (error) {
       
        console.error("Error no hay usuarios en el team", error);
        return null;
      }
     

    }
   async showTeamUser(userId: number) {
      try {
        const userTeams = await this.userTeamRepository.find({
          where: { user: { id: userId } },
          relations: ['team'],
        });
    
        const result = userTeams.map(userTeam => ({
          rol: userTeam.rol,
          teamName: userTeam.team.name,
          teamId: userTeam.team.id,
        }));
    
        return result;
      } catch (error) {
       
        console.error("Error, usuario sin equipos ", error);
        return null;
      }
    }


    
    async catchRolUserInTeam(userId:number){
      const userTeams = await this.userTeamRepository.find({
        where: { user: { id: userId } },
        relations: ['team'],
      });
      const resultRol = userTeams.map(userTeam => ({
        rol: userTeam.rol,
        
      }));
      return resultRol;
    }
    
    async removeAllUsersFromTeam(teamId: number): Promise<DeleteResult> {
      // Elimina todos los registros de UserTeam que pertenecen al equipo con el ID especificado.
      return this.userTeamRepository
        .createQueryBuilder()
        .delete()
        .from(UserTeam)
        .where('teamId = :teamId', { teamId })
        .execute();
    }
   
}