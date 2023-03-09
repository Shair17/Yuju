import {Constructor} from 'fastify-decorators/decorators/helpers/inject-dependencies';
import {BugReportController} from './bug-report.controller';

export const BugReportModule: Constructor<unknown>[] = [BugReportController];
