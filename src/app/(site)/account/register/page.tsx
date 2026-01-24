"use client";

import InputField from "@/components/form/site/input-field";
import PasswordField from "@/components/form/site/password-field";
import SeparatorText from "@/components/shared/separator-text";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useCreateUser } from "@/features/account/hooks/useAccount";
import { RegisterFormValues, registerSchema } from "@/features/account/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

function Register() {
  const { mutateAsync: createUser } = useCreateUser();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    const res = await createUser(values);

    if (res.success) {
      form.reset();
    }
  };

  return (
    <section className="py-10">
      <div className="container max-w-6xl!">
        <div className="flex flex-col gap-5 max-w-lg mx-auto">
          <div className="flex flex-col gap-8">
            <h2>Register</h2>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FieldGroup className="gap-4">
                <InputField form={form} name="name" label="Name" placeholder="Enter your name" required />
                <InputField form={form} name="email" label="Email" placeholder="Enter your email" required />
                <InputField form={form} name="phone" label="Phone" placeholder="Enter your phone" required />
                <PasswordField form={form} name="password" label="Password" placeholder="Enter your password" />
              </FieldGroup>

              <p>
                We use your personal data to support your experience on this website, to manage access to your account,
                and for other purposes described in our privacy policy.
              </p>

              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                REGISTER
              </Button>
            </form>
          </div>
          <SeparatorText text="Already have an account?" />
          <div>
            <p>
              If you already have an account with us, please login at the{" "}
              <Link href="/account/login" className="text-link hover:underline">
                login page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
