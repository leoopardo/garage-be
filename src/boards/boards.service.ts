import { Inject, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { Board } from './entities/board.entity';
import { Model } from 'mongoose';

@Injectable()
export class BoardsService {
  constructor(
    @Inject(TenantProvider.boardsModel) private boardsModel: Model<Board>,
  ) {}

  create(createBoardDto: CreateBoardDto) {
    return 'This action adds a new board';
  }

  async findAll() {
    const boards = await this.boardsModel.find();
    return boards;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}