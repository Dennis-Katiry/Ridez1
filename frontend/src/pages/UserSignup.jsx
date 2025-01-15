import { useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [userData, setuserData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    setuserData({
      fullName: {
        firstName: firstName,
        lastName: lastName
      },
      email: email,
      password: password
    });

    setemail(""), 
    setpassword(""), 
    setfirstName(""), 
    setlastName("");
  };
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What&apos;s your name</h3>
          <div className="flex gap-4 mb-6">
            <input
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Firstname"
              value={firstName}
              onChange={(e) => {
                setfirstName(e.target.value);
              }}
            />
            <input
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Lastname"
              value={lastName}
              onChange={(e) => {
                setlastName(e.target.value);
              }}
            />
          </div>
          <h3 className="text-lg font-medium mb-2">What&apos;s your email</h3>

          <input
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />

          <h3 className="text-lg font-medium mb-2">Enter password</h3>

          <input
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-base placeholder:text-base"
            required
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />

          <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-sm">
            Login
          </button>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login here
            </Link>
          </p>
        </form>
      </div>
      <div>
        <p className="text-[10px] leading-tight">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
