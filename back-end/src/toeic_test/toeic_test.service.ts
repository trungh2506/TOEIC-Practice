import { Injectable } from '@nestjs/common';
import { CreateToeicTestDto } from './dto/create-toeic_test.dto';
import { UpdateToeicTestDto } from './dto/update-toeic_test.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Toeic_Test } from './schemas/toeic_test.schema';

import * as XLSX from 'xlsx';
import { PassageService } from 'src/passage/passage.service';
import { CreatePassageDto } from 'src/passage/dto/create-passage.dto';
import { Passage } from 'src/interface/passage.interface';
import { QuestionService } from 'src/question/question.service';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { Question } from 'src/interface/question.interface';

@Injectable()
export class ToeicTestService {
  constructor(
    private readonly passageService: PassageService,
    private readonly questionService: QuestionService,
    @InjectModel(Toeic_Test.name) private toeicTestModel: Model<Toeic_Test>,
  ) {}

  async create(files: {
    testImage?: Express.Multer.File;
    questions?: Express.Multer.File;
    passages?: Express.Multer.File;
    images?: Express.Multer.File[];
    audios?: Express.Multer.File[];
  }) {
    if (files.questions) {
      const workbook = XLSX.readFile(files.questions[0].path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const questionsData: Question[] = XLSX.utils.sheet_to_json(worksheet);
      console.log('Questions Data:', questionsData);
      for (const question of questionsData) {
        const questionDto = new CreateQuestionDto();
        questionDto.question_number = question.question_number;
        questionDto.question_text = question.question_text;
        questionDto.question_image = question.question_image;
        questionDto.part = question.part;
        questionDto.options = [
          question.option_a || '',
          question.option_b || '',
          question.option_c || '',
          question.option_d || '',
        ].filter((option) => option !== '');
        console.log('option a', question.option_a);
        questionDto.section = question.section;
        questionDto.correct_answer = question.correct_answer;
        questionDto.script = question.script;
        questionDto.passage_id = question.passage_id;
        await this.questionService.create(questionDto);
      }
    } else {
      console.log('No questions file uploaded.');
    }

    // Đọc file Excel `passages`
    if (files.passages) {
      const workbook1 = XLSX.readFile(files.passages[0].path);
      const worksheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
      const passagesData: Passage[] = XLSX.utils.sheet_to_json(worksheet1);

      for (const passage of passagesData) {
        const passageDto = new CreatePassageDto();
        passageDto._id = passage._id || '';
        passageDto.title = passage.title || ''; // Gán giá trị mặc định nếu không có
        passageDto.content = passage.content || ''; // Gán giá trị mặc định nếu không có

        // Kiểm tra xem images có tồn tại và là chuỗi không
        if (typeof passage.images === 'string') {
          passageDto.images = passage.images
            ? passage.images.split(',').map((image) => image.trim()) // Tách chuỗi thành mảng
            : [];
        } else {
          passageDto.images = [];
        }
        await this.passageService.create(passageDto);
      }
    } else {
      console.log('No passages file uploaded.');
    }

    return 'This action adds a new toeicTest';
  }

  findAll() {
    return `This action returns all toeicTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} toeicTest`;
  }

  update(id: number, updateToeicTestDto: UpdateToeicTestDto) {
    return `This action updates a #${id} toeicTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} toeicTest`;
  }
}
