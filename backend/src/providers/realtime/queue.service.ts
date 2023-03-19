import {Inject, Service, Initializer, Destructor} from 'fastify-decorators';
import {LoggerService} from '../../common/logger/logger.service';
import {AuthTokenPayload} from '../../interfaces/tokens';
import {ILocation} from './realtime.service';
import {OnModuleInit, OnModuleDestroy} from '../../interfaces/module';

interface Location {
  location: ILocation;
}

interface Driver extends AuthTokenPayload, Location {}

interface User extends AuthTokenPayload, Location {}

@Service('QueueServiceToken')
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private driversQueue = new Map<string, Driver>();
  private inRideQueue = new Map<string, Driver>();
  private usersQueue = new Map<string, User>();

  private timer: NodeJS.Timer;

  @Inject(LoggerService)
  private readonly loggerService: LoggerService;

  @Initializer()
  onModuleInit() {
    this.timer = setInterval(() => {
      for (const [id, {name, location}] of this.usersQueue) {
        this.loggerService.info(
          `[${id}]: ${name} -> [latitude: ${location?.latitude}] - [longitude: ${location?.longitude}]`,
        );
      }
    }, 1e3);
  }

  @Destructor()
  onModuleDestroy() {
    clearInterval(this.timer);
  }

  /** Users */
  enqueueToUsers(user: User): void {
    if (!this.existsInUsersQueue(user.id)) {
      this.loggerService.info(
        `[${user.id}] ${
          user.name
        } connected to [UsersQueue] at ${new Date().toLocaleString()}`,
      );
    }

    this.usersQueue.set(user.id, user);
  }

  editUsersQueue(user: User): void {
    if (!this.existsInUsersQueue(user.id)) return;

    this.enqueueToUsers(user);
  }

  getFromUsersQueue(id: string) {
    return this.usersQueue.get(id);
  }

  deleteFromUsersQueue(id: string) {
    const user = this.getFromUsersQueue(id);

    const isDeleted = this.usersQueue.delete(id);

    if (isDeleted && user) {
      this.loggerService.info(
        `[${user.id}] ${
          user.name
        } disconnected from [UsersQueue] at ${new Date().toLocaleString()}`,
      );
    } else {
      this.loggerService.info(
        `[${id}] User disconnected from [UsersQueue] at ${new Date().toLocaleString()}`,
      );
    }
  }

  existsInUsersQueue(id: string): boolean {
    return this.usersQueue.has(id);
  }

  usersQueueSize(): number {
    return this.usersQueue.size;
  }

  usersQueueIsEmpty(): boolean {
    return this.usersQueueSize() === 0;
  }

  /** Drivers */
  enqueueToDrivers(driver: Driver): void {
    if (!this.existsInDriversQueue(driver.id)) {
      this.loggerService.info(
        `[${driver.id}] ${
          driver.name
        } connected to [DriversQueue] at ${new Date().toLocaleString()}`,
      );
    }

    this.driversQueue.set(driver.id, driver);
  }

  editDriversQueue(driver: Driver): void {
    if (!this.existsInDriversQueue(driver.id)) return;

    this.enqueueToDrivers(driver);
  }

  getFromDriversQueue(id: string) {
    return this.driversQueue.get(id);
  }

  deleteFromDriversQueue(id: string) {
    const driver = this.getFromDriversQueue(id);

    const isDeleted = this.driversQueue.delete(id);

    if (isDeleted && driver) {
      this.loggerService.info(
        `[${driver.id}] ${
          driver.name
        } disconnected from [DriversQueue] at ${new Date().toLocaleString()}`,
      );
    } else {
      this.loggerService.info(
        `[${id}] Driver disconnected from [DriversQueue] at ${new Date().toLocaleString()}`,
      );
    }
  }

  existsInDriversQueue(id: string): boolean {
    return this.driversQueue.has(id);
  }

  driversQueueSize(): number {
    return this.driversQueue.size;
  }

  driversQueueIsEmpty(): boolean {
    return this.driversQueueSize() === 0;
  }

  /** In Ride */
  /** Modificar Driver a otro tipo de dato */
  enqueueToInRide(driver: Driver): void {
    this.inRideQueue.set(driver.id, driver);
  }

  editInRideQueue(driver: Driver): void {
    if (!this.existsInRideQueue(driver.id)) return;

    this.enqueueToInRide(driver);
  }

  getFromInRideQueue(id: string) {
    return this.inRideQueue.get(id);
  }

  deleteFromInRideQueue(id: string) {
    const inRide = this.getFromInRideQueue(id);

    const isDeleted = this.driversQueue.delete(id);

    if (isDeleted && inRide) {
      this.loggerService.info(
        `[${inRide.id}] ${
          inRide.name
        } disconnected from [InRideQueue] at ${new Date().toLocaleString()}`,
      );
    } else {
      this.loggerService.info(
        `[${id}] Driver disconnected from [InRideQueue] at ${new Date().toLocaleString()}`,
      );
    }
  }

  existsInRideQueue(id: string): boolean {
    return this.inRideQueue.has(id);
  }

  inRideQueueSize(): number {
    return this.inRideQueue.size;
  }

  inRideQueueIsEmpty(): boolean {
    return this.inRideQueueSize() === 0;
  }

  sizes() {
    return {
      users: this.usersQueueSize(),
      drivers: this.driversQueueSize(),
      inRide: this.inRideQueueSize(),
    };
  }
}
