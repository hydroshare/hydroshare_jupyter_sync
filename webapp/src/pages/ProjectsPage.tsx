import * as React from 'react';
import FilterBar from '../components/FilterBar';
import ResourceList from '../components/ResourceList';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as AppActions from '../store/actions/App';
import * as projectPageActions from '../store/actions/projectPage';
import {
  AllActionTypes,
  IJupyterProject,
  IRootState,
} from '../store/types';

const mapStateToProps = ({ projects, projectPage }: IRootState) => {
  return {
    projectsList: Object.values(projects.allProjects),
    searchTerm: projectPage.searchTerm,
    sortBy: projectPage.sortBy,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AllActionTypes>) => {
  return {
    viewProject: (project: IJupyterProject) => dispatch(AppActions.viewProject(project)),
    searchBy: (searchTerm: string) => dispatch(projectPageActions.searchBy(searchTerm))
  }
};

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class ProjectsPage extends React.Component<ReduxType, never>  {

  public handleSearchChange = (event: any) => {
    this.props.searchBy(event.target.value)
  }

  public handleViewProject = (project: IJupyterProject) => {
    this.props.viewProject(project);
  }

  public render() {
    return (
      <div className="page projects">
        // @ts-ignore
        <FilterBar searchChange={this.handleSearchChange}/>
        <ResourceList viewProject={this.handleViewProject} projects={this.props.projectsList} searchTerm={this.props.searchTerm} sortBy={this.props.sortBy}/>
      </div>
    )
  }

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectsPage);

