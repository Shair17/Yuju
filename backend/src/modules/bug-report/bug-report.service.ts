import {Inject, Service} from 'fastify-decorators';
import {UserService} from '../user/user.service';
import {DriverService} from '../driver/driver.service';
import {CreateUserReportBugBodyType} from './schemas/create-user-report-bug.body';
import {CreateDriverReportBugBodyType} from './schemas/create-driver-report-bug.body';
import {DatabaseService} from '../../database/database.service';
import {trimStrings} from '../../common/utils/string';

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
