import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('usage', function () {
    this.route('date-picker');
    this.route('date-time-picker');
    this.route('date-range-picker');
    this.route('time-picker');
    this.route('custom-options');
    this.route('testing');
  });
  this.route('examples', function () {
    this.route('date-picker');
  });
});
