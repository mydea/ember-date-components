import Component from '@glimmer/component';
import { action } from '@ember/object';

/**
 * This is an extended {{input}} to send appropriate events for arrowUp/arrowDown.
 * It is also slightly changed to send an input-changed event when a key that is neither arrowUp/arrowDown, enter or escape
 * is pressed.
 */
export default class TimePickerInput extends Component {
  @action
  onKeyDown(event) {
    // Tab doesn't trigger keyUp, so we need to capture it in keyDown
    switch (event.key) {
      case 'Enter':
        return this._enter(event);
      case 'Escape':
        return this._escape(event);
      case 'ArrowUp':
        return this._arrowUp(event);
      case 'ArrowDown':
        return this._arrowDown(event);
      case 'Tab':
        return this._tab(event);
    }
  }

  @action
  onInput(event) {
    let { value } = event.target;

    this.args.onInput(value);
  }

  _tab(event) {
    this.args.onTab(event);
  }

  _arrowUp(event) {
    this.args.onArrowUp(event);
  }

  _arrowDown(event) {
    this.args.onArrowDown(event);
  }

  _escape(event) {
    this.args.onEscape(event);
  }

  _enter(event) {
    this.args.onEnter(event);
  }
}
