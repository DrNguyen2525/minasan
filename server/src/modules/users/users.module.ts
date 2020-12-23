import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Conversation } from '../../entities/Conversation.entity';
import { Hobby } from '../../entities/Hobby.entity';
import { User } from '../../entities/User.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User, Conversation, Hobby])],
  providers: [UsersService]
})
export class UsersModule {}
