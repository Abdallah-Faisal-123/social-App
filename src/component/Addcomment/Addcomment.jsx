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
        "https://linked-posts.routemisr.com/comments",
        {
          content: values.content,
          post: id,
        },
        {
          headers: {
            token
          },
        }
      )

      if (data.message === "success") {
        toast.success("Comment created successfully")
        resetForm()
        window.location.reload()
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
      <div className="px-5 py-3 bg-white rounded-2xl mt-2.5 relative ">
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            placeholder="Add Comment"
            className=" rounded-2xl bg-gray-300 w-full px-2 py-3.5  "
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="content"
          />

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className=" disabled:bg-black bg-blue-600 p-2.5 rounded-2xl text-white hover:bg-blue-700 transition-colors absolute top-4 right-6"
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="group-hover:rotate-12 transition-transform"
            />
          </button>
        </form>
      </div>
    </>
  )
}
