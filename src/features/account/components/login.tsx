"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/features/account/schema";
import { useLoginUser } from "../hooks/useAccount";
import { useRouter } from "next/navigation";
import { FieldGroup } from "@/components/ui/field";
import InputField from "@/components/form/site/input-field";
import PasswordField from "@/components/form/site/password-field";
import { Button } from "@/components/ui/button";
import SeparatorText from "@/components/shared/separator-text";
import Link from "next/link";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: loginUser } = useLoginUser();

  const handleSubmit = async (values: LoginFormValues) => {
    const res = await loginUser(values);

    if (res.success) {
      form.reset();
      router.push("/account");
    }
  };

  const fillAdminCredentials = () => {
    form.setValue("email", "admin@gmail.com");
    form.setValue("password", "Admin#1112");
  };

  return (
    <section className="py-10">
      <div className="container max-w-6xl!">
        <div className="flex flex-col gap-5 max-w-lg mx-auto">
          <div className="flex flex-col gap-8">
            <h2>Login</h2>

            {/* Admin credential hint for portfolio reviewers */}
            <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4 flex flex-col gap-3">
              <p className="text-sm font-semibold text-primary">🔑 Demo Admin Credentials</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Email:</span>
                <span>admin@gmail.com</span>
                <span className="font-medium text-foreground">Password:</span>
                <span>Admin#1112</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit text-xs"
                onClick={fillAdminCredentials}
              >
                Auto Fill
              </Button>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FieldGroup className="gap-4">
                <InputField form={form} name="email" label="Email" placeholder="Enter your email" required />
                <PasswordField form={form} name="password" label="Password" placeholder="Enter your password" />
              </FieldGroup>

              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                LOGIN
              </Button>
            </form>
          </div>
          <SeparatorText text="Or" />
          <GoogleLoginButton />
          <SeparatorText text="Don't have an account?" />
          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full" variant="outline" asChild>
            <Link href="/account/register">REGISTER</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Login;
