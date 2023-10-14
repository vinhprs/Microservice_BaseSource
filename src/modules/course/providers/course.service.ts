import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../entities';
import { Repository } from 'typeorm';
import { CourseOutput, CreateCourseDto } from '../dto';
import { AxiosRequestYoutube, BaseApiResponse } from '../../../shared/dtos';
import { SectionService } from './section.service';
import { UserService } from '../../../modules/user/providers';
import { MESSAGES } from '../../../common/constants';
import { plainToInstance } from 'class-transformer';
import { ApiService } from '../../../shared/providers';
import { formatDuration } from 'src/shared/utils/string.util';

@Injectable()
export class CourseService {
  DOMAIN = 'https://www.googleapis.com/youtube/v3';
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly sectionService: SectionService,
    private readonly userService: UserService,
    private readonly api: ApiService,
  ) {}

  async create(
    teacherId: string,
    data: CreateCourseDto,
  ): Promise<BaseApiResponse<CourseOutput>> {
    const teacher = await this.userService.getUserByUserId(teacherId);
    if (!teacher)
      throw new HttpException(
        {
          error: true,
          data: null,
          message: MESSAGES.NOT_FOUND_USER,
          code: 404,
        },
        HttpStatus.NOT_FOUND,
      );
    const { sections } = data;
    const course = this.courseRepository.create(data);
    const includeSections = this.sectionService.create(sections);

    const createCourse = await this.courseRepository.save({
      ...course,
      sections: includeSections,
      teacherId,
    });
    const result = plainToInstance(CourseOutput, createCourse, {
      excludeExtraneousValues: true,
    });

    return {
      error: false,
      data: result,
      message: MESSAGES.CREATED_SUCCEED,
      code: 200,
    };
  }

  async getCourses(): Promise<any> {
    const query: AxiosRequestYoutube = {
      playlistId: 'PLOVaCZ_HQkvfVitVNby1tzl4Yed_kItOf',
      key: 'AIzaSyCXgdDPtFNj4-HhXNcXgUV-hHDPjduv6mo',
      part: 'snippet',
      maxResults: 50,
    };
    const courses: any = await this.api.videoYoutube(
      this.DOMAIN,
      '/playlistItems',
      query,
    );
    await Promise.all(
      courses.items.map(async (course: any) => {
        const query: AxiosRequestYoutube = {
          key: 'AIzaSyCXgdDPtFNj4-HhXNcXgUV-hHDPjduv6mo',
          part: 'contentDetails',
          id: course.snippet.resourceId.videoId,
        };
        const videos = await this.api.videoYoutube(
          this.DOMAIN,
          '/videos',
          query,
        );
        course.duration = formatDuration(
          videos.items[0].contentDetails.duration,
        );
      }),
    );
    return courses;
  }
}
