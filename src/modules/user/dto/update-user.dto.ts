import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { AddressInput } from '../../../modules/address/dto/address-input.dto';

export class UpdateUserInput {
  @IsString()
  @IsOptional()
  @Length(5, 50)
  fullname?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  gender?: boolean;

  // @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => AddressInput)
  address?: AddressInput;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  subjects?: number[];

  @IsNumber()
  @IsOptional()
  subjectGroup?: number;
}
