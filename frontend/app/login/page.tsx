"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/app/components/logo";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/authContext";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isSigningIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    organization: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);

    const success = await signIn(loginData);

    if (!success) {
      toast.error("Credenciais inválidas");
    }

    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.info("Funcionalidade em desenvolvimento");

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b border-border px-4 sm:px-6">
        <Logo />
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bem-vindo ao LivePass</CardTitle>
            <CardDescription>
              Entre na sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="register">Criar Conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">E-mail</Label>
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-login">Senha</Label>
                      <Link
                        href="#"
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password-login"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        required
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        className="bg-input pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || isSigningIn}
                  >
                    {isLoading || isSigningIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      required
                      value={registerData.name}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, name: e.target.value })
                      }
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Nome da organização</Label>
                    <Input
                      id="organization"
                      type="text"
                      placeholder="Nome da sua empresa"
                      required
                      value={registerData.organization}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          organization: e.target.value,
                        })
                      }
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">E-mail</Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, email: e.target.value })
                      }
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password-register"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="bg-input pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <Link href="#" className="text-accent hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="#" className="text-accent hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}