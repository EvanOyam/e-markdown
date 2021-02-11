import { createContext } from 'react';
import { MdActionType, MdContextType, MdStateType } from '../typings/markdown';

export const mdReducer = (state: MdStateType, action: MdActionType) => {
  switch (action.type) {
    case 'setOpenMdId':
      return { ...state, openMdId: action.value };
    default:
      return { ...state };
  }
};

export const MdContext = createContext<MdContextType>({} as MdContextType);
export const MdContextProvider = MdContext.Provider;
