import {FastifyReply as Reply, FastifyRequest as Request} from 'fastify';
import {Controller, GET, Inject, POST} from 'fastify-decorators';
import {
  hasBearerToken,
  userIsAuthenticated,
  driverIsAuthenticated,
} from '../../guards/auth-guard.hook';
import {BugReportService} from './bug-report.service';
import {
  CreateDriverReportBugBody,
  CreateDriverReportBugBodyType,
} from './schemas/create-driver-report-bug.body';
import {
  CreateUserReportBugBody,
  CreateUserReportBugBodyType,
} from './schemas/create-user-report-bug.body';

@Controller('/v1/bug-reports')
export class BugReportController {
  @Inject(BugReportService)
  private readonly bugReportService: BugReportService;

  @GET('/')
  async getBugReports() {
    return this.bugReportService.getAll();
  }

  @POST('/users', {
    onRequest: [hasBearerToken, userIsAuthenticated],
    schema: {
      body: CreateUserReportBugBody,
    },
  })
  async createUserBugReport(
    request: Request<{
      Body: CreateUserReportBugBodyType;
    }>,
    reply: Reply,
  ) {
    return this.bugReportService.createUserBugReport(
      request.user?.id!,
      request.body,
    );
  }

  @POST('/drivers', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
    schema: {
      body: CreateDriverReportBugBody,
    },
  })
  async createDriverBugReport(
    request: Request<{
      Body: CreateDriverReportBugBodyType;
    }>,
    reply: Reply,
  ) {
    return this.bugReportService.createDriverBugReport(
      request.user?.id!,
      request.body,
    );
  }
}
