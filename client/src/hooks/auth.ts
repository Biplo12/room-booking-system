import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
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
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", credentials);

    Cookies.set("access_token", data.data.access_token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: false,
      path: "/",
      expires: 7,
    });

    return data;
  } catch (error: any) {
    toast.error(error.response?.data.message || "Login failed");
    throw error;
  }
}

async function registerUser(
  credentials: RegisterCredentials
): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/register", credentials);
    toast.success("Account created successfully");
    return data;
  } catch (error: any) {
    toast.error(error.response?.data.message || "Failed to create account");
    throw error;
  }
}

async function verifyToken() {
  try {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("No token found");
    }
    
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const { data } = await api.get("/auth/verify");
    return data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.data?.msg === "Token has expired") {
      const customError = new Error("Session expired");
      customError.name = "SessionExpiredError";
      throw customError;
    }
    throw error;
  }
}


export function useLogin() {
  const router = useRouter();
  const { setUser } = useUserStore();

  return useMutation<AuthResponse, Error, AuthCredentials>({
    mutationFn: async (credentials) => {
      const data = await loginUser(credentials);
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
      
      return data;
    }
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation<AuthResponse, Error, RegisterCredentials>({
    mutationFn: async (credentials) => {
      const data = await registerUser(credentials);
      router.push("/login");
      
      return data;
    }
  });
}

export function useSession() {
  const { setUser, logout } = useUserStore();
  const router = useRouter();

  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const response = await verifyToken();
        const user = response.data;
        setUser({
          id: user.id,
          username: user.username,
          role: user.role,
        });
        return response;
      } catch (error: { name: string } | any) {
        if (error.name === "SessionExpiredError") {
          logout();
          router.push("/login");
          toast.error("Session expired, please login again");
        }
        throw error;
      }
    }
  });
}
