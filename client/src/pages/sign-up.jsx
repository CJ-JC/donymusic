import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignUp() {
  return (
    <>
      <section className="m-8 mx-auto flex max-w-screen-xl">
        <div className="hidden h-full w-2/5 lg:block">
          <img
            src="/img/pattern.png"
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>
        <div className="flex w-full flex-col items-center justify-center lg:w-3/5">
          <div className="text-center">
            <Typography variant="h2" className="mb-4 font-bold">
              Rejoignez-nous
            </Typography>
            <p className="text-md text-blue-gray-900">Inscrivez-vous avec</p>
          </div>
          <form className="mx-auto mb-2 w-80 max-w-screen-lg lg:w-1/2">
            <div className="my-8 space-y-4">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-2">
                <Button
                  size="md"
                  color="white"
                  className="flex items-center justify-center gap-2 shadow-md"
                  fullWidth
                >
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1156_824)">
                      <path
                        d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z"
                        fill="#34A853"
                      />
                      <path
                        d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z"
                        fill="#FBBC04"
                      />
                      <path
                        d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1156_824">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Google</span>
                </Button>
                <Button
                  size="md"
                  color="white"
                  className="flex items-center justify-center gap-2 shadow-md"
                  fullWidth
                >
                  <img
                    src="/img/twitter-logo.svg"
                    height={24}
                    width={24}
                    alt=""
                  />
                  <span>Twitter</span>
                </Button>
              </div>
            </div>
            <div className="mb-1 flex flex-col gap-6">
              <label
                htmlFor="name"
                className="-mb-3 text-sm font-medium text-blue-gray-900"
              >
                Nom
              </label>
              <Input
                size="lg"
                placeholder="Votre nom"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                id="name"
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
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                id="firstname"
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
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                id="email"
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
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                id="password"
              />
            </div>
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
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
            <Button className="mt-6" fullWidth>
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
        </div>
      </section>
    </>
  );
}

export default SignUp;
