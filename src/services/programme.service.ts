import { AppDataSource } from "../config/data-source";
import { CreateProgrammeDto } from "../dto/programme.dto";
import { Departement } from "../entity/Departement.entity";
import { Programme } from "../entity/Programme.entity";

export class ProgrammeService {
    private readonly programmeRepository = AppDataSource.getRepository(Programme);
    private readonly departementRepository = AppDataSource.getRepository(Departement);

    async createProgramme(data: Partial<CreateProgrammeDto>): Promise<Programme> {
        const departement = await this.departementRepository.findOneByOrFail({ id: data.departementId})

        const { departementId, ...rest } = data;
        const programme = this.programmeRepository.create({
            ...rest,
            departement
        });
        return await this.programmeRepository.save(programme);
    }

    async getProgrammeById(id: string): Promise<Programme | null> {
        return await this.programmeRepository.findOne({
            where: { id },
            relations: {courses: true}
        });
    }

    async getAllProgrammes(): Promise<Programme[]> {
        return await this.programmeRepository.find({ relations: {courses: true} });
    }

    async updateProgramme(id: string, data: Partial<Programme>): Promise<Programme | null> {
        await this.programmeRepository.update(id, data);
        return this.getProgrammeById(id);
    }

    async deleteProgramme(id: string): Promise<void> {
        await this.programmeRepository.delete(id);
    }
}
