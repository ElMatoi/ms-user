import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getRepository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/user/create-team.dto';
import { UpdateTeamDto } from './dto/user/update-team.dto';


@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    
  ) {}

  async createTeam(createTeamDto : CreateTeamDto) {
    const newTeam = this.teamRepository.create(createTeamDto );
    return this.teamRepository.save(newTeam);
  }

  async findAllTeams() {
    return this.teamRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  findOneByName(name: string){
    return this.teamRepository.findOneBy({name})
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }
  async deleteTeamByName(name: string): Promise<void> {
    try {
      const result = await this.teamRepository.delete({ name });

      if (result.affected === 0) {
        throw new NotFoundException('No existe el team' );
      }
    } catch (error) {
      console.error('Error al eliminar equipo por nombre:', error);
      throw error; 
    }
  }
  

  
}