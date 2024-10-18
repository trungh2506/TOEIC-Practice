import { Injectable } from '@nestjs/common';
import { CreateToeicTestDto } from './dto/create-toeic_test.dto';
import { UpdateToeicTestDto } from './dto/update-toeic_test.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Toeic_Test } from './schemas/toeic_test.schema';

import * as XLSX from 'xlsx';
import { PassageService } from 'src/passage/passage.service';
import { CreatePassageDto } from 'src/passage/dto/create-passage.dto';
import { Passage } from 'src/interface/passage.interface';
import { QuestionService } from 'src/question/question.service';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { Question } from 'src/interface/question.interface';
import { paginate } from 'src/common/pagination/pagination.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Injectable()
export class ToeicTestService {
  constructor(
    private readonly passageService: PassageService,
    private readonly questionService: QuestionService,
    @InjectModel(Toeic_Test.name) private toeicTestModel: Model<Toeic_Test>,
  ) {}

  async create(
    files: {
      testImage?: Express.Multer.File;
      questions?: Express.Multer.File;
      passages?: Express.Multer.File;
      images?: Express.Multer.File[];
      audios?: Express.Multer.File[];
    },
    toeic_test_title: string,
  ) {
    const toeicTestDto = new CreateToeicTestDto();
    toeicTestDto.title = toeic_test_title;
    console.log('files.testImage', files.testImage);
    toeicTestDto.image = files.testImage[0].originalname;
    if (!toeicTestDto.listening) toeicTestDto.listening = [];
    if (!toeicTestDto.reading) toeicTestDto.reading = [];
    if (!toeicTestDto.passages) toeicTestDto.passages = [];

    // Passages
    if (files.passages) {
      const workbook1 = XLSX.readFile(files.passages[0].path);
      const worksheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
      const passagesData: Passage[] = XLSX.utils.sheet_to_json(worksheet1);

      for (const passage of passagesData) {
        const passageDto = new CreatePassageDto();
        passageDto._id = passage._id || '';
        passageDto.title = passage.title || '';
        passageDto.content = passage.content || '';

        // Kiểm tra xem images có tồn tại và là chuỗi không
        if (typeof passage.images === 'string') {
          passageDto.images = passage.images
            ? passage.images.split(',').map((image) => image.trim()) // Tách chuỗi thành mảng
            : [];
        } else {
          passageDto.images = [];
        }
        const newPassage = await this.passageService.create(passageDto);
        toeicTestDto.passages.push(newPassage);
      }
    } else {
      console.log('No passages file uploaded.');
    }

    //Questions

    if (files.questions) {
      const workbook = XLSX.readFile(files.questions[0].path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const questionsData: Question[] = XLSX.utils.sheet_to_json(worksheet);
      // console.log('Questions Data:', questionsData);
      for (const question of questionsData) {
        const questionDto = new CreateQuestionDto();
        questionDto.question_number = question.question_number;
        questionDto.question_text = question.question_text;
        questionDto.question_image = question.question_image;
        questionDto.question_audio = question.question_audio;
        questionDto.part = question.part;
        questionDto.options = [
          question.option_a || '',
          question.option_b || '',
          question.option_c || '',
          question.option_d || '',
        ];
        questionDto.section = question.section;
        questionDto.correct_answer = question.correct_answer;
        questionDto.script = question.script;
        questionDto.passage_id = question.passage_id;

        const newQuestion = await this.questionService.create(questionDto);
        if (questionDto.section.includes('listening')) {
          toeicTestDto.listening.push(newQuestion);
        } else toeicTestDto.reading.push(newQuestion);
      }
    } else {
      console.log('No questions file uploaded.');
    }

    const newToeicTest = new this.toeicTestModel(toeicTestDto);
    newToeicTest.save();
    return 'This action adds a new toeicTest';
  }

  async findAll(paginationDto: PaginationDto) {
    // const toeicTests = await this.toeicTestModel
    //   .find()
    //   .select('title image meta_data');
    const projection = { title: 1, image: 1 };
    const filter = {};
    const toeicTests = await paginate(
      this.toeicTestModel,
      paginationDto,
      filter,
      projection,
    );

    return toeicTests;
  }

  async findOne(id: string) {
    const toeicTest = await this.toeicTestModel
      .findById(id)
      .populate({
        path: 'listening',
        model: 'Question',
        populate: {
          path: 'passage_id',
          model: 'Passage',
        },
      })
      .populate({
        path: 'reading',
        model: 'Question',
        populate: {
          path: 'passage_id',
          model: 'Passage',
        },
      });

    const allQuestion = [...toeicTest.listening, ...toeicTest.reading];

    // Nhóm các câu hỏi theo passage_id
    const groupedQuestions = allQuestion.reduce((acc, question) => {
      const passageId = question.passage_id?._id || 'no-passage';
      if (!acc[passageId]) {
        acc[passageId] = {
          passage: question.passage_id,
          questions: [],
        };
      }
      acc[passageId].questions.push(question);
      return acc;
    }, {});

    // Chuyển đổi đối tượng nhóm thành mảng
    const groupedArray = Object.values(groupedQuestions);

    // return groupedArray;
    return toeicTest;
  }

  update(id: number, updateToeicTestDto: UpdateToeicTestDto) {
    return `This action updates a #${id} toeicTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} toeicTest`;
  }

  async getTotalQuestion(toeic_test_id: string) {
    const toeic_test = await this.toeicTestModel.findById(toeic_test_id);
    if (!toeic_test) {
      throw new Error('Toeic test not found');
    }
    let total = toeic_test.listening.length + toeic_test.reading.length;
    return total;
  }
  //Practice
  async getPart(toeic_test_id: string, part_number: number) {
    const toeicTest = await this.toeicTestModel
      .findById(toeic_test_id)
      .populate({
        path: 'listening',
        match: { part: part_number },
        populate: { path: 'passage_id', select: 'title content images' }, // Lấy thông tin của passage
      })
      .populate({
        path: 'reading',
        match: { part: part_number },
        populate: { path: 'passage_id', select: 'title content images' }, // Lấy thông tin của passage
      })
      .exec();

    const partListening = toeicTest.listening;
    const partReading = toeicTest.reading;

    return toeicTest;
    // return { partListening, partReading };
  }
}
