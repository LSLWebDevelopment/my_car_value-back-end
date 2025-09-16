import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  createUser(email: string, password: string) {
    const user = this.repository.create({ email, password });
    return this.repository.save(user);
  }

  async findUserById(id: number) {
    const user = await this.repository.findOneBy({ id });
    if (!id) {
      return null;
    } else if (!user) {
      throw new NotFoundException(
        `There is no user with id ${id} on the database`,
      );
    }
    return user;
  }

  async updateUser(id: number, attrs: Partial<User>) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException(
        `There is no user with id ${id} on the database`,
      );
    }

    Object.assign(user, attrs);
    return this.repository.save(user);
  }

  async removeUser(id: number) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException(
        `There is no user with id ${id} on the database`,
      );
    }

    return this.repository.remove(user);
  }

  async findUserByEmail(email: string) {
    const user = await this.repository.findOneBy({ email });
    if (user) {
      throw new NotFoundException(
        `There is no user with email ${email} on the database`,
      );
    }
    return user;
  }

  async findAllUsers() {
    const users = await this.repository.find();
    if (users.length === 0) {
      throw new NotFoundException('There are no user on the DB.');
    }
    return users;
  }
}
