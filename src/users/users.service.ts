import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.userRepository.save(user);
    } catch (err) {
      console.error('Error creando usuario:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<User> | null> {
    try {
      const { page, limit, search, sort, order } = queryDto;
      const query = this.userRepository.createQueryBuilder('user');
      if (search) {
        query.where(
          '(user.username ILIKE :search OR user.email ILIKE :search)',
          { search: `%${search}%` },
        );
      }
      if (sort) {
        query.orderBy(`user.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }
      return await paginate<User>(query, { page, limit });
    } catch (err) {
      console.error('Error listando usuarios:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando usuario:', err);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (err) {
      return null;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      return null;
    }
  }

  async remove(id: string): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;
      return await this.userRepository.remove(user);
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      return null;
    }
  }
}
