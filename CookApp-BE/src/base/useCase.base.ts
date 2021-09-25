import { ICommand } from './command.base';

export interface IUseCase {
  execute(command: ICommand): Promise<any>;
}