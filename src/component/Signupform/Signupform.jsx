import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import FormField from '../UI/FormField/FormField'
import axios from 'axios'
import { useState } from 'react'

export default function Signupform() {

  const navigate = useNavigate();
  
  const [ConflectEmail,setConflectEmail] = useState(null);

  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/

  async function handeleSubmit(values) {
    try {
      const options={
        url:"https://route-posts.routemisr.com/users/signup",
        method:"POST",
        data:values
      }
      const {data} = await axios.request(options);
      if (data.success === true) {
        toast.success("your account has been created")
        setTimeout(() => {
          navigate('/login')
        }, 5000)
      } 
    } catch (error) {
       if (error.response && error.response.status === 409) {
       setConflectEmail("User alredy Exists")
    } else {
      toast.error("Something went wrong");
      console.log(error);
    }
    }
     finally{
      setSubmitting(false)
    }
  }

  const signUpSchema = yup.object({
    name: yup.string().required('Name is reqired').min(3, 'Name must be at least 3 characters').max(25, 'Name must be at most 25 characters'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().required('Password is required').matches(passwordRegex, 'your pasword must be at leatest  Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'),
    rePassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Re-enter password'),
    dateOfBirth: yup.date().required('Date of Birth is required'),
    gender: yup.string().oneOf(['male', 'female']).required('gender is required')
  })

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: ""
    },
    validationSchema: signUpSchema,
    onSubmit: handeleSubmit
  })

  return (
    <>
      <div className="flex bg-slate-50 items-center justify-center min-h-screen py-8 px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100/80 overflow-hidden animate-fade-in-up">
            <div className='p-6 md:p-8'>
              <h1 className='text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight'>Create account</h1>
              <p className='py-2 text-slate-500 text-sm'>Already have an account? <Link className='text-indigo-500 hover:text-indigo-700 font-semibold transition-colors' to="/login">Sign in</Link></p>
              
              {/* Social Login Buttons */}
              <div className='grid grid-cols-2 gap-3 pt-5 pb-6'>
                <button className='w-full py-2.5 px-4 hover:shadow-md cursor-pointer rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm text-slate-700'>
                  <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
                  Google
                </button>
                <button className='w-full py-2.5 px-4 hover:shadow-md cursor-pointer rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-sm shadow-lg shadow-blue-200'>
                  <FontAwesomeIcon icon={faFacebookF} />
                  Facebook
                </button>
              </div>
              
              {/* Divider */}
              <div className="flex items-center gap-4 pb-2">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Or continue with email</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="px-6 md:px-8 pb-6 md:pb-8">

              <FormField
                elementType={'input'}
                type={'text'}
                id={'name'}
                name={'name'}
                placeholder={'Enter your Full Name'}
                lableText={'Full name'}
                value={formik.values.name}
                touched={formik.touched.name}
                error={formik.errors.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <FormField
                elementType={'input'}
                type={'text'}
                id={'email'}
                name={'email'}
                placeholder={'email@example.com'}
                lableText={'Email'}
                value={formik.values.email}
                touched={formik.touched.email}
                error={formik.errors.email}
                UserExist={ConflectEmail}
                onChange={(e) => {
                  formik.handleChange(e)
                  if (ConflectEmail) {
                    setConflectEmail(null)
                  }
                }}
                onBlur={formik.handleBlur}
              />
              <FormField
                elementType={'input'}
                type={'password'}
                id={'password'}
                name={'password'}
                placeholder={'Enter your Password'}
                lableText={'Password'}
                value={formik.values.password}
                touched={formik.touched.password}
                error={formik.errors.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormField
                elementType={'input'}
                type={'password'}
                id={'rePassword'}
                name={'rePassword'}
                placeholder={'Rewrite Your Password'}
                lableText={'Confirm Password'}
                value={formik.values.rePassword}
                touched={formik.touched.rePassword}
                error={formik.errors.rePassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-3 pt-4">
                <div className="w-full">
                  <FormField
                    elementType={'input'}
                    type={'date'}
                    id={'dateOfBirth'}
                    name={'dateOfBirth'}
                    lableText={'Date Of Birth'}
                    value={formik.values.dateOfBirth}
                    touched={formik.touched.dateOfBirth}
                    error={formik.errors.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    elementType={'select'}
                    id={'gender'}
                    name={'gender'}
                    lableText={'Gender'}
                    value={formik.values.gender}
                    touched={formik.touched.gender}
                    error={formik.errors.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={[
                      { text: 'Select'},
                      { text: 'Male', value: 'male' },
                      { text: 'Female', value: 'female' }
                    ]}
                  />
                </div>
              </div>

              <div className="w-full pt-6">
                <button type='submit' disabled={!(formik.isValid && formik.dirty)|| formik.isSubmitting} className='w-full disabled:cursor-not-allowed disabled:opacity-40 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-200 rounded-2xl p-3 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer'>
                  {formik.isSubmitting ? "Creating..." : "Create Account"} {!formik.isSubmitting && <FontAwesomeIcon icon={faArrowRightLong} className="ml-2" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
