import { Inject, Injectable } from "@nestjs/common";
import { PageOptionsDto } from "base/pageOptions.base";
import { BaseRepository } from "base/repository.base";
import { plainToClass } from "class-transformer";
import { UserDTO } from "dtos/social/user.dto";
import { INeo4jService } from "modules/neo4j/services/neo4j.service";
import { IUserRepository } from "./user.repository";

@Injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(
    @Inject("INeo4jService")
    private neo4jService: INeo4jService) {
    super()
  }
  async createUser(userData: UserDTO): Promise<UserDTO> {
    const res = await this.neo4jService.write(`
            CREATE (u:User)
            SET u += $properties, u.id = randomUUID()
            RETURN u
 
      `,
      this.tx,
      {
        properties: {
          ...userData
        }
      })
    return plainToClass(UserDTO, res.records[0].get('u').properties, { excludeExtraneousValues: true });
  }
  async getUserByEmail(email: string): Promise<UserDTO> {
    const res = await this.neo4jService.read(
      `MATCH (u:User{email: $email}) RETURN u LIMIT 1`,
      {
        email: email
      }
    )
    return plainToClass(UserDTO, res.records[0].get('u').properties, { excludeExtraneousValues: true });
  }

  async getUserByUsername(username: string): Promise<UserDTO> {
    const res = await this.neo4jService.read(
      `MATCH (u:User{username: $username}) RETURN u LIMIT 1`,
      {
        username: username
      }
    )
    return plainToClass(UserDTO, res.records[0].get('u').properties, { excludeExtraneousValues: true });
  }

  async getUserById(id: string): Promise<UserDTO> {
    const res = await this.neo4jService.read(
      `MATCH (u:User{id: $id}) RETURN u LIMIT 1`,
      {
        id: id
      }
    )
    return plainToClass(UserDTO, res.records[0].get('u').properties, { excludeExtraneousValues: true });
  }

  updateUserProfile(userId: string, profile: Partial<UserDTO>): Promise<UserDTO> {
    throw new Error("Method not implemented.");
  }
  getUsers(query: PageOptionsDto): Promise<UserDTO[]> {
    throw new Error("Method not implemented.");
  }
  countUsers(query: PageOptionsDto): Promise<number> {
    throw new Error("Method not implemented.");
  }
}

