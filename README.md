# ember-date-components

[![Build Status](https://travis-ci.org/mydea/ember-date-components.svg?branch=master)](https://travis-ci.org/mydea/ember-date-components)
[![Ember Observer Score](https://emberobserver.com/badges/ember-date-components.svg)](https://emberobserver.com/addons/ember-date-components)

An Ember add-on which provides pure Ember-based date picker components.

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

The date picker can also display custom options, e.g. 'Last 7 days'.

It also provides test helpers to easily interact with the date picker in integration & acceptance tests:

```js
import { getDatePicker, selectDate } from 'ember-date-components/test-support/helpers/date-picker';

await selectDate('.datepicker', moment());

// Or get a date picker object
let datepicker = getDatePicker('.datepicker');
datepicker.toggle();
datepicker.select(moment());
```

For more detailed instructions and examples,
please visit the [documentation](http://mydea.github.io/ember-date-components/).
