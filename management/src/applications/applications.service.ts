import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DRIZZLE_ORM_TOKEN } from 'src/db/constants';
import { accounts, applications, jobs } from 'src/db/schema';
import { DrizzlePostgres } from 'src/db/types';
import { ApplicationDto } from './dto/application.dto';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class ApplicationsService {
  constructor(@Inject(DRIZZLE_ORM_TOKEN) private db: DrizzlePostgres) {}

  async create(createApplicationDto: ApplicationDto, userId: number) {
    const existingAccount = await this.db.query.accounts.findFirst({
      where: and(
        eq(accounts.id, createApplicationDto.accountId),
        eq(accounts.userId, userId),
      ),
    });

    if (!existingAccount) {
      throw new InternalServerErrorException('Invalid account');
    }

    const existingJob = await this.db.query.jobs.findFirst({
      where: eq(jobs.id, createApplicationDto.jobId),
    });

    if (!existingJob) {
      throw new InternalServerErrorException('Invalid job');
    }

    const [newApplication] = await this.db
      .insert(applications)
      .values({ ...createApplicationDto, userId })
      .returning();

    return newApplication;
  }

  async findAll(userId: number) {
    const userApplications = await this.db.query.applications.findMany({
      with: {
        job: true,
      },
      where: eq(applications.userId, userId),
    });

    return userApplications;
  }

  async update(
    id: number,
    userId: number,
    updateApplicationData: ApplicationDto,
  ) {
    const existingApplication = await this.db.query.applications.findFirst({
      where: and(eq(applications.id, id), eq(applications.userId, userId)),
    });

    if (!existingApplication) {
      throw new InternalServerErrorException('Invalid application');
    }

    const existingAccount = await this.db.query.accounts.findFirst({
      where: and(
        eq(accounts.id, updateApplicationData.accountId),
        eq(accounts.userId, userId),
      ),
    });

    if (!existingAccount) {
      throw new InternalServerErrorException('Invalid account');
    }

    const existingJob = await this.db.query.jobs.findFirst({
      where: eq(jobs.id, updateApplicationData.jobId),
    });

    if (!existingJob) {
      throw new InternalServerErrorException('Invalid job');
    }

    await this.db
      .update(applications)
      .set(updateApplicationData)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)));

    return { message: 'successfully updated application' };
  }

  async findOne(id: number, userId: number) {
    const application = await this.db.query.applications.findFirst({
      with: {
        job: true,
      },
      where: and(eq(applications.id, id), eq(applications.userId, userId)),
    });

    return application;
  }

  async remove(id: number, userId: number) {
    const existingApplication = await this.db.query.applications.findFirst({
      where: and(eq(applications.id, id), eq(applications.userId, userId)),
    });

    if (!existingApplication) {
      throw new InternalServerErrorException('Invalid application');
    }

    await this.db
      .delete(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)));

    return { message: 'successfully deleted application' };
  }
}
