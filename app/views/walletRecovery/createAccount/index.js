import React, { Component } from 'react';

import {
    Row,
    Col,
    Form,
} from 'reactstrap';
import { connect } from 'react-redux';

import Store from '../../../store/userInfoStore/index';

import { Progress } from '../../../general/core/index';
import FooterButtons from '../../../general/footer/footer-buttons';
import DisplayIdenticons from '../../../general/identicons/index';

import * as CreateAccountAction from '../../../reducers/createAccount/action';

class CreateAccount extends Component {

    constructor(props) {
        super(props);
        this.state = { 
             accountName: '',
             password: '',
             confirmPassword: '',
             passwordHint: '',
             identiconsId: '',
             emailErrorText: '',
             passwordErrorText: '',
             confirmPasswordErrorText: '',
             animateRefreshIcon: false,
             passwordStrength: 0,
             };
    };

    componentWillMount(){
        const {accountName, accountIcon, password, passwordHint} = this.props;
        this.setState({
            accountName,
             password,
             confirmPassword: password,
             passwordHint,
             identiconsId: accountIcon,
        })
    }

      onNext(){
          const { toggle, setNewAccountDetail } = this.props;
         
          const { accountName, password, passwordHint, identiconsId } = this.state;
         if(this.isCreateAccount()){
            setNewAccountDetail(accountName.trim(), password, passwordHint, identiconsId);
            if(toggle){
                toggle('2');
            }
          }else{
              console.log('some error occured');
          }
      }

      isCreateAccount(){
        const {accountName, password, confirmPassword, emailErrorText, passwordErrorText, confirmPasswordErrorText, identiconsId } = this.state;

        let isConfirmed = true;
        if(accountName === ''){
            isConfirmed = false
        } else  if(password === ''){
            isConfirmed = false
        } else  if(confirmPassword === ''){
            isConfirmed = false
        } else if(emailErrorText !== ''){
            isConfirmed = false
        } else  if(passwordErrorText !== ''){
            isConfirmed = false
        }  else  if(confirmPasswordErrorText !== ''){
            isConfirmed = false
        } else  if(identiconsId === ''){
            isConfirmed = false
        } 
        return isConfirmed;
      }


      validateData = (event,value, name) => {
        event.preventDefault();
        let validationResult = '';
        if (name === 'accountName') {
            const regex = /^[a-zA-Z ]{2,30}$/;
            const result = regex.test(value);
            if(result){
                validationResult = {errorText: ''}
            } else {
                validationResult = {errorText:'Enter a valid name'}
            }
            const storeSize = (Store.size);
            if(storeSize > 0){
                const keys = Object.keys(Store.store);
                const accountDetailLsit = [];
                for(const key of keys){
                    accountDetailLsit.push(Store.store[key]);
                }

            for( const accountDetail of accountDetailLsit ){
                if(accountDetail.name === value){
                    validationResult = {errorText:'Username already exists!'}
                }
            }
            }

            // if (value.includes('@')) {
            //     validationResult = this.validEmail(value);
            // }
            // else{
            //     validationResult = {errorText: ''}
            // }
        } else if (name === 'password') {
            validationResult = this.validPass(value);
            this.passwordStrengthChecker(value);
        } else if (name === 'confirmPassword') {
            validationResult = this.validRepass(value);
        }
        return validationResult;
    }

    validPass = (value) => {
        const errorObj = {};
        if (value === '') {
            errorObj.errorText = 'Password field can\'t be empty';
        } else if (value.length < 8) {
            errorObj.errorText = 'Make your password with 8 characters or more. It can be any combination of letters, numbers, and symbols.';
        } else {
            errorObj.errorText = '';
        }
        return errorObj;
    }

    passwordStrengthChecker(value){
        const enoughRegex = new RegExp("(?=.{8,}).*", "g");
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})");
        const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{10,})");

        if (value.length===0) {
            this.setState({
                passwordStrength: 0
            })
        } else if (enoughRegex.test(value) === false ) {
            this.setState({
                passwordStrength: 10
            })
        } else if (strongRegex.test(value)) {
            this.setState({
                passwordStrength: 100
            })
        } else if (mediumRegex.test(value)) {
            this.setState({
                passwordStrength: 60
            })
        } else {
            this.setState({
                passwordStrength: 30
            })
        }
    }

    validEmail = (value) => {
        const errorObj = {};
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value === '') {
            errorObj.errorText = 'Account Name field can\'t be empty';
        } else if (re.test(String(value).toLowerCase())) {
            errorObj.errorText = '';
        } else {
            errorObj.errorText = 'You need to specify a valid account name';
        }
        return errorObj;
    }

    validRepass = (value) => {
        const errorObj = {};
        if (value === '') {
            errorObj.errorText = 'Re-enter password field can\'t be empty';
        } else if (value !== this.state.password) {
            errorObj.errorText = 'Password and re-enter password fields must be the same.';
        } else {
            errorObj.errorText = '';
        }
        return errorObj;
    }
      
      setAccountName(e){
         const accountName = e.target.value;
         const isValid = this.validateData(e,accountName, 'accountName');
         this.setState({
              accountName,
              emailErrorText: isValid.errorText,
          })
      }

      setPassword(e){
        const password = e.target.value.trim();
        const isValid = this.validateData(e,password, 'password');
        this.setState({
            password,
            passwordErrorText: isValid.errorText,
        })
     }

     setConfirmPassword(e){
        const confirmPassword = e.target.value.trim();
        const isValid = this.validateData(e,confirmPassword, 'confirmPassword');
        this.setState({
            confirmPassword,
            confirmPasswordErrorText: isValid.errorText,
        })
    }

    setPasswordHint(e){
        const passwordHint = e.target.value.trim();
        this.setState({
            passwordHint,
        })
    }

    getRadioIconData(identiconsId){
        // const { getRadioIconData } = this.props;
        this.setState({
            identiconsId, 
        })
        // if(getRadioIconData){
        //     getRadioIconData(identiconsId)
        // }
    }

    onRefresh(){
        const { onRefresh } = this.props;
        this.setState({
            animateRefreshIcon: true, 
        });
        if(onRefresh){
            onRefresh()
        }
        setTimeout(() => (this.setState({ animateRefreshIcon: false})), 1000);
    }

renderPasswordStrengthBar(){
    const {passwordStrength} = this.state;
    let strength = 0;
    let type = 'theme-red-Yellow-green';
     if(passwordStrength === 10 ){
        strength = 10;
        type = 'theme-red-Yellow-green';
    } else if(passwordStrength === 30 ){
        strength = 30;
        type = 'theme-red-Yellow-green';
    } else if(passwordStrength === 60 ){
        strength  = 60;
        type = 'theme-red-Yellow-green';
    } else  if(passwordStrength === 100 ){
        strength = 100;
        type = 'strong-password-bar';
    }
    return(
            <Progress type={type} value={strength} /> 
    )
}

// isGoToAccountManagement(){

// }

// onClose(){

// }
      
    render() {
         const {activeTab}=this.props;
        if(activeTab !== '1'){
            return null;
        }
      
        const {emailErrorText, passwordErrorText, confirmPasswordErrorText,
             accountName, password, passwordHint, confirmPassword, identiconsId, animateRefreshIcon} = this.state;
        return (
            <Row>
                <Col sm="12" style={{ paddingTop: '76px', paddingBottom: '31px' }}>
                    <div className="cs-container forms-container theme-blue-shadow inner mb-4">
                        <Row className="mx-0">
                            <Col sm="12" className="px-5 py-3">
                                <Form>
                                    <div className="form-element form-input">
                                        <input id="AccountName" className="form-element-field" value={accountName} placeholder=" " type="text" required="" 
                                        onChange={this.setAccountName.bind(this)}/>
                                        <div className="form-element-bar" />
                                        <label className="form-element-label" htmlFor="AccountName">Account Name</label>
                                        <small className="form-element-hint">{emailErrorText}</small>
                                    </div>
                                    
                                    <Row>
                                        <Col sm={6}>
                                            <div className="form-element form-input">
                                                <input id="Password" className="form-element-field" value={password} placeholder=" " type="password" required="" 
                                                onChange={this.setPassword.bind(this)}/>
                                                <div className="form-element-bar" />
                                                <label className="form-element-label" htmlFor="Password">Password</label>
                                                <small className="form-element-hint">{passwordErrorText}</small>
                                            </div>
                                        </Col>
                                        <Col sm={6}>
                                            <div className="form-element form-input">
                                                <input id="Re-enterPassword" className="form-element-field" value={confirmPassword} placeholder=" " type="password" required="" 
                                                onChange={this.setConfirmPassword.bind(this)}/>
                                                <div className="form-element-bar" />
                                                <label className="form-element-label" htmlFor="Re-enterPassword">Re- enter Password</label>
                                                <small className="form-element-hint">{confirmPasswordErrorText}</small>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="form-element form-input">
                                        <input id="PasswordHint" className="form-element-field" value={passwordHint} placeholder="(optional) a hint to remebering the password " type="text" required="" 
                                        onChange={this.setPasswordHint.bind(this)}/>
                                        <div className="form-element-bar" />
                                        <label className="form-element-label" htmlFor="PasswordHint">Password hint</label>
                                    </div>
                                    <Row className="mt-3">
                                        <Col>
                                            { this.renderPasswordStrengthBar() }
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                        <p className="Form-Text mt-3">Make your password with 8 characters or more. It can be any combination of letters, numbers, and symbols.</p>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                        <DisplayIdenticons
                            animateRefreshIcon={animateRefreshIcon} 
                            date={this.props.date} 
                            identiconsId={identiconsId} 
                            onRefresh={this.onRefresh.bind(this)}
                            getRadioIconData={this.getRadioIconData.bind(this)} />

                        <FooterButtons 
                            onNext={this.onNext.bind(this)} 
                            isNextActive={this.isCreateAccount()}
                            // onClose={this.onClose.bind(this)}
                            // isCloseActive={this.isGoToAccountManagement()}
                       />
                    </div>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = (state) => ({
    accountName: state.createAccountReducer.accountName,
    accountIcon: state.createAccountReducer.accountIcon,
    password:state.createAccountReducer.password,
    passwordHint: state.createAccountReducer.passwordHint,
});

const mapDispatchToProps = dispatch => ({
  setNewAccountDetail: (accountName, password, passwordHint, accountIcon) => {
    dispatch({ type: CreateAccountAction.CREATE_NEW_ACCOUNT, accountName, password, passwordHint, accountIcon });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateAccount);