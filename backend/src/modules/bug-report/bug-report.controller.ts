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
import {
  GetDriverBugReportsQuery,
  GetDriverBugReportsQueryType,
} from './schemas/get-driver-bug-reports.query';
import {
  GetUserBugReportsQuery,
  GetUserBugReportsQueryType,
} from './schemas/get-user-bug-reports.query';

@Controller('/v1/bug-reports')
export class BugReportController {
  @Inject(BugReportService)
  private readonly bugReportService: BugReportService;

  @GET('/users', {
    onRequest: [hasBearerToken, userIsAuthenticated],
    schema: {
      querystring: GetUserBugReportsQuery,
    },
  })
  async getUserBugReports(
    request: Request<{
      Querystring: GetUserBugReportsQueryType;
    }>,
    reply: Reply,
  ) {
    return this.bugReportService.getUserBugReports(
      request.user?.id!,
      request.query,
    );
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

  @GET('/drivers', {
    onRequest: [hasBearerToken, driverIsAuthenticated],
    schema: {
      querystring: GetDriverBugReportsQuery,
    },
  })
  async getDriverBugReports(
    request: Request<{
      Querystring: GetDriverBugReportsQueryType;
    }>,
    reply: Reply,
  ) {
    return this.bugReportService.getDriverBugReports(
      request.driver?.id!,
      request.query,
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
      request.driver?.id!,
      request.body,
    );
  }
}
