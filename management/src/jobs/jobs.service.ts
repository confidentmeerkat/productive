import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_ORM_TOKEN } from 'src/db/constants';
import { DrizzlePostgres } from 'src/db/types';
import { JobDto } from './dto/job.dto';
import { jobs } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class JobsService {
  constructor(@Inject(DRIZZLE_ORM_TOKEN) private db: DrizzlePostgres) {}

  async findAll() {
    const jobs = await this.db.query.jobs.findMany();

    return jobs;
  }

  async create(jobDto: JobDto) {
    const [newJob] = await this.db.insert(jobs).values(jobDto).returning();

    return newJob;
  }

  async update(id: number, jobDto: JobDto) {
    await this.db.update(jobs).set(jobDto);

    return { message: 'successfully updated job' };
  }

  async findOne(id: number) {
    const job = await this.db.query.jobs.findFirst({ where: eq(jobs.id, id) });

    return job;
  }

  async findOneByLink(link: string) {
    const job = await this.db.query.jobs.findFirst({
      where: eq(jobs.link, link),
    });

    return job;
  }

  async remove(id: number) {
    await this.db.delete(jobs).where(eq(jobs.id, id));

    return { message: 'successfully removed job' };
  }
}
