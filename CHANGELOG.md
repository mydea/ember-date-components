# Changelog

v0.5.2

* Add `disabled` attribute to date-picker & time-picker

v0.5.1

* Use time-picker's ID to build the input's ID (e.g. `my-id` -> `my-id-input`)

v0.5.0

* Add time-picker component

v0.4.0

* Allow selection of to-date without from-date
* to-date should always be `endOf('day')` (e.g. 23:59:59)

v0.3.2

* Move to selected month when switching between from- and to-date
* Fix bug which did not open to-field if no to-field has been selected

v0.3.1

* Fix bug if a null value is given to the date picker
* Set isToStep to false when closing the date picker
* Refactor the Sass partial to be under 'ember-date-components/addon'
* Send closeAction after all data has processed

v0.3.0

* Split date range picker into two separate input fields
* Add closeAction action

v0.2.0

* Complete refactor of date-picker
* Combine date-range-picker into date-picker
* Add custom options

v0.1.0

* Initial Release
