import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import FormField from '../UI/FormField/FormField'
import axios from 'axios'
import { useContext, useState } from 'react'
import { AuthContext } from '../Authcontext/Authcontext'



export default function Signupform() {
 const {token,setToken} = useContext(AuthContext)
  console.log(token)
  const navigate = useNavigate();
  
  const [wrongCredentials,setwrongCredentials] = useState(null);

  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/

  async function handeleSubmit(values) {
    try {
       
      const options={
        url:"https://linked-posts.routemisr.com/users/signin",
        method:"POST",
        data:values

      }
      
      const {data} = await axios.request(options);
      if (data.message === 'success') {
        toast.success("Welcome Back")
        setToken(data.token)
        localStorage.setItem('token',data.token)        
        setTimeout(() => {
          navigate('/')
        }, 5000)
      } 
    } catch (error) {
       setwrongCredentials(error.response.data.error)
       
    }
  
  }


  const signUpSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().required('Password is required').matches(passwordRegex, 'your pasword must be at leatest  Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'),
  
  })



  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: signUpSchema,
    onSubmit: handeleSubmit
  })

  return (
    <>
      <div className=" flex bg-blue-50  py-11 items-center h-full ">
        <div className=" min-w-1/2 px-3 min-h-100  mx-auto rounded-3xl shadow-2xl">
          <div className='p-5'>
            <h1 className='text-2xl font-bold'>Create account</h1>
            <p className='py-2'>Don't have an account? <Link className='text-blue-500' to="/signup">Sign up</Link></p>
            <div className='grid grid-cols-2 py-5'>
              <button className='w-full py-2  px-7 hover:shadow-2xl hover:cursor-pointer rounded-lg  border  border-gray-300'><span className='px-2 font-bold text-red-500'><FontAwesomeIcon icon={faGoogle} /></span>
                Google
              </button>
              <button className='w-full py-2  px-7 hover:shadow-2xl hover:cursor-pointer rounded-lg  border  border-gray-300 bg-blue-500 text-white ml-2'>
                <span className='px-2 font-bold'><FontAwesomeIcon icon={faFacebookF} /></span>
                Facebook
              </button>
            </div>
            <div  >
              <p className="relative translate-x-2/6 text-[12px] before:absolute before:w-25  before:content-[''] before:-translate-27 before:top-1/2  before:-translate-y-1/2 before:h-[0.5px]  before:bg-gray-500  after:absolute after:w-25  after:content-[''] after:translate-2 after:top-1/2  after:-translate-y-1/2 after:h-[0.5px]  after:bg-gray-500 after:text-gray-500">Or Continue with Email</p>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="max-w-sm mx-auto pb-2 px-4 " >


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
              WrongCredentials={wrongCredentials}
              onChange={(e) => {
                formik.handleChange(e)
                if (wrongCredentials) {
                  setwrongCredentials(null)
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
           
              
      {wrongCredentials && (<div className="text-sm text-red-500 pt-2">*{wrongCredentials}</div> )}

            <div className="w-full py-3 text-white">
              <button type='submit' disabled={!(formik.isValid && formik.dirty)|| formik.isSubmitting} className='w-full disabled:cursor-not-allowed disabled:bg-linear-to-r disabled:from-gray-600 disabled:to-black  bg-linear-to-r from-blue-600 to-cyan-400 shadow rounded-xl p-2'> {formik.isSubmitting ? "Loading..." : "Login"} {!formik.isSubmitting && <FontAwesomeIcon icon={faArrowRightLong} />} </button>
            </div>
          </form>

        </div>
      </div>
    </>
  )
}
