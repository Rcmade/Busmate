import {createContext, useContext, useReducer} from 'react';
import {authUserReducer} from '../Reducers/AuthUserReducer';
const AuthUserContext = createContext();

const initialState = {
  isLoggedIn: false,
};

const AuthUserProvider = ({children}) => {
  const [state, dispatch] = useReducer(authUserReducer, initialState);

  return (
    <AuthUserContext.Provider
      value={{authUserState: state, authUserDispatch: dispatch}}>
      {children}
    </AuthUserContext.Provider>
  );
};

const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error('useAuthUser must be used within an AuthUserProvider');
  }
  return context;
};

export {AuthUserProvider, useAuthUser};
