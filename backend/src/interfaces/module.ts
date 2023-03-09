export interface OnModuleInit {
  onModuleInit: () => Promise<void> | void;
}

export interface OnModuleDestroy {
  onModuleDestroy: () => Promise<void> | void;
}
