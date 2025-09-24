import { signinUser } from "@/api/signin-post";
import { useUserSession } from "@/store/user";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { Label } from "radix-ui";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const user = useUserSession((s) => s.user);
  const setUser = useUserSession((s) => s.updateUserSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signin = useMutation({
    mutationFn: signinUser,
    onSuccess: () => {
      setUser({ email: email });
      navigate({ to: "/workflows" });
    },
  });

  function onClickHandler() {
    toast.promise(signin.mutateAsync({ email, password }), {
      loading: "Signing in...",
      success: "Sign in successful!",
      error: (err) => `Signin failed: ${err.message}`,
    });
  }

  if (user) {
    navigate({ to: "/workflows" });
    return <></>;
  }

  return (
    <div className="bg-graybg flex justify-center items-center text-white">
      <div className="flex flex-col">
        <div className="flex w-full justify-center">
          <span className="text-3xl font-bold">Sign In</span>
        </div>

        <div className="bg-highlighted p-6 rounded-2xl flex flex-col gap-3 my-4 w-96">
          <div className="flex flex-col">
            <Label.Root htmlFor="email">Email</Label.Root>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-black p-2 rounded-sm border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-800"
            ></input>
          </div>

          <div className="flex flex-col">
            <Label.Root htmlFor="password">Password</Label.Root>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white text-black p-2 rounded-sm border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-800"
            ></input>
          </div>

          <Link
            className="text-sm hover:underline hover:cursor-pointer"
            to="/signup"
          >
            Need an account?
          </Link>

          <button
            onClick={() => onClickHandler()}
            className="w-full bg-pop rounded-sm p-3 hover:cursor-pointer hover:bg-pophover transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
