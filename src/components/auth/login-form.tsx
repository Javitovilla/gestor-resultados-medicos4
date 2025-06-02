
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  documentType: z.string().min(1, { message: "Seleccione un tipo de documento." }),
  email: z.string().min(1, { message: "El número de identificación es requerido." }),
  password: z.string().min(6, { message: "La clave debe tener al menos 6 caracteres." }),
});

export function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // For demo purposes, login logic remains simple and ignores documentType for authentication
    if (values.email === "123456" && values.password === "123456") {
      login("mock-auth-token"); 
      toast({
        title: "Inicio de Sesión Exitoso",
        description: "¡Bienvenido de nuevo!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Fallo de Inicio de Sesión",
        description: "Número de identificación o clave inválidos.",
      });
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="documentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su tipo de documento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                  <SelectItem value="PA">Pasaporte</SelectItem>
                  <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Identificación</FormLabel>
              <FormControl>
                <Input placeholder="Su número de identificación" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clave</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  );
}
