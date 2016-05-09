import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('date-picker-component', { path: '/date-picker' });
  this.route('date-range-picker-component');
});

export default Router;
