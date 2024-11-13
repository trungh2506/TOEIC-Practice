import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateToeicTestDto } from './dto/create-toeic_test.dto';
import { UpdateToeicTestDto } from './dto/update-toeic_test.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Toeic_Test } from './schemas/toeic_test.schema';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { PassageService } from 'src/passage/passage.service';
import { CreatePassageDto } from 'src/passage/dto/create-passage.dto';
import { Passage } from 'src/interface/passage.interface';
import { QuestionService } from 'src/question/question.service';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { Question } from 'src/interface/question.interface';
import { paginate } from 'src/common/pagination/pagination.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { ToeicTestType } from 'src/enum/toeic-type.enum';
import { DropboxService } from 'src/dropbox/dropbox.service';

@Injectable()
export class ToeicTestService {
  constructor(
    private readonly passageService: PassageService,
    private readonly questionService: QuestionService,
    private readonly dropBoxService: DropboxService,
    @InjectModel(Toeic_Test.name) private toeicTestModel: Model<Toeic_Test>,
  ) {}

  async create(
    files: {
      testImage?: Express.Multer.File;
      questions?: Express.Multer.File;
      passages?: Express.Multer.File;
      images?: Express.Multer.File[];
      audios?: Express.Multer.File[];
      fullAudio?: Express.Multer.File;
    },
    toeic_test_title: string,
    toeic_test_type: ToeicTestType,
  ) {
    const toeicTestDto = new CreateToeicTestDto();
    toeicTestDto.title = toeic_test_title;
    toeicTestDto.type = toeic_test_type;

    // Upload các file testImage và fullAudio lên Dropbox
    if (files.testImage) {
      console.log(
        'Uploading Toeic Test Image to Dropbox...',
        files.testImage[0].originalname,
      );
      toeicTestDto.image = await this.dropBoxService.uploadFile(
        files.testImage[0].buffer,
        `/toeic_tests/${toeic_test_title}/testImage/${files.testImage[0].originalname}`,
      );
      console.log('Toeic Test Image uploaded:', toeicTestDto.image);
    }
    if (files.fullAudio) {
      console.log(
        'Uploading Full Audio to Dropbox...',
        files.fullAudio[0].originalname,
      );
      toeicTestDto.full_audio = await this.dropBoxService.uploadFile(
        files.fullAudio[0].buffer,
        `/toeic_tests/${toeic_test_title}/fullAudio/${files.fullAudio[0].originalname}`,
      );
      console.log('Full Audio uploaded:', toeicTestDto.full_audio);
    }

    // Khởi tạo các trường nếu chưa có
    toeicTestDto.listening = toeicTestDto.listening || [];
    toeicTestDto.reading = toeicTestDto.reading || [];
    toeicTestDto.passages = toeicTestDto.passages || [];

    // **Xử lý passages**
    if (files.passages) {
      const workbook1 = XLSX.read(files.passages[0].buffer, {
        type: 'buffer',
      });
      const worksheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
      const passagesData: Passage[] = XLSX.utils.sheet_to_json(worksheet1);

      // Lặp qua tất cả các passage và xử lý
      for (const passage of passagesData) {
        const passageDto = new CreatePassageDto();
        passageDto.id = passage.id || '';
        passageDto.title = passage.title || '';
        passageDto.content = passage.content || '';
        passageDto.audio = passage.audio || '';
        passageDto.part = passage.part || 0;
        passageDto.questions = passage.questions
          ?.split(',')
          .map((question) => Number(question.trim()))
          .filter((num) => !isNaN(num));

        // Upload hình ảnh nếu có
        if (passage.images && typeof passage.images === 'string') {
          const imagePaths = passage.images.split(',').map((img) => img.trim());
          passageDto.images = await Promise.all(
            imagePaths.map(async (imgPath) => {
              const imgFile = files.images?.find(
                (img) => img.originalname === imgPath,
              );
              if (imgFile) {
                console.log(
                  `Uploading images for passage: ${imgFile.originalname}`,
                );
                return this.dropBoxService.uploadFile(
                  imgFile.buffer,
                  `/toeic_tests/${toeic_test_title}/images/${imgFile.originalname}`,
                );
              }
            }),
          );
        }
        // Upload audio nếu có
        if (passage.audio && typeof passage.audio === 'string') {
          const audioFile = files.audios?.find(
            (audio) => audio.originalname === passage.audio,
          );
          if (audioFile) {
            console.log(
              `Uploading audio for passage: ${audioFile.originalname}`,
            );
            passageDto.audio = await this.dropBoxService.uploadFile(
              audioFile.buffer,
              `/toeic_tests/${toeic_test_title}/audios/${audioFile.originalname}`,
            );
          }
        }

        // Tạo passage mới
        const newPassage = await this.passageService.create(passageDto);
        toeicTestDto.passages.push(newPassage);
      }
    } else {
      console.log('No passages file uploaded.');
    }

    // **Xử lý questions**
    if (files.questions) {
      const workbook = XLSX.read(files.questions[0].buffer, {
        type: 'buffer',
      });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const questionsData: Question[] = XLSX.utils.sheet_to_json(worksheet);

      // Lặp qua tất cả các câu hỏi và xử lý
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

        // Upload question audio nếu có
        if (question.question_audio) {
          const audioFile = files.audios?.find(
            (audio) => audio.originalname === question.question_audio,
          );
          if (audioFile) {
            console.log(`Uploading question audio: ${audioFile.originalname}`);
            questionDto.question_audio = await this.dropBoxService.uploadFile(
              audioFile.buffer,
              `/toeic_tests/${toeic_test_title}/audios/${audioFile.originalname}`,
            );
          }
        }
        // Upload question image nếu có
        if (question.question_image) {
          const imageFile = files.images?.find(
            (image) => image.originalname === question.question_image,
          );
          if (imageFile) {
            console.log(`Uploading question image: ${imageFile.originalname}`);
            questionDto.question_image = await this.dropBoxService.uploadFile(
              imageFile.buffer,
              `/toeic_tests/${toeic_test_title}/images/${imageFile.originalname}`,
            );
          }
        }

        // Tạo câu hỏi mới
        const newQuestion = await this.questionService.create(questionDto);
        if (questionDto.section.includes('listening')) {
          toeicTestDto.listening.push(newQuestion);
        } else {
          toeicTestDto.reading.push(newQuestion);
        }
      }
    } else {
      console.log('No questions file uploaded.');
    }

    // Tạo ToeicTest mới và lưu vào cơ sở dữ liệu
    const newToeicTest = new this.toeicTestModel(toeicTestDto);
    await newToeicTest.save();
    return newToeicTest;
  }

  async findAll(paginationDto: PaginationDto) {
    const projection = { title: 1, image: 1, type: 1 };
    const filter = { 'meta_data.is_deleted': false };
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
        // populate: {
        //   path: 'passage_id',
        //   model: 'Passage',
        // },
      })
      .populate({
        path: 'reading',
        model: 'Question',
        // populate: {
        //   path: 'passage_id',
        //   model: 'Passage',
        // },
      })
      .populate({
        path: 'passages',
        model: 'Passage',
      });

    const allQuestion = [...toeicTest.listening, ...toeicTest.reading];

    // Nhóm các câu hỏi theo passage_id
    const groupedQuestions = allQuestion.reduce((acc, question) => {
      const passageId = question.passage_id?.id || 'no-passage';
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

  remove(id: string) {
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
        // populate: { path: 'passage_id', select: 'title content images' }, // Lấy thông tin của passage
      })
      .populate({
        path: 'reading',
        match: { part: part_number },
        // populate: { path: 'passage_id', select: 'title content images' }, // Lấy thông tin của passage
      })
      .populate({
        path: 'passages',
        match: { part: part_number },
      })
      .exec();

    const partListening = toeicTest.listening;
    const partReading = toeicTest.reading;

    return toeicTest;
    // return { partListening, partReading };
  }
}
