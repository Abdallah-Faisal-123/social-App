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
      console.log("Profile Data API Response:", data)

      if (data.data.user) {
        setUserPhoto(data.data.user.photo)
        

      }
      else {
        console.log("error")
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)


    }
  }
  useEffect(() => { getProfileData() }, [])
  return (
    <>
      <div className="pt-3 md:pt-5 px-2 sm:px-0">

        <div className="container bg-white rounded-xl md:rounded-2xl mx-auto max-w-full sm:max-w-xl shadow-lg md:shadow-2xl">
          <header className="p-2 md:p-2.5">
            <div className="flex">
              <img src={userphoto} alt="" className="size-10 md:size-12 rounded-full" />
              <div className="ms-2">
                <p className="font-semibold text-base md:text-lg">Create a Post</p>
                <span className="text-xs md:text-sm text-gray-600">Share your thoughts with the world</span>
              </div>
            </div>

            <div className=""></div>
          </header>
          <form onSubmit={formik.handleSubmit}>
            <div className="px-3 md:px-5">
              <FormField
                elementType={'texterea'}
                name="body"
                id="body"
                placeholder={`Whats on your mind?`}
                className={"w-full bg-gray-200 rounded px-3 md:px-5 py-2 md:py-3 text-sm md:text-base"}
                value={formik.values.body}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.body}
                touched={formik.touched.body}
              />
            </div>
            {preview && (
              <div className="p-3 md:p-5 relative">
                <img src={preview} alt="" className="w-full aspect-video object-cover rounded-xl md:rounded-2xl" />
                <button type="button" onClick={() => {
                  setPreview(null)
                  formik.setFieldValue('image', null)
                }} className="size-6 md:size-7 rounded-full flex justify-center items-center bg-red-500 hover:bg-red-600 transition-colors duration-100 text-white absolute top-5 md:top-7 right-5 md:right-7 cursor-pointer">
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            )}


            <div className="py-3 md:py-5 px-3 md:px-5 flex justify-between items-center">
              <button type="button" className="bg-gray-100 rounded p-1.5 md:p-2">
                <label htmlFor="image" className="cursor-pointer">
                  <div className="-mb-3 md:-mb-4">
                    <FontAwesomeIcon icon={faImage} className="text-gray-500 text-lg md:text-xl pe-1" />
                    <span className="text-sm md:text-base">Photo</span>
                  </div>
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
                className="text-white text-sm md:text-base rounded cursor-pointer disabled:cursor-not-allowed bg-gradient-to-r from-blue-600 to-cyan-400 px-3 md:px-4 py-1.5 md:py-2"
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
