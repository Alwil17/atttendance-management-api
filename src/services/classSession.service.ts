import { AppDataSource } from "../config/data-source";
import { CreateClassSessionDto } from "../dto/class-session.dto";
import { AcademicYear } from "../entity/AcademicYear.entity";
import { ClassSession } from "../entity/ClassSession.entity";
import { Course } from "../entity/Course.entity";
import { Organisation } from "../entity/Organisation.entity";
import { Universite } from "../entity/Universite.entity";
import { User } from "../entity/User.entity";

export class ClassSessionService {
    private readonly sessionRepository = AppDataSource.getRepository(ClassSession);
    private readonly academicYearRepository = AppDataSource.getRepository(AcademicYear);
    private readonly courseRepository = AppDataSource.getRepository(Course);
    private readonly userRepo = AppDataSource.getRepository(User);

    async createClassSession(data: Partial<CreateClassSessionDto>): Promise<ClassSession> {
        const academicYear = await this.academicYearRepository.findOneByOrFail({ id: data.academicYearId });
        const professor = await this.userRepo.findOneByOrFail({ id: data.professorId });
        const classRepresentative = await this.userRepo.findOneByOrFail({ id: data.classRepresentativeId });
        const course = await this.courseRepository.findOneByOrFail({ id: data.courseId });

        const { courseId, academicYearId, professorId, classRepresentativeId, ...rest } = data;
        const session = this.sessionRepository.create({
            ...rest,
            academicYear,
            course,
            professor,
            classRepresentative
        });
        
        return await this.sessionRepository.save(session);
    }

    async getClassSessionById(id: string): Promise<ClassSession | null> {
        return await this.sessionRepository.findOne({
            where: { id },
            relations: { academicYear: true, course: true, professor: true, classRepresentative: true }
        });
    }

    async getAllClassSessions(): Promise<ClassSession[]> {
        return await this.sessionRepository.find({
            relations: { academicYear: true, course: true, professor: true, classRepresentative: true }
        });
    }

    async updateClassSession(id: string, data: Partial<ClassSession>): Promise<ClassSession | null> {
        await this.sessionRepository.update(id, data);
        return this.getClassSessionById(id);
    }

    async deleteClassSession(id: string): Promise<void> {
        await this.sessionRepository.delete(id);
    }
}
