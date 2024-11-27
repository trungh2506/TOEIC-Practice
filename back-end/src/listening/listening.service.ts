import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListeningDto } from './dto/create-listening.dto';
import { UpdateListeningDto } from './dto/update-listening.dto';
import { Listening } from 'src/listening/schemas/listening.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { paginate } from 'src/common/pagination/pagination.service';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { DropboxService } from 'src/dropbox/dropbox.service';

@Injectable()
export class ListeningService {
  constructor(
    private readonly dropBoxService: DropboxService,
    @InjectModel(Listening.name) private listeningModel: Model<Listening>,
  ) {}
  async create(
    title: string,
    description: string,
    original_conversation: string,
    questions: CreateQuestionDto[],
    files: { audio?: Express.Multer.File },
  ) {
    const listeningTestDto = new CreateListeningDto();
    listeningTestDto.title = title;
    listeningTestDto.description = description;
    listeningTestDto.original_conversation = original_conversation;

    if (files.audio) {
      console.log(
        'Uploading Listening Image to Dropbox...',
        files.audio[0].originalname,
      );
      listeningTestDto.audio = await this.dropBoxService.uploadFile(
        files.audio[0].buffer,
        `/listening_tests/${title}/audio/${files.audio[0].originalname}`,
      );
    }
    return 'a';
  }

  async findAll(paginationDto: PaginationDto) {
    const projection = {};
    const filter = { 'meta_data.is_deleted': false };
    const listeningTests = await paginate(
      this.listeningModel,
      paginationDto,
      filter,
      projection,
    );

    return listeningTests;
  }

  async findOne(id: string) {
    const listeningTest = (await this.listeningModel.findById(id)).populate({
      path: 'questions',
      model: 'Question',
    });
    return listeningTest;
  }

  async update(id: string, updateListeningDto: UpdateListeningDto) {
    const listeningTest = await this.listeningModel.findByIdAndUpdate(
      id,
      updateListeningDto,
      { new: true },
    );
    if (!listeningTest) {
      throw new NotFoundException(`Listening test with id ${id} not found`);
    }
    return listeningTest;
  }

  async remove(id: string) {
    const listeningTest = await this.listeningModel.findByIdAndUpdate(
      id,
      {
        $set: {
          'meta_data.is_deleted': true, // Cập nhật nested field
          'meta_data.deleted_at': new Date(),
        },
      },
      { new: true }, // Trả về tài liệu sau khi cập nhật
    );
    if (!listeningTest) {
      throw new NotFoundException(`Listening test with id ${id} not found`);
    }
    return listeningTest;
  }
}
