import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export function SignUp() {
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
      const response = await axios.post("/api/user/signup", inputs);
      setUser(response.data);
      navigate("/sign-in");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <section className="mx-auto flex w-full max-w-screen-xl items-center justify-center p-4 md:py-4 lg:justify-around">
        <div className="hidden w-2/5 overflow-hidden lg:block">
          <img
            src="/img/piano.jpg"
            alt="Image de piano"
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>

        <form
          className="mb-2 w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <Typography variant="h2" className="mb-4 font-bold">
              Rejoignez-nous
            </Typography>
          </div>
          <div className="mb-1 flex flex-col gap-6">
            <label
              htmlFor="lastname"
              className="-mb-3 text-sm font-medium text-blue-gray-900"
            >
              Nom
            </label>
            <Input
              size="lg"
              placeholder="Votre nom"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              name="lastName"
              id="lastname"
              type="text"
              onChange={handleChange}
              autoFocus
            />
            <label
              htmlFor="firstname"
              className="-mb-3 text-sm font-medium text-blue-gray-900"
            >
              Prénom
            </label>
            <Input
              size="lg"
              placeholder="Votre prénom"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              name="firstName"
              id="firstname"
              type="text"
              onChange={handleChange}
            />
            <label
              htmlFor="email"
              className="-mb-3 text-sm font-medium text-blue-gray-900"
            >
              Email
            </label>
            <Input
              size="lg"
              placeholder="Email"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              name="email"
              id="email"
              type="email"
              onChange={handleChange}
            />
            <label
              htmlFor="password"
              className="-mb-3 text-sm font-medium text-blue-gray-900"
            >
              Mot de passe
            </label>
            <Input
              size="lg"
              placeholder="Votre mot de passe"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              name="password"
              id="password"
              type="password"
              onChange={handleChange}
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>

          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex flex-wrap items-center justify-start font-medium"
              >
                J'accepte les&nbsp;
                <a
                  href="#"
                  className="font-normal text-black underline transition-colors hover:text-gray-900"
                >
                  Conditions générales d'utilisation
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button
            type="submit"
            className="mt-6"
            fullWidth
            onClick={handleSubmit}
          >
            S'inscrire
          </Button>

          <Typography
            variant="paragraph"
            className="mt-4 text-center font-medium text-blue-gray-500"
          >
            Vous avez déjà un compte ?
            <Link to="/sign-in" className="ml-1 text-gray-900">
              Connectez-vous
            </Link>
          </Typography>
        </form>
      </section>
    </>
  );
}

export default SignUp;
