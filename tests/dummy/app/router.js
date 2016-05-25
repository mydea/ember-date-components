import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('usage', function() {
    this.route('date-picker');
    this.route('date-range-picker');
  });
  this.route('examples', function() {
    this.route('date-picker');
  });
});

export default Router;
