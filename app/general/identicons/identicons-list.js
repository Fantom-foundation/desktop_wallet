import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';
import Identicons from './identicons';

/**
 * IdenticonsIcon :  This component is meant for rendering IdenticonsIcon list in create account screen of wallet setup.
 */

export default class IdenticonsIcon extends Component {
  /**
   * getRadioIconData() : Function to handle selected Identicon, from list of icons.
   * @param {string} identiconsId
   */
  getRadioIconData(identiconsId) {
    const { getRadioIconData } = this.props;
    if (getRadioIconData) {
      getRadioIconData(identiconsId);
    }
  }

  render() {
    const index = this.props.index.toString();
    const date = this.props.date.toString();
    const identiconsId = index + date;
    const { accountIcon } = this.props;
    let checked = false;
    if (accountIcon && accountIcon === identiconsId) {
      checked = true;
    }
    return (
      <li>
        <FormGroup className="form-radio-label">
          <label>
            <div className="radio-holder">
              <input
                name="name"
                className="form-radio-field"
                type="radio"
                value={checked}
                defaultChecked={checked}
                onClick={() => this.getRadioIconData(identiconsId)}
              />
              <span />
            </div>
            <div className="d-inline-block theme-blue-shadow identicon-boxes-container">
              <Identicons id={identiconsId} width={40} size={3} />
            </div>
          </label>
        </FormGroup>
      </li>
    );
  }
}

/**
 * Custom setting props to be passed for Header display changes:
 *
 * accountIcon: Selected account icon for wallet account.
 * index: Index of selected icon from list.
 * date:  Constant string for creating a Identicons.
 *
 */

IdenticonsIcon.propTypes = {
  accountIcon: PropTypes.string,
  index: PropTypes.number,
  date: PropTypes.number
};

IdenticonsIcon.defaultProps = {
  date: '00000'
};
