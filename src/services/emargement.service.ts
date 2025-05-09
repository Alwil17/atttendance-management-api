import { AppDataSource } from "../config/data-source";
import { CreateEmargementDto } from "../dto/emargement.dto";
import { ClassSession } from "../entity/ClassSession.entity";
import { Emargement, EmargementStatus } from "../entity/Emargement.entity";
import { User } from "../entity/User.entity";

export class EmargementService {
    private readonly emargementRepository = AppDataSource.getRepository(Emargement);
    private readonly userRepo = AppDataSource.getRepository(User);
    private readonly sessionRepository = AppDataSource.getRepository(ClassSession);

    async createEmargement(data: Partial<CreateEmargementDto>): Promise<Emargement> {
        const professor = await this.userRepo.findOneByOrFail({ id: data.professorId });
        const classSession = await this.sessionRepository.findOneByOrFail({ id: data.classSessionId });

        const { professorId, classSessionId, ...rest } = data;
        const emargement = this.emargementRepository.create({
            ...rest,
            professor,
            classSession
        });
        return await this.emargementRepository.save(emargement);
    }

    async getEmargementById(id: string): Promise<Emargement | null> {
        return await this.emargementRepository.findOne({
            where: { id },
            relations: { classSession: true, professor: true}
        });
    }

    async getAllEmargements(): Promise<Emargement[]> {
        return await this.emargementRepository.find({
            relations: { classSession: true, professor: true}
        });
    }

    async updateEmargement(id: string, data: Partial<Emargement>): Promise<Emargement | null> {
        await this.emargementRepository.update(id, data);
        return this.getEmargementById(id);
    }

    async setStatus(id: string, status: EmargementStatus): Promise<boolean> {
        const emargement = await this.getEmargementById(id);
        if (emargement) {
            if (
                status === EmargementStatus.CLASS_HEADER_CONFIRMED && emargement.status === EmargementStatus.SUPERVISOR_CONFIRMED 
                || status === EmargementStatus.SUPERVISOR_CONFIRMED && emargement.status === EmargementStatus.CLASS_HEADER_CONFIRMED
            ) {
                emargement.status = EmargementStatus.PRESENT;
            } else if (emargement.status === EmargementStatus.PENDING && status !== EmargementStatus.PENDING) { // oblige les deux validations
                emargement.status = status;
            } else {
                return false;
            }

            return await this.emargementRepository.save(emargement).then(() => true);
        }
    }

    async deleteEmargement(id: string): Promise<void> {
        await this.emargementRepository.delete(id);
    }
}
