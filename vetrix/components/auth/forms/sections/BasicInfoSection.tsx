import type React from "react"
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { EnhancedPasswordInput } from "../../enhanced-password-input"
import type { RegisterFormValues } from "../../schemas/register-schema"

export const BasicInfoSection: React.FC = () => {
    const { control, setValue, watch } = useFormContext<RegisterFormValues>()
    const password = watch("password")

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre de usuario *</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Ingrese su nombre de usuario" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                                <Input {...field} type="email" placeholder="Ingrese su dirección de correo electrónico" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <EnhancedPasswordInput
                                        id="password"
                                        name="password"
                                        label="Contraseña *"
                                        placeholder="Ingrese la contraseña (mínimo 12 caracteres)"
                                        value={field.value}
                                        onChange={(value) => setValue("password", value, { shouldValidate: true })}
                                        showStrengthIndicator={true}
                                        showGenerator={true}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar contraseña *</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" placeholder="Confirmar contraseña" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
