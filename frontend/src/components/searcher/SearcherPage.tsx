
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import SearchRooms from './SearchRooms';
import RoomDetails from './RoomDetails';

const SearcherPage = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`} component={SearchRooms} />
      <Route path={`${path}/room/:id`} component={RoomDetails} />
      {/* Add more nested routes for the searcher page here */}
    </Switch>
  );
};

export default SearcherPage;
