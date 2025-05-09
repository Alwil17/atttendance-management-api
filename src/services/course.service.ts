// CourseService as SubjectService
import { AppDataSource } from "../config/data-source";
import { CreateCourseDto } from "../dto/course.dto";
import { Course } from "../entity/Course.entity";
import { Programme } from "../entity/Programme.entity";

export class CourseService {
    private readonly courseRepository = AppDataSource.getRepository(Course);
    private readonly programRepository = AppDataSource.getRepository(Programme);

    async createCourse(data: Partial<CreateCourseDto>): Promise<Course> {
        const programme = await this.programRepository.findOneByOrFail({ id: data.programmeId})

        const { programmeId, ...rest } = data;
        const course = this.courseRepository.create({
            ...rest,
            programme
        });

        return await this.courseRepository.save(course);
    }

    async getCourseById(id: string): Promise<Course | null> {
        return await this.courseRepository.findOne({ where: { id } });
    }

    async getAllCourses(): Promise<Course[]> {
        return await this.courseRepository.find();
    }

    async updateCourse(id: string, data: Partial<Course>): Promise<Course | null> {
        await this.courseRepository.update(id, data);
        return this.getCourseById(id);
    }

    async deleteCourse(id: string): Promise<void> {
        await this.courseRepository.delete(id);
    }
}
