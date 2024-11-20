import { Types } from 'mongoose';

export interface IQuestion {
  question_number: number;
  question_text?: string;
  question_image: string;
  question_audio: string;
  part: number;
  section: string;
  options: string[];
  correct_answer: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  script?: string;
  passage_id: string;
}
