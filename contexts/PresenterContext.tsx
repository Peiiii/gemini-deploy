import React, { createContext, useContext } from 'react';
import { Presenter, presenter as globalPresenter } from '../presenter';

const PresenterContext = createContext<Presenter>(globalPresenter);

export const PresenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PresenterContext.Provider value={globalPresenter}>
      {children}
    </PresenterContext.Provider>
  );
};

export const usePresenter = () => useContext(PresenterContext);