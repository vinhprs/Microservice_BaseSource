import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LECTURE_TYPE } from '../../../shared/enums';

export class CreateLecture {
  @IsNotEmpty()
  @IsString()
  lectureName: string;

  @IsNotEmpty()
  @IsEnum(LECTURE_TYPE)
  lectureType: LECTURE_TYPE;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}
