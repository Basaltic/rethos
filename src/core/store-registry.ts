import { IStoreDescriptor } from './store-descriptor';
import { StoreType } from './types';

export interface IStoreDiscriptorRegistry {
  register(storeDescriptor: IStoreDescriptor): void;
  getDescriptor(type: StoreType): IStoreDescriptor | undefined;
}

/**
 * Manage the store discriptor
 */
export class StoreDiscriptorRegistry implements IStoreDiscriptorRegistry {
  private descriptors: IStoreDescriptor[] = [];
  private descriptorMap = new Map<StoreType, IStoreDescriptor>();

  register(storeDescriptor: IStoreDescriptor): void {
    const existedDescriptor = this.descriptorMap.get(storeDescriptor.type);
    if (existedDescriptor) {
      this.descriptorMap.set(storeDescriptor.type, { ...existedDescriptor, ...storeDescriptor });
    } else {
      this.descriptors.push(storeDescriptor);
      this.descriptorMap.set(storeDescriptor.type, storeDescriptor);
    }
  }

  getDescriptor(type: any): IStoreDescriptor | undefined {
    return this.descriptorMap.get(type);
  }
}
