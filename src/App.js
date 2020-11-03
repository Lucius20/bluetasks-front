import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import NavBar from './components/NavBar';
import TaskForm from './components/TaskForm';
import TaskListTable from './components/TaskListTable';
import { AuthContext, useAuth } from './hooks/useAuth';

function App(props) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <div className="App">
          <NavBar /* onLinkClick={this.onRefreshHandler} */ />
          <div className="container" style={{ marginTop: '20px' }}>
            <Switch>
            <Route exact path="/" component={Login} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/form" component={TaskForm} />
              <Route exact path="/form/:id" component={TaskForm} />
              <Route path="/tasks" component={TaskListTable} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
