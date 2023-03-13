import Head from "next/head";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import Loader from "../components/Loader";
export default function Home() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // show error if student id or password is empty
  const onSubmit = async (data) => {
    // if student id and password is not empty, redirect to order page
    setLoading(true);
    if (data.studentId !== "" && data.password !== "") {
      try {
        const res = await axios.post("/api/user/signIn", {
          studentId: parseInt(data.studentId),
          password: data.password,
        });
        if (!res.data.error) {
          // store jwt token in local storage
          localStorage.setItem("token", res.data.token);
          router.push("/dashboard");
          // setLoading(false);
        } else {
          setError(res.data.error);
          // setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  // create a form that accept student id and password

  return (
    <>
      {/* <Navbar /> */}
      <div className="relative flex min-h-screen flex-col items-center justify-center space-y-4">
        {loading && <Loader />}
        <Head>
          <title>NCCU Dashboard</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1 className="text-5xl font-bold">NCCU</h1>
        <h1 className="text-5xl font-bold">Dashboard</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-2/3 flex-col items-center justify-center space-y-6"
        >
          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text">Student ID</span>
            </label>
            <input
              type="text"
              placeholder="Sutdent ID"
              className="input-bordered input w-full"
              {...register("studentId", { required: true })}
            />
            {errors.studentId && (
              <label className="label">
                <span className="label-text-alt w-full text-right text-red-500">
                  this field is required
                </span>
              </label>
            )}
          </div>

          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="text"
              placeholder="Sutdent ID"
              className="input-bordered input w-full"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <label className="label">
                <span className="label-text-alt w-full text-right text-red-500">
                  this field is required
                </span>
              </label>
            )}
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex w-full max-w-md flex-col items-center justify-center border-opacity-50">
            <button className="btn w-full max-w-md" type="submit">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
