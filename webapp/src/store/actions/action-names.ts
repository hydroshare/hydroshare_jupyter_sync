export enum ResourcePageActions {
  TOGGLE_IS_SELECTED_ALL_JUPYTER = 'ResourcePageActions/TOGGLE_IS_SELECTED_ALL_LOCAL',
  TOGGLE_IS_SELECTED_ALL_HYDROSHARE = 'ResourcePageActions/TOGGLE_IS_SELECTED_ALL_HYDROSHARE',
  TOGGLE_IS_SELECTED_ONE_JUPYTER = 'ResourcePageActions/TOGGLE_IS_SELECTED_ONE_LOCAL',
  TOGGLE_IS_SELECTED_ONE_HYDROSHARE = 'ResourcePageActions/TOGGLE_IS_SELECTED_ONE_HYDROSHARE',
  SORT_BY_NAME = 'SORT_BY_NAME',
  SEARCH_BY = 'SEARCH_BY',
  SEARCH_RESOURCE_BY = 'SEARCH_RESOURCE_BY',
}

export enum ResourcesActions {
  NOTIFY_GETTING_RESOURCE_HYDROSHARE_FILES = 'ResourcesActions/NOTIFY_GETTING_RESOURCE_HYDROSHARE_FILES',
  NOTIFY_GETTING_RESOURCE_JUPYTERHUB_FILES = 'ResourcesActions/NOTIFY_GETTING_RESOURCE_JUPYTERHUB_FILES',
  SET_RESOURCES = 'ResourcesActions/SET_RESOURCES',
  SET_RESOURCE_LOCAL_FILES = 'ResourcesActions/SET_RESOURCE_LOCAL_FILES',
  SET_RESOURCE_HYDROSHARE_FILES = 'ResourcesActions/SET_RESOURCE_HYDROSHARE_FILES',
  NEW_RESOURCE = 'ResourcesActions/NEW_RESOURCE',
}

export enum UserInfoActions {
  SET_USER_INFO = 'UserInfoActions/SET_USER_INFO',
}
