import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { UsersController } from './users.controller'; // If you have/need a UsersController

@Module({
  // controllers: [UsersController], // Uncomment if you have a UsersController
  providers: [UsersService],
  exports: [UsersService], // Export UsersService so it can be used by AuthModule
})
export class UsersModule {} 