import { AppDataSource } from "../config/data-source";
import { CreateUniversiteDto } from "../dto/universite.dto";
import { Organisation } from "../entity/Organisation.entity";
import { Universite } from "../entity/Universite.entity";
import { User } from "../entity/User.entity";

export class UniversiteService {
    private readonly universiteRepository = AppDataSource.getRepository(Universite);
    private readonly organisationRepo = AppDataSource.getRepository(Organisation);
    private readonly userRepo = AppDataSource.getRepository(User);

    async createUniversite(data: Partial<CreateUniversiteDto>): Promise<Universite> {
        const organisation = await this.organisationRepo.findOneByOrFail({ id: data.organisationId });
        const responsable = await this.userRepo.findOneByOrFail({ id: data.responsableId });

        const { organisationId, responsableId, ...rest } = data;
        const universite = this.universiteRepository.create({
            ...rest,
            organisation,
            responsable
        });
        return await this.universiteRepository.save(universite);
    }

    async getUniversiteById(id: string): Promise<Universite | null> {
        return await this.universiteRepository.findOne({
            where: { id },
            relations: { organisation: true, departements: true, responsable: true }
        });
    }

    async getAllUniversites(): Promise<Universite[]> {
        return await this.universiteRepository.find({
            relations: { organisation: true, departements: true, responsable: true }
        });
    }

    async updateUniversite(id: string, data: Partial<Universite>): Promise<Universite | null> {
        await this.universiteRepository.update(id, data);
        return this.getUniversiteById(id);
    }

    async deleteUniversite(id: string): Promise<void> {
        await this.universiteRepository.delete(id);
    }
}
