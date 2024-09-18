import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic } from './schemas/topic.schema';

@Injectable()
export class TopicService {
  constructor(@InjectModel(Topic.name) private topicModel: Model<Topic>) {}

  create(createTopicDto: CreateTopicDto) {
    return 'This action adds a new topic';
  }

  findAll() {
    return `This action returns all topic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} topic`;
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`;
  }

  remove(id: number) {
    return `This action removes a #${id} topic`;
  }
}
