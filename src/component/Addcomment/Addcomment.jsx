import axios from "axios"
import { AuthContext } from "../Authcontext/Authcontext"
import { toast } from "react-toastify"
import { useContext } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as yup from "yup"
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons"
import { useFormik } from "formik"

export default function Addcomment({ id }) {
  const { token } = useContext(AuthContext)

  const validationSchema = yup.object({
    content: yup
      .string()
      .required("comment is required")
      .min(1, "write 1 character at least")
      .max(50, "max 50 character"),
  })

  async function handleSubmit(values, { resetForm }) {
    try {
      const { data } = await axios.post(
        `https://route-posts.routemisr.com/posts/${id}/comments`,
        {
          content: values.content,
        },
        { headers:{
          Authorization: `Bearer ${token}`
        } 
        }
      )

      if (data.success === true) {
        toast.success("Comment created successfully")
        resetForm()
        setTimeout(() => {
          window.location.reload()
        }, 3000);
      } else {
        toast.error("your Comment did not created")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const formik = useFormik({
    initialValues: {
      content: "",
    },
    onSubmit: handleSubmit,
    validationSchema,
  })

  return (
    <>
      <div className="px-4 md:px-5 py-3 bg-white rounded-2xl md:rounded-3xl mt-3 relative border border-slate-100/80 shadow-sm animate-fade-in-up">
        <form onSubmit={formik.handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 w-full px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="content"
          />

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center disabled:opacity-40 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-200 transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="text-sm"
            />
          </button>
        </form>
      </div>
    </>
  )
}
