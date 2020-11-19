import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { string, func } from 'prop-types';
import { createBrowserHistory } from 'history';
import strings from '../language';
import LanguageActions from '../stores/language/actions';
import NotFoundPage from '../pages/notFound';
import getRoutes from './routes';

const history = createBrowserHistory();

class AppRouter extends Component {
  componentDidMount() {
    const language = strings.getLanguage();
    const { dispatch } = this.props;
    if (language !== 'es' && language !== 'en') {
      strings.setLanguage('es');
      dispatch(LanguageActions.setLanguage('es'));
    } else {
      strings.setLanguage(language);
      dispatch(LanguageActions.setLanguage(language));
    }
  }

  setLanguage = (language) => {
    const { dispatch } = this.props;
    strings.setLanguage(language);
    dispatch(LanguageActions.setLanguage(language));
  };

  render() {
    const { language, error } = this.props;
    const routes = getRoutes(error);
    if (!language) {
      return null;
    }
    return (
      <Router history={history}>
        <Switch>
          {routes.map(({ RouteComponent, path }) => (
            <Route
              key={path}
              path={path}
              exact
              component={({ history: historyComp, location, match }) => (
                <RouteComponent
                  history={historyComp}
                  location={location}
                  match={match}
                />
              )}
            />
          ))}
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}

AppRouter.propTypes = {
  language: string.isRequired,
  error: string.isRequired,
  dispatch: func.isRequired
};

const mapStateToProps = (state) => {
  const { language } = state.language;
  const { message: error } = state.error;
  return {
    language,
    error
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
