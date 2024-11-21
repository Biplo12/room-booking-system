import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Cookies from "js-cookie";

interface AuthCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials extends AuthCredentials {
  confirmPassword: string;
}

interface User {
  id: string;
  username: string;
  role: "user" | "admin";
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
  };
}

async function loginUser(credentials: AuthCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", credentials);

  Cookies.set("access_token", data.data.access_token, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    httpOnly: false,
    path: "/",
    expires: 7,
  });

  return data;
}

async function registerUser(
  credentials: RegisterCredentials
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", credentials);
  return data;
}

export function useLogin() {
  const router = useRouter();
  const { setUser } = useUserStore();

  return useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: loginUser,
    onSuccess: (data: AuthResponse) => {
      const user = data.data.user;
      setUser({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.data.access_token}`;

      toast.success("Logged in successfully");
      router.push("/");
    },
    onError: (error: Error & { response?: { data: { message: string } } }) => {
      toast.error(error.response?.data.message || "Login failed");
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/login");
    },
    onError: (error: Error & { response?: { data: { message: string } } }) => {
      toast.error(error.response?.data.message || "Failed to create account");
    },
  });
}
