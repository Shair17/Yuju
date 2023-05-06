import {Inject, Service, Initializer, Destructor} from 'fastify-decorators';
import {LoggerService} from '../../common/logger/logger.service';
import {AuthTokenPayload} from '../../interfaces/tokens';
import {getDistance} from '../../common/utils/location';
import {TripService} from '../../modules/trip/trip.service';
import {OnModuleInit, OnModuleDestroy} from '../../interfaces/module';
import {ILocation} from './realtime.service';

interface Driver extends AuthTokenPayload {
  location: ILocation;
}

interface User extends AuthTokenPayload {
  location: ILocation;
}

export interface InRide {
  // this should be trip database id
  id: string;
  user: User;
  driver: Driver;
  currentLocation: ILocation;
  // use nanoid
  trackingCode: string;
  from: {
    address?: string;
    location: ILocation;
  };
  to: {
    address?: string;
    location: ILocation;
  };
  passengersQuantity: number;
  ridePrice: number;
}

export interface InRidePending {
  // this should be trip database id
  id: string;
  // Solo hay User, el driver aún estaría pendiente...
  user: User;
  // y una vez se encuentre un driver pasaría a la otra cola de inRideQueue, y se removería de inRidePendingQueue
  from: {
    address?: string;
    location: ILocation;
  };
  to: {
    address?: string;
    location: ILocation;
  };
  passengersQuantity: number;
  ridePrice: number;
}

@Service('QueueServiceToken')
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private driversQueue = new Map<string, Driver>();
  private usersQueue = new Map<string, User>();
  private inRideQueue = new Map<string, InRide>();
  private inRidePendingQueue = new Map<string, InRidePending>();

  private timer: NodeJS.Timer;

  @Inject(TripService)
  private readonly tripService: TripService;

  @Inject(LoggerService)
  private readonly loggerService: LoggerService;

  @Initializer()
  async onModuleInit() {
    await this.loadTrips();

    this.timer = setInterval(() => {
      for (const [id, {name, location}] of this.driversQueue) {
        this.loggerService.info(
          `@DRIVERS_QUEUE [${id}]: ${name} -> [latitude: ${location?.latitude}] - [longitude: ${location?.longitude}]`,
        );
      }

      for (const [id, {name, location}] of this.usersQueue) {
        this.loggerService.info(
          `@USERS_QUEUE [${id}]: ${name} -> [latitude: ${location?.latitude}] - [longitude: ${location?.longitude}]`,
        );
      }

      for (const [
        id,
        {
          user,
          driver,
          from,
          to,
          trackingCode,
          passengersQuantity,
          ridePrice,
          currentLocation,
        },
      ] of this.inRideQueue) {
        this.loggerService.info(
          `@IN_RIDE_QUEUE [${id}]: Passenger: ${user.name} is with Driver: ${
            driver.name
          } (${passengersQuantity} passenger(s)) and price (S/${ridePrice}) from ${
            !!from.address ? `(${from.address})` : ''
          } [latitude: ${from.location.latitude}] - [longitude: ${
            from.location.longitude
          }] to ${!!to.address ? `(${to.address})` : ''} [latitude: ${
            to.location.latitude
          }] - [longitude: ${
            to.location.longitude
          }] with tracking code ${trackingCode} and their current location is [latitude: ${
            currentLocation.latitude
          }] - [longitude: ${currentLocation.longitude}]`,
        );
      }

      // console.log(this.inRidePendingQueue);
    }, 5000);
  }

  @Destructor()
  onModuleDestroy() {
    clearInterval(this.timer);
  }

  async loadTrips(): Promise<void> {
    const trips = await this.tripService.getTripsForQueue();

    if (trips.length > 0) {
      this.loggerService.info('Queue Service is loading trips...');

      for (let index = 0; index < trips.length; index++) {
        const trip = trips[index];
        this.enqueueToInRidePending(trip);
        this.loggerService.info(
          `Trip with id ${trip.id} enqueue to in ride pending queue.`,
        );
      }

      this.loggerService.info(
        `Queue Service has been finished, loaded ${trips.length} ${
          trips.length > 1 ? 'trips' : 'trip'
        }.`,
      );
    } else {
      this.loggerService.info(
        `Queue Service has been finished, no trips found.`,
      );
    }
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
  enqueueToInRide(inRide: InRide): void {
    this.inRideQueue.set(inRide.id, inRide);
  }

  editInRideQueue(inRide: InRide): void {
    if (!this.existsInRideQueue(inRide.id)) return;

    this.enqueueToInRide(inRide);
  }

  updateInRideLocation(id: string, location: ILocation): void {
    if (!this.existsInRideQueue(id)) return;

    const inRide = this.getFromInRideQueue(id);

    if (!inRide) return;

    this.enqueueToInRide({
      ...inRide,
      currentLocation: location,
    });
  }

  getFromInRideQueue(id: string) {
    return this.inRideQueue.get(id);
  }

  deleteFromInRideQueue(id: string) {
    const inRide = this.getFromInRideQueue(id);

    const isDeleted = this.driversQueue.delete(id);

    if (isDeleted && inRide) {
      this.loggerService.info(
        `[${inRide.id}] Driver: ${inRide.driver.name}, Passenger: ${
          inRide.user.name
        } disconnected from [InRideQueue] at ${new Date().toLocaleString()}`,
      );
    } else {
      this.loggerService.info(
        `[${id}] Driver and Passenger are disconnected from [InRideQueue] at ${new Date().toLocaleString()}`,
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

  userExistsInRide(userId: string): boolean {
    let isInRide = false;

    this.inRideQueue.forEach((inRide, id) => {
      if (inRide.user.id === userId) {
        isInRide = true;
      }
    });

    return isInRide;
  }

  userIsInRide(userId: string): InRide | null {
    let inRide: InRide | null = null;

    this.inRideQueue.forEach(inRide => {
      if (inRide.user.id === userId) {
        inRide = inRide;
      }
    });

    return inRide;
  }

  driverExistsInRide(driverId: string): boolean {
    let isInRide = false;

    this.inRideQueue.forEach(inRide => {
      if (inRide.driver.id === driverId) {
        isInRide = true;
      }
    });

    return isInRide;
  }

  driverIsInRide(driverId: string): InRide | null {
    let inRide: InRide | null = null;

    this.inRideQueue.forEach(inRide => {
      if (inRide.driver.id === driverId) {
        inRide = inRide;
      }
    });

    return inRide;
  }

  /** In Ride Pending */
  enqueueToInRidePending(inRidePending: InRidePending): void {
    this.inRidePendingQueue.set(inRidePending.id, inRidePending);
  }

  editInRidePendingQueue(inRidePending: InRidePending): void {
    if (!this.existsInRidePendingQueue(inRidePending.id)) return;

    this.enqueueToInRidePending(inRidePending);
  }

  getFromInRidePendingQueue(id: string) {
    return this.inRidePendingQueue.get(id);
  }

  deleteFromInRidePendingQueue(id: string) {
    const inRidePending = this.getFromInRidePendingQueue(id);

    const isDeleted = this.inRidePendingQueue.delete(id);

    if (isDeleted && inRidePending) {
      this.loggerService.info(
        `[${inRidePending.id}] Passenger: ${
          inRidePending.user.name
        } disconnected from [InRideQueue] at ${new Date().toLocaleString()}`,
      );
    } else {
      this.loggerService.info(
        `[${id}] Driver and Passenger are disconnected from [InRideQueue] at ${new Date().toLocaleString()}`,
      );
    }
  }

  existsInRidePendingQueue(id: string): boolean {
    return this.inRidePendingQueue.has(id);
  }

  inRidePendingQueueSize(): number {
    return this.inRidePendingQueue.size;
  }

  inRidePendingQueueIsEmpty(): boolean {
    return this.inRidePendingQueueSize() === 0;
  }

  userExistsInRidePending(userId: string): boolean {
    let isInRidePending = false;

    this.inRidePendingQueue.forEach((inRidePending, id) => {
      if (inRidePending.user.id === userId) {
        isInRidePending = true;
      }
    });

    return isInRidePending;
  }

  userIsInRidePending(userId: string): InRidePending | null {
    let inRidePending: InRidePending | null = null;

    this.inRidePendingQueue.forEach(inRidePendingItem => {
      if (inRidePendingItem.user.id === userId) {
        inRidePending = inRidePendingItem;
      }
    });

    return inRidePending;
  }

  getFromInRideQueueByTrackingCode(trackingCode: string): InRide | null {
    let inRide: InRide | null = null;

    this.inRideQueue.forEach(inRideItem => {
      if (inRideItem.trackingCode === trackingCode) {
        inRide = inRideItem;
      }
    });

    return inRide;
  }

  sizes() {
    return {
      users: this.usersQueueSize(),
      drivers: this.driversQueueSize(),
      inRide: this.inRideQueueSize(),
    };
  }

  inRidePendingToArray() {
    return Array.from(this.inRidePendingQueue.values());
  }

  usersToArray(): User[] {
    const users = Array.from(this.usersQueue.values());
    const availableUsers = users.filter(
      user =>
        !this.userExistsInRide(user.id) &&
        !this.userExistsInRidePending(user.id),
    );

    return availableUsers;
  }

  driversToArray(): Driver[] {
    // return [
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '1',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.232198789888603,
    //       longitude: -79.42413003835996,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '12',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.232039422834763,
    //       longitude: -79.42268342626699,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '13',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.23138539247555,
    //       longitude: -79.41827878881867,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '14',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.2333249280210845,
    //       longitude: -79.42499088794959,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '15',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.230136444977575,
    //       longitude: -79.42706493454632,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '16',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.229961660358475,
    //       longitude: -79.42320590380129,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '17',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.231878649252484,
    //       longitude: -79.42783219394416,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '18',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.230579852633565,
    //       longitude: -79.42192346112886,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '19',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.228634667045279,
    //       longitude: -79.4233499953256,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '112',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.230654437151617,
    //       longitude: -79.41690563389751,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '124',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.230940850293583,
    //       longitude: -79.419255151521,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '151',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.229891744664079,
    //       longitude: -79.41380373629244,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '1123',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.230970402535964,
    //       longitude: -79.41098121397606,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '154',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.228206725603833,
    //       longitude: -79.42765110912202,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '165',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.232198789888603,
    //       longitude: -79.42413003835996,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '187',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.227534407638503,
    //       longitude: -79.42931930174386,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '1156',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.227467914584496,
    //       longitude: -79.42448601158114,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '134543',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.228162396952148,
    //       longitude: -79.43150135727964,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '1fsf',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.2226361737839175,
    //       longitude: -79.4304045526686,
    //     },
    //   },
    //   {
    //     avatar: 'https://i.imgur.com/53zR2sh.jpeg',
    //     dni: '12345678',
    //     email: 'hello@rix.dev',
    //     facebookId: '123456',
    //     id: '1fsaxsa',
    //     isAdmin: false,
    //     name: 'Roberto',
    //     phoneNumber: '987654321',
    //     location: {
    //       latitude: -7.225015166351945,
    //       longitude: -79.43165569710223,
    //     },
    //   },
    // ];
    const drivers = Array.from(this.driversQueue.values());
    const availableDrivers = drivers.filter(
      driver => !this.driverExistsInRide(driver.id),
    );

    return availableDrivers;
  }

  getClosestDriver(passengerLocation: ILocation, index = 0): Driver | null {
    if (passengerLocation.latitude === 0 && passengerLocation.longitude === 0) {
      return null;
    }

    const drivers = this.driversToArray();

    if (index >= drivers.length) {
      return null;
    }

    const sortedDrivers = drivers
      .slice(index)
      .sort((prevDriver, nextDriver) => {
        const distanceToA = getDistance(passengerLocation, prevDriver.location);
        const distanceToB = getDistance(passengerLocation, nextDriver.location);

        return distanceToA - distanceToB;
      });

    if (sortedDrivers.length > 0) {
      const foundDriver = sortedDrivers[0];

      if (
        (foundDriver.location.latitude === 0 &&
          foundDriver.location.longitude === 0) ||
        this.driverExistsInRide(foundDriver.id)
      ) {
        return this.getClosestDriver(passengerLocation, index + 1);
      }

      return foundDriver;
    }

    return null;
  }

  // getClosestDriver(passengerLocation: ILocation): Driver | null {
  //   if (passengerLocation.latitude === 0 || passengerLocation.longitude === 0) {
  //     return null;
  //   }

  //   const drivers = this.driversToArray();

  //   const sortedDrivers = drivers.sort((prevDriver, nextDriver) => {
  //     const distanceToA = getDistance(passengerLocation, prevDriver.location);
  //     const distanceToB = getDistance(passengerLocation, nextDriver.location);

  //     return distanceToA - distanceToB;
  //   });

  //   if (sortedDrivers.length > 0) {
  //     // Select the first closest driver
  //     const foundDriver = sortedDrivers[0];

  //     if (
  //       foundDriver.location.latitude === 0 ||
  //       foundDriver.location.longitude === 0
  //     ) {
  //       return null;
  //     }

  //     return foundDriver;
  //   }

  //   return null;
  // }
}
