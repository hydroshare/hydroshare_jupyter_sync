import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {Button} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/FilterBar.css';

import * as FilterBarActions from '../store/actions/FilterBar';
import {
  FilterBarActionTypes,
  IRootState,
} from '../store/types';

const mapStateToProps = ({ filter }: IRootState) => {
  const { selectAll, sortBy } = filter;
  return { selectAll, sortBy };
};

const mapDispatchToProps = (dispatch: Dispatch<FilterBarActionTypes>) => {
  return {
    selectAll: () => dispatch(FilterBarActions.selectAll())
  }
};

type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class FilterBar extends React.Component<ReduxType, never> {
  // TODO: Keep the input state in the Redux store so that it's preserved if the user navigates to view the
  // resource details/contents and then comes back to the previous page (?)

  /*public onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({inputText: e.target.value});
  }

  public onAddClick = () => {
    this.props.addItem(this.state.inputText);
    this.setState({inputText: ''});
  }*/
    public deleteClick =() => {
        console.log("Send message to backend to delete")
    }

    public createNewResource =() => {
        console.log("Send message to backend to create new resource")
    }

  public render() {
    // const { selectAll, sortBy } = this.props;

    return (
      <div className='filterParent'>
            <Button className="new-resource-button" variant="outline-success" onClick={this.createNewResource}>+ New Resource</Button>
            <Button className="delete-button" variant="danger" onClick={this.deleteClick}>Delete</Button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterBar);
