import { Injectable } from '@nestjs/common';
import { ApplicationsService } from './applications/applications.service';
import { JobsService } from './jobs/jobs.service';
import { AccountsService } from './accounts/accounts.service';

@Injectable()
export class WebhookService {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly jobsService: JobsService,
    private readonly accountsService: AccountsService,
  ) {}

  async handleWebhook(userId: number, webhook: Webhook) {
    switch (webhook.event_type) {
      case 'proposal_created':
        return this.handleProposalCreated(
          userId,
          webhook.payload as ProposalCreatedPayload,
        );
    }
  }

  private async handleProposalCreated(
    userId: number,
    payload: ProposalCreatedPayload,
  ) {
    console.log(payload);

    let job = await this.jobsService.findOneByLink(payload.jobId);
    if (!job) {
      job = await this.jobsService.create({
        link: payload.jobId,
        title: payload.jobTitle,
        description: payload.jobDescription,
        skills: payload.skills,
      });
    }

    const account = await this.accountsService.findOneByName(
      payload.accountName,
    );
    if (!account) {
      throw new Error('Account not found');
    }

    const application = await this.applicationsService.create(
      {
        jobId: job.id,
        accountId: account.id,
        coverLetter: payload.coverLetter,
        extraQuestions: payload.additionalQuestions,
        keywords: payload.keywords,
        status: payload.status,
      },
      userId,
    );

    return application;
  }
}
