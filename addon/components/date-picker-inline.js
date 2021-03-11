import DatePicker from './date-picker';
import template from '../templates/components/date-picker-inline';
import { layout } from '@ember-decorators/component';
import classic from 'ember-classic-decorator';

@layout(template)
@classic
export default class DatePickerInline extends DatePicker {}
