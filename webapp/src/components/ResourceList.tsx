import {ChangeEvent} from "react";
import * as React from 'react';

import '../styles/ResourceList.scss';

import ArchiveResourceConfirmationModal from './modals/ArchiveResourceConfirmationModal';

import {
  IResource,
} from '../store/types';
import Loading from "./Loading";
import Modal from "./modals/Modal";
import { SortTriangleSVG } from './FilePane';

import NewResourceModal from './modals/NewResourceModal';
import { ICreateResourceRequest } from '../store/types';

interface IResourceListProps {
  className?: string
  deleteResources: (resources: IResource[]) => any
  deleteResourcesLocally: (resources: IResource[]) => any
  fetchingResources: boolean
  viewResource: any
  resources: {
      [resourceId: string]: IResource
  }
  createResource: (newResource: ICreateResourceRequest) => any
}

interface IStateTypes {
  allResourcesSelected: boolean
  filterBy: string
  modal: MODAL_TYPES
  selectedResources: Set<string>
  sortAscending: boolean
  sortBy: SORT_BY_OPTIONS
}

export default class ResourceList extends React.Component<IResourceListProps, IStateTypes> {

    state = {
      allResourcesSelected: false,
      filterBy: '',
      resourceToMaybeDelete: undefined,
      modal: MODAL_TYPES.NONE,
      selectedResources: new Set<string>(),
      sortAscending: true,
      sortBy: SORT_BY_OPTIONS.TITLE,
    };

  createResource = (data: ICreateResourceRequest) => {
    this.props.createResource(data);
    this.closeModal();
  };

    deleteSelectedResource = () => {
      this.props.deleteResources(Array.from(this.state.selectedResources).map(r => this.props.resources[r]));
      this.setState({modal: MODAL_TYPES.NONE});
    };

    deleteSelectedResourceLocally = () => {
      this.props.deleteResourcesLocally(Array.from(this.state.selectedResources).map(r => this.props.resources[r]));
      this.setState({modal: MODAL_TYPES.NONE});
    };

    showConfirmResourceDeletionModal = () => this.setState({ modal: MODAL_TYPES.CONFIRM_RESOURCE_DELETION });
    showNewResourceModal = () => this.setState({ modal: MODAL_TYPES.NEW_RESOURCE });
    showConfirmArchiveResourceModal = () => this.setState({ modal: MODAL_TYPES.CONFIRM_ARCHIVE_RESOURCE });


    setSortBy = (sortBy: SORT_BY_OPTIONS) => {
      if (sortBy === this.state.sortBy) {
        // If the user clicked the header of the column we're already sorted by, toggle sorting ascending/descending
        this.setState({sortAscending: !this.state.sortAscending});
      } else {
        // Otherwise change the the column we're sorted by
        this.setState({sortBy});
      }
    };

    closeModal = () => this.setState({ modal: MODAL_TYPES.NONE });

  toggleAllResourcesSelected = () => {
    let selectedResources;
    if (this.state.allResourcesSelected) {
      selectedResources = new Set<string>();
    } else {
      selectedResources = new Set(Object.keys(this.props.resources));
    }
    this.setState({
      allResourcesSelected: !this.state.allResourcesSelected,
      selectedResources,
    });
  };

  toggleSingleResourceSelected = (resource: IResource) => {
    let selectedResources = new Set(this.state.selectedResources);
    if (selectedResources.has(resource.id)) {
      selectedResources.delete(resource.id);
    } else {
      selectedResources.add(resource.id);
    }
    this.setState({
      allResourcesSelected: selectedResources.size === Object.keys(this.props.resources).length,
      selectedResources,
    });
  };

  getFilteredSortedResources = () => Object.values(this.props.resources)
    .filter(r => r.title.toLowerCase().includes(this.state.filterBy.toLowerCase()))
    .sort((r1, r2) => {
      switch (this.state.sortBy) {
        case SORT_BY_OPTIONS.TITLE:
          if (this.state.sortAscending) {
            return r1.title.localeCompare(r2.title);
          } else {
            return r2.title.localeCompare(r1.title);
          }
        case SORT_BY_OPTIONS.LAST_MODIFIED:
          if (this.state.sortAscending) {
            return r1.lastUpdated?.diff(r2.lastUpdated)
          } else {
            return r2.lastUpdated?.diff(r1.lastUpdated)
          }
        case SORT_BY_OPTIONS.OWNER:
          if (this.state.sortAscending) {
            return r1.creator.localeCompare(r2.creator);
          } else {
            return r2.creator.localeCompare(r1.creator);
          }
          case SORT_BY_OPTIONS.COPIED_LOCALLY:
            const r1Val = r1.localCopyExists ? "True" : "False";
            const r2Val = r2.localCopyExists ? "True" : "False";
            if (this.state.sortAscending) {
              return r1Val.localeCompare(r2Val);
            } else {
              return r2Val.localeCompare(r1Val);
            }
        default: // Should never happen, but needed to satisfy TypeScript
          return 0;
      }
    });

  filterTextChanged = (e: ChangeEvent<HTMLInputElement>) => this.setState({filterBy: e.target.value});

  public render() {
    const {
      allResourcesSelected,
      selectedResources,
      sortAscending,
      sortBy,
    } = this.state;


    let content: React.ReactNode;
    if (this.props.fetchingResources) {
      content = <Loading/>;
    } else {
      const resourcesToShow = this.getFilteredSortedResources();
      if (resourcesToShow.length > 0) {
        content = resourcesToShow.map(resource => (
            <div className="table-row">
              <input
                type="checkbox"
                checked={selectedResources.has(resource.id)}
                onChange={() => this.toggleSingleResourceSelected(resource)}
              />
              <span onClick={() => this.props.viewResource(resource)} className="clickable">{resource.title}</span>
              <span>{resource.lastUpdated.format('MMMM D, YYYY')}</span>
              <span>{resource.creator || 'Unknown'}</span>
              <span>{resource.localCopyExists ? 'True' : 'False'}</span>
            </div>
          )
        );
      } else {
        content = <div className="no-results">No resources</div>;
      }
    }

    const deleteButtonClassName = selectedResources.size === 0 ? "button-disabled": "button-enabled";

    let modal;
    switch (this.state.modal) {
      case MODAL_TYPES.NEW_RESOURCE:
        modal = <NewResourceModal
          close={this.closeModal}
          createResource={this.createResource}
        />;
        break;
      case MODAL_TYPES.CONFIRM_RESOURCE_DELETION:
        const selectedDelResources = Array.from(this.state.selectedResources).map(r => this.props.resources[r]);
        modal = <ResourceDeleteConfirmationModal
          close={this.closeModal}
          resources={selectedDelResources}
          submit={this.deleteSelectedResource}
        />
        break;
      case MODAL_TYPES.CONFIRM_ARCHIVE_RESOURCE:
        const selectedArchResources = Array.from(this.state.selectedResources).map(r => this.props.resources[r]);
        modal = <ArchiveResourceConfirmationModal
          close={this.closeModal}
          resources={selectedArchResources}
          submit={this.deleteSelectedResourceLocally}
        />
        break;
    }

    const classNames = ['ResourceList', 'table'];
    if (this.props.className) {
      classNames.push(this.props.className);
    }
    const sortOrder = sortAscending ? 'sort-ascending' : 'sort-descending';
    return (
      <div className={classNames.join(' ')}>
        <div className="ResourceList-header">
          <h2>My Resources</h2>
          <p>Here is a list of your HydroShare resources. To open one, simply click on its name.</p>
          <p>A resource is a collection of files on HydroShare, a place for sharing code and water data. These files can be code (e.g. Python or R), data (e.g. .csv, .xlsx, .geojson), or any other type of file.</p>
          <p>The list below shows the resources that exist in HydroShare and in JupyterHub. Resources only in HydroShare can be synced to JupyterHub, and then you can run code and edit data. All changes should be made
             in JupyterHub and then synced to HydroShare. Think of JupyterHub as your workspace and HydroShare are your sharing or archival space. </p>
          <p>To begin, click the <b>New Resource</b> button to create a new resource or click on an existing resource in the list to view files in that resource.</p> 
          <p><b>Delete: </b> This will delete a resource from your workspace and from HydroShare. Please save any files you want to your desktop before deleting as all of your work will be lost.</p>
          <p><b>Archive: </b> This will delete a resource from your workspace but save it in HydroShare. Please manually transfer from your workspace any remaining files you'd like to save to HydroShare before archiving as all of your files in your workspace will be lost.</p>
        </div>
        <div className="actions-row">
          <input className="search" type="text" placeholder="Search" onChange={this.filterTextChanged}/>
          <button className="button-enabled" onClick={this.showNewResourceModal}><span>New Resource</span></button>
          <button
            className={deleteButtonClassName}
            disabled={selectedResources.size === 0}
            onClick={this.showConfirmResourceDeletionModal}>
            <span>Delete</span>
          </button>
          <button className={deleteButtonClassName}
            disabled={selectedResources.size === 0}
            onClick={this.showConfirmArchiveResourceModal}>
            <span>Archive resource</span></button>
        </div>
        <div className="table-header table-row">
          <span className="checkbox">
            <input type="checkbox" checked={allResourcesSelected} onChange={this.toggleAllResourcesSelected}/>
          </span>
          <button
            className={'clickable ' + (sortBy === SORT_BY_OPTIONS.TITLE ? sortOrder : '')}
            onClick={() => this.setSortBy(SORT_BY_OPTIONS.TITLE)}
          >
            Name
            {sortBy === SORT_BY_OPTIONS.TITLE && SortTriangleSVG}
          </button>
          <button
            className={'clickable ' + (sortBy === SORT_BY_OPTIONS.LAST_MODIFIED ? sortOrder : '')}
            onClick={() => this.setSortBy(SORT_BY_OPTIONS.LAST_MODIFIED)}
          >
            Last Modified on HydroShare
            {sortBy === SORT_BY_OPTIONS.LAST_MODIFIED && SortTriangleSVG}
          </button>
          <button
            className={'clickable ' + (sortBy === SORT_BY_OPTIONS.OWNER ? sortOrder : '')}
            onClick={() => this.setSortBy(SORT_BY_OPTIONS.OWNER)}
          >
            Owner
            {sortBy === SORT_BY_OPTIONS.OWNER && SortTriangleSVG}
          </button>
          <button
            className={'clickable ' + (sortBy === SORT_BY_OPTIONS.COPIED_LOCALLY ? sortOrder : '')}
            onClick={() => this.setSortBy(SORT_BY_OPTIONS.COPIED_LOCALLY)}
          >
            Copied to workspace
            {sortBy === SORT_BY_OPTIONS.COPIED_LOCALLY && SortTriangleSVG}
          </button>
        </div>
        {content}
        {modal}
        </div>
    );
  }
}

type RDCModalProps = {
  close: () => any
  resources: IResource[]
  submit: () => any
};

const ResourceDeleteConfirmationModal: React.FC<RDCModalProps> = (props: RDCModalProps) => {
  return (
    <Modal close={props.close} title="Confirm Deletion" submit={props.submit} isValid={true} submitText="Delete" isWarning={true}>
      <p className="delete-header">Are you sure you want to delete the following resources?</p>
      {props.resources.map(r => <p className="delete-resource-list">{r.title}</p>)}
      <p>This will delete a resource from your workspace and from HydroShare.</p>
      <p>Please save any files you want to your desktop before deleting as all of your work will be lost.</p>
    </Modal>
  )
};


enum MODAL_TYPES {
  NONE,
  NEW_RESOURCE,
  CONFIRM_RESOURCE_DELETION,
  CONFIRM_ARCHIVE_RESOURCE,
}

enum SORT_BY_OPTIONS {
  TITLE,
  LAST_MODIFIED,
  OWNER,
  COPIED_LOCALLY,
}
