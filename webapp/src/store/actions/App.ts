import { push } from 'connected-react-router';
import { AnyAction } from "redux";
import {
  ThunkAction,
  ThunkDispatch,
} from "redux-thunk";

import {
  getResources,
  getUserInfo,
} from '../async-actions';
import {
  IJupyterProject,
} from '../types';

export function loadInitData(): ThunkAction<Promise<void>, {}, {}, AnyAction> {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(getResources());
    dispatch(getUserInfo());
  };
}

export function viewProject(project: IJupyterProject) {
  return push('/projects/' + project.id);
}
