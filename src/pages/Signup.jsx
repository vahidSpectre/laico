import React, { useEffect, useRef, useState } from 'react';
import {
 Autocomplete,
 IconButton,
 InputAdornment,
 TextField,
} from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Flag from 'react-world-flags';
import { Google, Visibility, VisibilityOff } from '@mui/icons-material';
import ReCAPTCHA from 'react-google-recaptcha';

import { accesModalActions, signupActions } from '../store/store';

import {
 getCitiesByCountry,
 useAllCountries,
 sendRegistrationData,
} from '../services/api';

import logo from '../assets/images/Logo.png';

import classes from './Signup.module.css';
import { useNavigation } from '../utils/helperFucntions';
const Signup = () => {
 const inputStyles = {
  mb: '0.5rem',
  '& .MuiInputBase-root': {
   direction: 'rtl', // Add RTL direction to the root
   textAlign: 'right', // Add right alignment to the root
   '& fieldset': {
    borderColor: 'black',
   },
  },
  '& .MuiInputBase-input': {
   color: 'rgb(0, 0, 0)',
   fontSize: '16px',
   direction: 'rtl', // Add RTL direction to the input
   textAlign: 'right', // Add right alignment to the input
  },
  '& .MuiInputLabel-root': {
   color: 'gray',
   fontSize: '14px',
   textAlign: 'right',
   direction: 'rtl',
   left: 'inherit',
   right: 0,
   '&.Mui-focused': {
    left: 'inherit',
    right: 0,
   },
  },
  '& .Mui-focused .MuiInputLabel-root': {
   color: 'black',
   transform: 'translate(0, -5px) scale(0.75)',
  },
  '& .Mui-focused .MuiInputBase-root': {
   '& fieldset': {
    borderColor: 'black',
   },
  },
 };

 const {
  data: countryData,
  isLoading: isLoadingAllCountries,
  isError: isErrorAllCountries,
 } = useAllCountries();

 const [firstname, setFirstname] = useState('');
 const [lastname, setLastname] = useState('');
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [repeatPassword, setRepeatPassword] = useState('');
 const [country, setCountry] = useState('');
 const [cityData, setCityData] = useState([]);
 const [selectedCountry, setSelectedCountry] = useState(null);
 const [city, setCity] = useState('');
 const [selectedCity, setSelectedCity] = useState(null);
 const [isError, setIsError] = useState(false);
 const [phoneCode, setPhoneCode] = useState('');
 const [phoneNumber, setPhoneNumber] = useState(null);
 const [notMatch, setNotMatch] = useState(false);
 const [minChar, setMinChar] = useState(false);
 const [errors, setErrors] = useState([]);

 const { navigateTo } = useNavigation();

 useEffect(() => {
  const storedData = localStorage.getItem('sis');

  if (storedData) {
   const parsedData = JSON.parse(storedData);

   if (parsedData) {
    setFirstname(parsedData.firstname || '');
    setLastname(parsedData.lastname || '');
    setEmail(parsedData.email || '');
    setPassword(parsedData.password || '');
    setCountry(parsedData.country || '');
    setPhoneCode(parsedData.phoneCode || '');
    setPhoneNumber(parsedData.phonenumber || null);
    setSelectedCountry(parsedData.selectedCountry);
    setCity(parsedData.city);
    setSelectedCity(parsedData.city);
   }
  }
 }, []);

 const { t } = useTranslation();

 const dispatch = useDispatch();

 const abortControllerRef = useRef(new AbortController());
 const formRef = useRef();

 const handleGetScore = e => {
  //   console.log(e.target.value);
 };

 const handleGoToLogin = () => {
  navigateTo('/login');
 };

 const handleGoToOtp = () => {
  navigateTo('/mobile-confirm');
 };

 const handleChange = e => {
  setCityData([]);
  const value = e.target.value;
  let inputCode = value.split('+').at(1);

  if (value.startsWith('+')) {
   setPhoneCode(value);
  } else {
   setPhoneCode('+' + value);
  }
  if (inputCode) {
   let foundCountryByCode = countryData.find(
    elem => elem.phonecode === inputCode,
   );
   if (foundCountryByCode) {
    setSelectedCountry(foundCountryByCode);
   } else {
    setSelectedCity(null);
   }
  }
 };

 const handleSubmit = async e => {
  e.preventDefault();

  const form = formRef.current;
  const formData = new FormData(form);
  const formEntries = Object.fromEntries(formData.entries());

  const requiredFields = [
   firstname?.trim(),
   lastname?.trim(),
   email?.trim(),
   password?.trim(),
   selectedCountry?.label?.trim(),
   selectedCity?.label?.trim(),
   phoneNumber?.trim(),
  ];

  const isValid = requiredFields.every(field => field && field.length > 0);

  if (!isValid) {
   setIsError(true);
  } else {
   setIsError(false);
   // dispatch(
   //  signupActions.set({
   //   ...formEntries,
   //   selectedCity: selectedCity,
   //   selectedCountry: selectedCountry,
   //   createdAt: new Date().toISOString(),
   //  }),
   // );

   try {
    sendFormData({
     password_confirmation: repeatPassword,
     password: repeatPassword,
     email: email,
     cellphone: phoneNumber,
     last_name: lastname,
     first_name: firstname,
     city_id: selectedCity.id,
     country_id: selectedCountry.id,
    });
   } catch (error) {
    if (errors) {
     //   dispatch(accesModalActions.otp());
    }
   }
  }
 };

 const login = useGoogleLogin({
  //   onSuccess: token => console.log(token),
 });

 const handleLoginSuccess = async response => {
  const idToken = response.credential;
  const userInfo = await fetch(
   'https://www.googleapis.com/oauth2/v3/userinfo',
   {
    method: 'GET',
    headers: {
     Authorization: `Bearer ${idToken}`,
    },
   },
  ).then(res => res.json());

  //  console.log('User Info:', userInfo);
 };
 // api calls

 const getCities = async (param, signal) => {
  const serverRes = await getCitiesByCountry(param, signal);
  if (serverRes.response.ok) {
   setCityData(serverRes.result.data);
  }
 };

 useEffect(() => {
  abortControllerRef.current.abort();
  abortControllerRef.current = new AbortController();

  if (selectedCountry) {
   setSelectedCity(null);
   setCityData([]);
   getCities(selectedCountry.id);
   setPhoneCode(`+${selectedCountry.phonecode || ''}`);
  }

  return () => {};
 }, [selectedCountry]);

 const sendFormData = async d => {
  const serverRes = await sendRegistrationData(d);
  if (serverRes.response.ok) {
   handleGoToOtp();
  } else {
   setErrors(serverRes.result.errors);
  }
 };

 return (
  <div className={classes.bg}>
   {' '}
   <div className={classes.content_wrapper}>
    <div className={classes.sheet}>
     <div className={classes.logo_wrapper}>
      <img className={classes.logo} src={logo} alt='' loading='lazy' />
     </div>
     <div className={classes.login_wrapper}>
      <div className={classes.actions}>
       <form onSubmit={handleSubmit} ref={formRef} className={classes.form}>
        <div className={classes.ep}>
         <TextField
          id='signup-firstname-input'
          name='firstname'
          label={'نام'}
          type='text'
          size='small'
          sx={inputStyles}
          onChange={e => {
           setFirstname(e.target.value);
          }}
          onFocus={() => setIsError(false)}
          error={isError && !firstname}
          value={firstname}
         />
         <TextField
          id='signup-lastname-input'
          name='lastname'
          label={'نام خانوادگی'}
          type='text'
          size='small'
          sx={inputStyles}
          onChange={e => {
           setLastname(e.target.value);
          }}
          onFocus={() => setIsError(false)}
          error={isError && !lastname}
          value={lastname}
         />
         <TextField
          id='signup-email-input'
          name='email'
          label={'ایمیل'}
          type='email'
          size='small'
          sx={inputStyles}
          onChange={e => {
           setEmail(e.target.value);
          }}
          onFocus={() => setIsError(false)}
          error={isError && !email}
          value={email}
         />
         <TextField
          id='signup-password-input'
          name='password'
          label={'رمز عبور'}
          type={showPassword ? 'text' : 'password'}
          size='small'
          sx={inputStyles}
          onChange={e => {
           setPassword(e.target.value);
          }}
          value={password}
          InputProps={{
           endAdornment: (
            <InputAdornment position='end'>
             <IconButton
              aria-label='show'
              style={{ width: '20px', height: 'auto' }}
              onClick={() => setShowPassword(!showPassword)}
              disableRipple>
              {showPassword ? (
               <Visibility fontSize='5' />
              ) : (
               <VisibilityOff fontSize='5' />
              )}
             </IconButton>
            </InputAdornment>
           ),
          }}
          onFocus={() => setIsError(false)}
          error={isError && !password}
         />
         <TextField
          id='signup-rpassword-input'
          name='rPassword'
          label={`تکرار رمز عبور`}
          type='password'
          size='small'
          sx={inputStyles}
          onChange={e => {
           setRepeatPassword(e.target.value);
          }}
          value={repeatPassword}
          onFocus={() => setIsError(false)}
          error={isError && !repeatPassword}
         />
         <Autocomplete
          id='country-autocomplete'
          disablePortal
          size='small'
          sx={inputStyles}
          value={selectedCountry}
          options={countryData || []}
          renderInput={params => (
           <TextField
            {...params}
            label={'کشور'}
            error={isError && !selectedCountry}
            name='country'
           />
          )}
          onInputChange={(e, value) => {
           setCountry(value);
          }}
          onChange={(e, newValue) => {
           setSelectedCountry(newValue);
          }}
          onFocus={() => setIsError(false)}
          disableInteractive={false}
         />
         <Autocomplete
          id='city-autocomplete'
          disablePortal
          size='small'
          sx={inputStyles}
          value={selectedCity}
          options={cityData || []}
          renderInput={params => (
           <TextField
            {...params}
            label={'شهر'}
            error={isError && !selectedCity}
            name='city'
           />
          )}
          onInputChange={(e, value) => {
           setCity(value);
          }}
          onChange={(e, newValue) => {
           setSelectedCity(newValue);
          }}
          onFocus={() => setIsError(false)}
         />
         <span className={classes.phone_wrapper}>
          <TextField
           id='phone-code-input'
           type='text'
           autoComplete='current-password'
           size='small'
           sx={{
            width: '30%',
            direction: 'ltr',
            ...inputStyles,
           }}
           InputProps={{
            startAdornment: (
             <InputAdornment position='start'>
              {selectedCountry && selectedCountry.length !== 0 && (
               <Flag
                code={selectedCountry.alias}
                style={{ width: '20px', height: 'auto' }}
               />
              )}
             </InputAdornment>
            ),
           }}
           value={phoneCode}
           onChange={handleChange}
           placeholder='+'
          />
          <TextField
           id='phone-number-input'
           name='phonenumber'
           label={'شماره موبایل'}
           value={phoneNumber}
           type='text'
           autoComplete='current-password'
           size='small'
           sx={{
            width: '68%',
            direction: 'ltr',
            ...inputStyles,
           }}
           onChange={e => {
            const value = e.target.value;
            const numericValue = value.replace(/[^0-9]/g, '');
            setPhoneNumber(numericValue);
           }}
           error={isError && !phoneNumber}
          />
         </span>

         {errors &&
          Object.keys(errors)?.length > 0 &&
          Object.values(errors).map(el => {
           return (
            <div className={classes.error_text} style={{ direction: 'rtl' }}>
             {el}
            </div>
           );
          })}
         <div
          className={classes.error_text}
          style={{
           direction: 'rtl',
           opacity: isError ? 1 : 0,
          }}>
          {'موبایل'}
         </div>
         <ul
          style={{
           direction: 'rtl',
           padding: '15px',
          }}>
          <li
           className={classes.check_text}
           style={{
            color: password.trim().length > 8 ? 'green' : 'red',
           }}>
           {t('signup.err_8char')}
          </li>
          <li
           className={classes.check_text}
           style={{
            color:
             password.trim().length > 0 &&
             password.trim() === repeatPassword.trim()
              ? 'green'
              : 'red',
           }}>
           {t('signup.err_notm')}
          </li>
         </ul>

         <ReCAPTCHA
          sitekey={`${process.env.REACT_APP_GOOGLE_RECAPTCHA_CLIENT_ID}`}
          className={classes.rec}
          onChange={handleGetScore}
          type='image'
         />

         <Button
          variant='contained'
          size='large'
          className={classes.login_btn}
          type='submit'>
          {'ثبت نام'}
         </Button>
        </div>
       </form>
       <div className={classes.oneclick_login_wrapper}>
        <div className={classes.google_login_wrapper}>
         <IconButton
          className={classes.mobile_login}
          disableRipple
          onClick={login}>
          <Google sx={{ fontSize: '20px !important' }} />
          <p>{'ورود با رمز یکبار مصرف'}</p>
         </IconButton>
        </div>
       </div>
       <div className={classes.signup_link} style={{ direction: 'rtl' }}>
        <p>{'حساب کاربری دارید؟'}</p>&nbsp;
        <button onClick={handleGoToLogin}>{'وارد شوید'}</button>&nbsp;
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};

export default Signup;
