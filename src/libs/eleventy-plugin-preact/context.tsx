import type { FunctionComponent, Consumer } from 'preact';
import { createContext} from 'preact';
import { useContext } from 'preact/hooks';

import type { EleventyContextType } from './types.ts';

const EleventyContext = createContext<EleventyContextType>(null);

export function useEleventyContext(): EleventyContextType {
  const context = useContext(EleventyContext);
  if (!context) {
    throw new Error(`Hook should be used inside provider 'EleventyContextProvider'`);
  }
  return context;
}

export const EleventyContextProvider: FunctionComponent<{ value: EleventyContextType }> = (props) => {
  return (
    <EleventyContext.Provider value={props.value}>
      {props.children}
    </EleventyContext.Provider>
  )
}

export const EleventyContextConsumer: Consumer<EleventyContextType> = (props) => {
  return (
    <EleventyContext.Consumer>
      {props.children}
    </EleventyContext.Consumer>
  )
}