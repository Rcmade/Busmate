import {createContext, useContext, useReducer} from 'react';
import {assignContributorReducer} from "../Reducers/AssignContributorReducer"
const AssignContributorContext = createContext();

const initialState = {wait: null, previous: null, assigned: false};

const AssignContributorProvider = ({children}) => {
  const [state, dispatch] = useReducer(assignContributorReducer, initialState);

  return (
    <AssignContributorContext.Provider
      value={{
        assignContributorState: state,
        assignContributorDispatch: dispatch,
      }}>
      {children}
    </AssignContributorContext.Provider>
  );
};

const useAssignContributor = () => {
  const context = useContext(AssignContributorContext);
  if (!context) {
    throw new Error(
      'useAssignContributor must be used within an AssignContributorProvider',
    );
  }
  return context;
};

export {AssignContributorProvider, useAssignContributor};
