import {Inject, Service} from 'fastify-decorators';
import {UserService} from '../user/user.service';
import {DriverService} from '../driver/driver.service';
import {CreateUserReportBugBodyType} from './schemas/create-user-report-bug.body';
import {CreateDriverReportBugBodyType} from './schemas/create-driver-report-bug.body';
import {DatabaseService} from '../../database/database.service';
import {trimStrings} from '../../common/utils/string';
import {GetUserBugReportsQueryType} from './schemas/get-user-bug-reports.query';
import {GetDriverBugReportsQueryType} from './schemas/get-driver-bug-reports.query';

@Service('BugReportServiceToken')
export class BugReportService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(DriverService)
  private readonly driverService: DriverService;

  async getAll() {
    return this.databaseService.bugReport.findMany();
  }

  async getMyUsersCount(id: string) {
    return this.databaseService.bugReport.count({
      where: {
        user: {
          id,
        },
      },
    });
  }

  async getMyDriversCount(id: string) {
    return this.databaseService.bugReport.count({
      where: {
        driver: {
          id,
        },
      },
    });
  }

  async getUserBugReports(id: string, data: GetUserBugReportsQueryType) {
    const user = await this.userService.findByIdOrThrow(id);

    const {limit, page} = data;

    const reports = await this.databaseService.bugReport.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        extra: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalReports = await this.getMyUsersCount(id);

    const totalPages = Math.ceil(totalReports / limit);

    return {
      reports,
      page,
      limit,
      totalPages,
      totalReports,
    };
  }

  async getDriverBugReports(id: string, data: GetDriverBugReportsQueryType) {
    const driver = await this.driverService.findByIdOrThrow(id);

    const {limit, page} = data;

    const reports = await this.databaseService.bugReport.findMany({
      where: {
        driver: {
          id: driver.id,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        extra: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalReports = await this.getMyDriversCount(id);

    const totalPages = Math.ceil(totalReports / limit);

    return {
      reports,
      page,
      limit,
      totalPages,
      totalReports,
    };
  }

  async createUserBugReport(id: string, data: CreateUserReportBugBodyType) {
    const [title, description] = trimStrings(data.title, data.description);
    const user = await this.userService.findByIdOrThrow(id);

    const createdBugReport = await this.databaseService.bugReport.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        title,
        description,
        extra: data.extra ?? null,
      },
    });

    return {
      created: true,
      report: createdBugReport,
    };
  }

  async createDriverBugReport(id: string, data: CreateDriverReportBugBodyType) {
    const [title, description] = trimStrings(data.title, data.description);
    const driver = await this.driverService.findByIdOrThrow(id);

    const createdBugReport = await this.databaseService.bugReport.create({
      data: {
        driver: {
          connect: {
            id: driver.id,
          },
        },
        title,
        description,
        extra: data.extra ?? null,
      },
    });

    return {
      created: true,
      report: createdBugReport,
    };
  }
}
