import { Injectable,NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/user/create-user.dto';
import { CreateUserTeamDto } from './dto/user/create-user-team';
import { Repository } from 'typeorm';

import {UserTeam} from './entities/userTeam.entity'; 
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { Showuserteamdto } from 'src/auth/dto/showuserteam.dto';


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
    async queryUserTeamIDs(userId: number): Promise<number[] | null> {
      try {
       
        const userTeams = await this.userTeamRepository.find({
          where: { user: { id: userId } },
          
        });
    
        
        return userTeams.map(userTeam => userTeam.id);
      } catch (error) {
        console.error("Error en queryUserTeamIDs:", error);
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
    async removeUserTeamsByTeamId(teamId: number): Promise<DeleteResult> {
      try {
        
        const result = await this.userTeamRepository.delete({ team: { id: teamId } });
  
        if (result.affected === 0) {
          throw new NotFoundException('No se encontraron usuarios en el equipo');
        }
  
        return result;
      } catch (error) {
        console.error('Error al eliminar :', error);
        throw error; 
      }
    }
    
   
   
}