# ember-date-components

[![Build Status](https://travis-ci.org/mydea/ember-date-components.svg?branch=master)](https://travis-ci.org/mydea/ember-date-components)
[![Ember Observer Score](https://emberobserver.com/badges/ember-date-components.svg)](https://emberobserver.com/addons/ember-date-components)

An Ember add-on which provides pure Ember-based date picker components.

## Compatibility

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above

## Installation

* `ember install ember-moment` - This is a dependency that you will need to install manually
* `ember install ember-date-components`

## Basic Usage

```hbs
{{date-picker action=(action 'updateDate')}}
```

```hbs
{{date-picker range=true action=(action 'updateDateRange')}}
```

```hbs
{{time-picker action=(action 'updateTime')}}
```


```hbs
{{date-time-picker action=(action 'updateDate')}}
```

The date picker can also display custom options, e.g. 'Last 7 days'.

It also provides test helpers to easily interact with the date picker in integration & acceptance tests:

```js
import { selectDate, selectDateRange, getSelectedDate, selectDateTime } from 'ember-date-components/test-support/helpers/date-picker';
import { selectTime, getSelectedTime } from 'ember-date-components/test-support/helpers/time-picker';

await selectDate('.my-datepicker', moment());
let momentInstance = await getSelectedDate('.my-datepicker');

await selectTime('.my-timepicker', moment());
let momentInstance = await getSelectedTime('.my-timepicker');

await selectDateTime('.my-date-time-picker', moment());

await selectDateRange('.my-datepicker', dateFrom, dateTo);
```

For more detailed instructions and examples,
please visit the [documentation](http://mydea.github.io/ember-date-components/).
