import { ReactNode } from 'react';
import { SocketAssistantProvider } from './SocketAssistantProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SocketAssistantProvider>
      {children}
    </SocketAssistantProvider>
  );
};