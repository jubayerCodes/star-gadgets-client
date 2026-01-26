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

  return (
    <section className="py-10">
      <div className="container max-w-6xl!">
        <div className="flex flex-col gap-5 max-w-lg mx-auto">
          <div className="flex flex-col gap-8">
            <h2>Login</h2>

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
