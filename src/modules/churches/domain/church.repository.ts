import { Church } from './church.entity';

export abstract class ChurchRepository {
    abstract findById(id: string): Promise<Church | null>;
    abstract findBySlug(slug: string): Promise<Church | null>;
    abstract create(data: { name: string; slug: string }): Promise<Church>;
    abstract delete(id: string): Promise<Church>;
    abstract update(id: string, data: Partial<Church>): Promise<Church>;
}
