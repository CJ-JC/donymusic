import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export function SignIn() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);

  const [inputs, setInputs] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/user/signin", inputs);
      setUser(response.data);
      if (response.data.user.role === "admin") {
        navigate("/administrator");
      } else {
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <section className="mx-auto flex h-auto w-full max-w-screen-xl items-center justify-center p-4 md:h-screen md:py-4 lg:justify-around">
        <form
          className="mb-2 w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <Typography variant="h2" className="mb-4 font-bold">
              Connexion
            </Typography>
          </div>
          <div className="mb-1 flex flex-col gap-6">
            <label
              htmlFor="email"
              className="-mb-3 text-sm font-medium text-blue-gray-900 dark:text-white"
            >
              Email
            </label>
            <Input
              size="lg"
              placeholder="Votre email"
              className=" dark:text-white"
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              autoFocus
            />
            <label
              htmlFor="password"
              className="-mb-3 text-sm font-medium text-blue-gray-900 dark:text-white"
            >
              Mot de passe
            </label>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" dark:text-white"
              id="password"
              name="password"
              onChange={handleChange}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <Button
            className="mt-6 dark:bg-white dark:text-black dark:hover:bg-gray-400"
            type="submit"
            fullWidth
            onClick={handleSubmit}
          >
            Connexion
          </Button>

          <div className="mt-6 flex flex-col items-center justify-between gap-2 md:flex-row">
            <Typography
              variant="small"
              className="font-medium text-gray-900 dark:text-white"
            >
              <a href="#">Mot de passe oublié</a>
            </Typography>
          </div>
          <Typography
            variant="paragraph"
            className="mt-4 text-center font-medium text-blue-gray-500 dark:text-white"
          >
            Vous n'avez pas de compte ?
            <Link
              to="/sign-up"
              className="ml-1 text-gray-900 dark:text-gray-300"
            >
              Créer un compte
            </Link>
          </Typography>
        </form>

        <div className="hidden w-2/5 overflow-hidden lg:block">
          <img
            src="/img/sign-in.jpg"
            className="h-[200px] w-full rounded-3xl object-cover md:h-[600px]"
            alt="Image de guitare"
          />
        </div>
      </section>
    </>
  );
}

export default SignIn;
