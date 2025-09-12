import {
  AfterInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`Inserted User with id ${this.id}`);
  }

  @BeforeUpdate()
  logUpdated() {
    console.log(`Updated User with id ${this.id}`);
  }

  @BeforeRemove()
  logRemoved() {
    console.log(`Removed User with id ${this.id}`);
  }
}
