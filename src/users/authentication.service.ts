import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(User) private repository: Repository<User>,
  ) {}

  async signUp(email: string, password: string) {
    const storedUser = await this.repository.findOneBy({ email });

    if (storedUser) {
      console.log(storedUser);
      throw new BadRequestException(`Email in use. Choose another.`);
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    const newUser = await this.usersService.createUser(email, hashedPassword);
    return newUser;
  }

  async signIn(email: string, password: string) {
    const storedUser = await this.repository.findOneBy({ email });
    if (!storedUser) {
      throw new BadRequestException('Bad credential.');
    }
    const [salt, storedPassword] = storedUser.password;
    const hashedPassword = (await scrypt(password, salt, 32)) as Buffer;
    if (storedPassword !== hashedPassword.toString('hex')) {
      throw new BadRequestException('Bad credentials.');
    }
    return storedUser;
  }
}
