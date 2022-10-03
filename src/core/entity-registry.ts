import { IEntityDescriptor } from './entity-descriptor';
import { Type } from './types';

export interface IEntityRegistry {
  register(storeDescriptor: IEntityDescriptor): void;
  getDescriptor(type: Type): IEntityDescriptor | undefined;
}

/**
 * Manage the store discriptor
 */
export class EntityRegistry implements IEntityRegistry {
  private descriptors: IEntityDescriptor[] = [];
  private descriptorMap = new Map<Type, IEntityDescriptor>();

  register(storeDescriptor: IEntityDescriptor): void {
    const existedDescriptor = this.descriptorMap.get(storeDescriptor.type);
    if (existedDescriptor) {
      this.descriptorMap.set(storeDescriptor.type, { ...existedDescriptor, ...storeDescriptor });
    } else {
      this.descriptors.push(storeDescriptor);
      this.descriptorMap.set(storeDescriptor.type, storeDescriptor);
    }
  }

  getDescriptor(type: any): IEntityDescriptor | undefined {
    return this.descriptorMap.get(type);
  }
}
