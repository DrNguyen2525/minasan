import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { Conversation } from '../../entities/Conversation.entity';
import { Hobby } from '../../entities/Hobby.entity';
import { Topic } from '../../entities/Topic.entity';
import { User } from '../../entities/User.entity';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

const RANDOM_USERS_TO_GET = 5;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Conversation) private conversationRepository: Repository<Conversation>,
    @InjectRepository(Hobby) private hobbyRepository: Repository<Hobby>,
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
    private authService: AuthService
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const { name, email, password } = dto;
    const hashedPassword = this.authService.hashPassword(password);
    try {
      return await this.userRepository.save({ name, email, hashedPassword });
    } catch (error) {
      throw error.code === '23505' ? new ConflictException('Email already exists') : new InternalServerErrorException();
    }
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    let hashedPassword: string;
    const { password, hobbyIds, topicIds, ...others } = dto;

    const user = await this.userRepository.findOne(id);

    if (password) hashedPassword = this.authService.hashPassword(dto.password);

    if (hobbyIds.length) {
      const hobbies = await this.hobbyRepository.findByIds(hobbyIds);
      if (hobbies.length !== hobbyIds.length) throw new BadRequestException('Hobbies not exist');
      else user.hobbies = hobbies;
    }

    if (topicIds.length) {
      const topics = await this.topicRepository.findByIds(topicIds);
      if (topics.length !== topicIds.length) throw new BadRequestException('Topics not exist');
      else user.topics = topics;
    }

    try {
      return await this.userRepository.save({ ...user, ...others, ...(password && { hashedPassword }) });
    } catch (error) {
      throw error.code === '23505' ? new ConflictException('Email already exists') : new InternalServerErrorException();
    }
  }

  async getRandomUsers(userId: number): Promise<User[]> {
    // Exclude matched users from search result
    const conversations = await this.conversationRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }]
    });

    const matchedUserIds = conversations.map((conversation: Conversation) => {
      return conversation.user1.id === userId ? conversation.user2.id : conversation.user1.id;
    });

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id NOT IN (:...matchedUserIds)', { matchedUserIds: [userId, ...matchedUserIds] })
      .orderBy('RANDOM()')
      .limit(RANDOM_USERS_TO_GET)
      .getMany();

    return users.map((user) => plainToClass(User, user));
  }
}
