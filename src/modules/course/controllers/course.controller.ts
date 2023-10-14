import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Public, ReqUser, Roles } from '../../../common';
import { ROLES } from '../../../shared/enums';
import { CreateCourseDto } from '../dto/create-course.dto';
import { BaseApiResponse } from 'src/shared/dtos';
import { CourseOutput } from '../dto';
import { CourseService } from '../providers';
import { RequestContext } from '../../../shared/request-context/request-context.dto';

@Controller('')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('/teacher/create')
  @Roles(ROLES.TEACHER)
  @UseInterceptors(ClassSerializerInterceptor)
  async createCourse(
    @Body() data: CreateCourseDto,
    @ReqUser() ctx: RequestContext,
  ): Promise<BaseApiResponse<CourseOutput>> {
    return this.courseService.create(ctx.user.id, data);
  }

  @Get('')
  @Public()
  async getCourses(): Promise<BaseApiResponse<CourseOutput[]>> {
    return this.courseService.getCourses();
  }
}
