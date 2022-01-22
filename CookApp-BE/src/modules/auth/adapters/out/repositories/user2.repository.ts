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
    if (res.records.length === 0)
      return null
    return plainToClass(UserDTO, res.records[0].get('u').properties);
  }
  async getUserByEmail(email: string): Promise<UserDTO> {
    const res = await this.neo4jService.read(
      `MATCH (u:User{email: $email}) RETURN u LIMIT 1`,
      {
        email: email
      }
    )
    if (res.records.length === 0)
      return null
    return plainToClass(UserDTO, res.records[0].get('u').properties);
  }

  async getUserByUsername(username: string): Promise<UserDTO> {
    const res = await this.neo4jService.read(
      `MATCH (u:User{username: $username}) RETURN u LIMIT 1`,
      {
        username: username
      }
    )
    if (res.records.length === 0)
      return null
    return plainToClass(UserDTO, res.records[0].get('u').properties);
  }

  async getUserById(id: string): Promise<UserDTO> {
    const res = await this.neo4jService.read(
      `MATCH (u:User{id: $id}) RETURN u LIMIT 1`,
      {
        id: id
      }
    )
    if (res.records.length === 0)
      return null
    return plainToClass(UserDTO, res.records[0].get('u').properties);
  }

  async updateUserProfile(userID: string, profile: Partial<UserDTO>): Promise<UserDTO> {
    console.log(profile)
    const res = await this.neo4jService.write(`
            MATCH (u:User{id: $userID})
            SET u += $newUpdate
            RETURN u
 
      `,
      this.tx,
      {
        userID,
        newUpdate: {
          ...profile
        }
      },
    )
    if (res.records.length === 0)
      return null
    console.log(res.records[0].get('u'))
    return plainToClass(UserDTO, res.records[0].get('u').properties);
  }
  getUsers(query: PageOptionsDto): Promise<UserDTO[]> {
    throw new Error("Method not implemented.");
  }
  countUsers(query: PageOptionsDto): Promise<number> {
    throw new Error("Method not implemented.");
  }
}

