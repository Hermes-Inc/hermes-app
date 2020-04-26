import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { UserActions } from '../../actions/UserActions';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const user = { name: 'Jorge' };
const credentials = {
  email: 'user@test.com',
  password: 'password',
};

// Init UserActions
// This should be a Mock Controller, not this shit
const userActions = new UserActions({ login: (email, password) => { return { name: 'Jorge', email } } });

describe('UserActions', () => {
  const store = mockStore(user);
  afterEach(() => {
    store.clearActions();
  });

  it('should create an action for login', () => {
    const expectedAction = [{ type: userActions.types.LOGIN.request }];

    // Dispatch the action
    store.dispatch(userActions.login(credentials.email, credentials.password));

    // Test if your store dispatched the expected actions
    const actions = store.getActions();
    expect(actions).toEqual(expectedAction);
  });

  it('should create an action for logout', () => {
    const expectedAction = {
      type: userActions.actionTypes.LOGOUT,
    };

    // Dispatch the action
    store.dispatch(userActions.logout());

    // Test if your store dispatched the expected actions
    const actions = store.getActions();
    expect(actions).toEqual([expectedAction]);
  });
});
