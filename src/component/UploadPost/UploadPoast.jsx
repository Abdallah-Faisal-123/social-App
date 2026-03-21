import { faImage } from "@fortawesome/free-regular-svg-icons"
import FormField from "../UI/FormField/FormField"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../Authcontext/Authcontext"
import { useFormik } from "formik"
import * as yup from "yup"
import axios from "axios"
import { toast } from "react-toastify"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

export default function UploadPoast() {
  const [preview, setPreview] = useState(null)
  const { token } = useContext(AuthContext)
  const [userphoto, setUserPhoto] = useState(null)

  const validationSchema = yup.object({
    body: yup
      .string().required('caption is required').min(3, 'caption can not be less than 3 characters')
      .max(500, 'caption can not be more thane 500 characters'),
    image: yup
      .mixed().nullable().test("fileSize", 'File is too larg (max : 5MB)', (file) => {
        if (!file) return true;
        return file.size <= 5 * 1024 * 1024;
      }).test('fileType', 'onlyy image files are allowed', (file) => {
        if (!file) return true;
        const supportedTypes = [
          'image/jpg',
          'image/png',
          'image/jpeg',
          'image/gif'
        ];
        return supportedTypes.includes(file.type);
      }),
  });

  async function handleSubmit(values) {
    try {
      const formData = new FormData()
      formData.append('body', values.body);
      if (values.image) {
        formData.append('image', values.image)
      }
      const options = {
        url: "https://route-posts.routemisr.com/posts",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: formData
      };

      const { data } = await axios.request(options);

      if (data.success === true) {
        toast.success("Post created successfully")
        formik.resetForm()
        setPreview(null)
        setTimeout(()=>{
          window.location.reload()
        },5000)
      }
    } catch (error) {
      toast.error("failed to create a post")
    }
  }

  const formik = useFormik({
    initialValues: {
      body: '',
      image: null
    },
    onSubmit: handleSubmit,
    validationSchema: validationSchema
  })

  async function getProfileData() {
    try {
      const options = {
        url: `https://route-posts.routemisr.com/users/profile-data`,
        method: 'GET',
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
      const { data } = await axios.request(options)
      if (data.data.user) {
        setUserPhoto(data.data.user.photo)
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)
    }
  }
  useEffect(() => { getProfileData() }, [])

  return (
    <>
      <div className="pt-4 md:pt-6 px-2 sm:px-0">
        <div className="container bg-white rounded-2xl md:rounded-3xl mx-auto max-w-full sm:max-w-xl border border-slate-100/80 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-up">
          
          {/* Header */}
          <header className="p-4 md:p-5">
            <div className="flex items-center">
              <div className="relative">
                <img src={userphoto} alt="" className="size-11 md:size-12 rounded-2xl object-cover ring-2 ring-slate-100" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white"></div>
              </div>
              <div className="ms-3">
                <p className="font-bold text-sm md:text-base text-slate-800">Create a Post</p>
                <span className="text-xs text-slate-400 font-medium">Share your thoughts with the world</span>
              </div>
            </div>
          </header>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            <div className="px-4 md:px-5">
              <FormField
                elementType={'texterea'}
                name="body"
                id="body"
                placeholder={`What's on your mind?`}
                className={"w-full bg-slate-50 rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm md:text-[15px] border border-slate-100 focus:border-indigo-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none resize-none min-h-[80px] text-slate-700 placeholder:text-slate-400"}
                value={formik.values.body}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.body}
                touched={formik.touched.body}
              />
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="p-4 md:p-5 relative">
                <img src={preview} alt="" className="w-full aspect-video object-cover rounded-2xl" />
                <button type="button" onClick={() => {
                  setPreview(null)
                  formik.setFieldValue('image', null)
                }} className="size-7 md:size-8 rounded-full flex justify-center items-center bg-slate-800/60 hover:bg-red-500 backdrop-blur-sm transition-colors duration-200 text-white absolute top-6 md:top-7 right-6 md:right-7 cursor-pointer">
                  <FontAwesomeIcon icon={faXmark} className="text-sm" />
                </button>
              </div>
            )}

            {/* Footer Actions */}
            <div className="py-3 md:py-4 px-4 md:px-5 flex justify-between items-center border-t border-slate-50">
              <button type="button" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors duration-200 group cursor-pointer">
                <label htmlFor="image" className="cursor-pointer flex items-center gap-2">
                  <FontAwesomeIcon icon={faImage} className="text-slate-400 group-hover:text-indigo-500 text-lg transition-colors" />
                  <span className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">Photo</span>
                </label>
                <FormField
                  elementType={'file'}
                  type={'file'}
                  id={'image'}
                  className={'hidden'}
                  onChange={(e) => {
                    const file = e.target.files[0]
                    formik.setFieldValue('image', file)
                    const url = URL.createObjectURL(file)
                    setPreview(url)
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.errors.image}
                  touched={formik.touched.image}
                />
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="text-white text-sm font-semibold rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-5 md:px-6 py-2.5 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-200 active:scale-95"
              >
                {formik.isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
