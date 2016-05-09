import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('date-picker-component', { path: '/date-picker' });
  this.route('date-range-picker-component', { path: '/date-range-picker' });
});

export default Router;
