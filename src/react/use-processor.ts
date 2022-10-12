import { ExtractProcessor, ExtractProcessors, Processor, Processors } from '../core/processor';
import { MutableQuery } from '../core/query';
import { Type } from '../core/types';
import { globalContainer } from './default';
import { useContainer } from './hooks';

/**
 * Get binded processor or bind the processo & convert to a exectable processor
 */
export function useInstantProcessors<T extends Processor[]>(...processors: T) {
  const container = useContainer() || globalContainer;
  const query = new MutableQuery(container);
  return processors.map((p) => (args: any) => p(query, args));
}

/**
 * Get Instant Executable Processor
 *
 * @param processor
 * @returns
 */
export function useInstantProcessor<T extends Processor>(processor: T) {
  const container = useContainer();
  const query = new MutableQuery(container);
  const instantProcessor = (...args: any[]) => processor(query, ...args);
  return instantProcessor as ExtractProcessor<typeof processor>;
}

/**
 * Get Processors
 *
 * @param t
 * @returns
 */
export function useProcessors<T extends Processors>(t: Type) {
  const container = useContainer();
  const processors = container.getProcessors(t);
  return processors as ExtractProcessors<T>;
}
