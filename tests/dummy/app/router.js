import Ember from 'ember';
import config from './config/environment';

const {
  Router: EmberRouter
} = Ember;

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('usage', function() {
    this.route('date-picker');
    this.route('date-range-picker');
    this.route('time-picker');
    this.route('custom-options');
  });
  this.route('examples', function() {
    this.route('date-picker');
  });
});

export default Router;
