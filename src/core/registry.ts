import { IDescriptor } from './descriptor';
import { Type } from './types';

export interface IRegistry {
  register(storeDescriptor: IDescriptor): void;
  getDescriptor(type: Type): IDescriptor | undefined;
}

/**
 * Manage the store discriptor
 */
export class Registry implements IRegistry {
  private descriptors: IDescriptor[] = [];
  private descriptorMap = new Map<Type, IDescriptor>();

  register(descriptor: IDescriptor): void {
    const existedDescriptor = this.descriptorMap.get(descriptor.type);
    if (existedDescriptor) {
      this.descriptorMap.set(descriptor.type, { ...existedDescriptor, ...descriptor });
    } else {
      this.descriptors.push(descriptor);
      this.descriptorMap.set(descriptor.type, descriptor);
    }
  }

  getDescriptor<T extends IDescriptor = IDescriptor>(type: any): T | undefined {
    return this.descriptorMap.get(type) as T | undefined;
  }
}
